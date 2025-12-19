import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderReceipt from "@/components/emails/order-receipt";

import { db } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2024-06-20",
  typescript: true,
});

// Initialize Resend only if API key is available
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("[RESEND_INIT] Failed to initialize Resend:", error);
  resend = null;
}

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return "";

  const street = [address.line1, address.line2].filter(Boolean).join(" ");
  const cityStateZip = [address.city, address.state, address.postal_code].filter(Boolean).join(", ");
  const base = [street, cityStateZip].filter(Boolean).join(", ");

  // Country is optional; add it at the end if present
  return address.country ? [base, address.country].filter(Boolean).join(", ") : base;
}

type CartItemMetadata = {
  id: string;
  size: string;
  quantity: number;
};

function parseCartItems(raw: string | null | undefined): CartItemMetadata[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: String((item as any)?.id ?? ""),
        size: String((item as any)?.size ?? ""),
        quantity: Number((item as any)?.quantity ?? 0),
      }))
      .filter((i) => i.id && i.size && Number.isFinite(i.quantity) && i.quantity > 0);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const phone = session.customer_details?.phone ?? "";
      const address = formatAddress(session.customer_details?.address);
      const customerName = session.customer_details?.name ?? "";
      const customerEmail = session.customer_details?.email ?? "";
      const deliveryMethod = (session.metadata?.deliveryMethod as string) || "standard";
      const cartItems = parseCartItems(session.metadata?.cartItems);

      try {
        // First, check if order is already paid (idempotency check)
        const existing = await db.order.findUnique({ where: { id: orderId }, select: { isPaid: true } });
        if (existing?.isPaid) {
          console.log("[WEBHOOK] Order already marked as paid, skipping update");
        } else {
          // Log customer details for debugging
          console.log("[WEBHOOK] Customer details:", {
            name: customerName,
            email: customerEmail,
            phone: phone,
            address: address,
          });

          // Update order first (outside transaction to avoid timeout)
          try {
            const updateData: any = {
              isPaid: true,
              phone,
              address,
            };
            
            // Add customer name and email if available
            if (customerName) {
              updateData.customerName = customerName;
            }
            if (customerEmail) {
              updateData.customerEmail = customerEmail;
            }
            
            // Only add deliveryMethod if it's a valid value
            if (deliveryMethod && ['standard', 'express', 'pickup', 'us'].includes(deliveryMethod)) {
              updateData.deliveryMethod = deliveryMethod;
            }

            console.log("[WEBHOOK] Updating order with data:", updateData);
            const updatedOrder = await db.order.update({
              where: { id: orderId },
              data: updateData,
            });
            console.log("[WEBHOOK] Order updated successfully:", {
              orderId,
              isPaid: updatedOrder.isPaid,
              customerName: updatedOrder.customerName,
              customerEmail: updatedOrder.customerEmail,
            });
          } catch (updateError: any) {
            // If new fields don't exist in DB yet, try without them
            console.error("[WEBHOOK] Error updating with new fields:", updateError?.message);
            console.error("[WEBHOOK] Error details:", updateError);
            
            // Try fallback without new fields - use the variables from outer scope
            const fallbackName = customerName || "";
            const fallbackEmail = customerEmail || "";
            
            try {
              const fallbackData: any = {
                isPaid: true,
                phone,
                address,
              };
              
              // Try to add fields one by one if they exist
              if (fallbackName) {
                fallbackData.customerName = fallbackName;
              }
              if (fallbackEmail) {
                fallbackData.customerEmail = fallbackEmail;
              }
              
              await db.order.update({
                where: { id: orderId },
                data: fallbackData,
              });
              console.log("[WEBHOOK] Order updated with fallback data");
            } catch (fallbackError: any) {
              console.error("[WEBHOOK] Fallback update also failed:", fallbackError?.message);
              // Final fallback - just the essential fields
              await db.order.update({
                where: { id: orderId },
                data: {
                  isPaid: true,
                  phone,
                  address,
                },
              });
              console.log("[WEBHOOK] Order updated with minimal data only");
            }
          }

          // Update stock quantities separately (can be done outside transaction for MongoDB)
          // MongoDB doesn't require transactions for single-document operations
          for (const item of cartItems) {
            try {
              const sizeRecord = await db.size.findFirst({
                where: {
                  productId: item.id,
                  value: item.size,
                },
                select: { id: true, quantity: true },
              });

              if (!sizeRecord) {
                console.warn(`[WEBHOOK] Size record not found for product ${item.id}, size ${item.size}`);
                continue;
              }

              const newQty = Math.max(0, sizeRecord.quantity - item.quantity);
              if (newQty === sizeRecord.quantity) continue;

              await db.size.update({
                where: { id: sizeRecord.id },
                data: { quantity: newQty },
              });
            } catch (stockError) {
              console.error(`[WEBHOOK] Error updating stock for item ${item.id}:`, stockError);
              // Continue with other items even if one fails
            }
          }
        }

      // Send order confirmation email (only if Resend is configured)
      // This is done asynchronously to avoid blocking order processing
      // Use the customerEmail variable that was already defined above
      let emailToSend = customerEmail || session.customer_details?.email || "";
      
      // For testing: Resend only allows sending to verified email in test mode
      // In production with verified domain, this check won't be needed
      const verifiedEmail = process.env.RESEND_VERIFIED_EMAIL; // Optional: set in .env
      const isTestMode = process.env.NODE_ENV === "development" && !process.env.RESEND_DOMAIN_VERIFIED;
      
      if (isTestMode && verifiedEmail) {
        console.log("[EMAIL] Test mode: Redirecting email to verified address for testing");
        console.log("[EMAIL] Original recipient:", emailToSend);
        emailToSend = verifiedEmail;
      }
      
      console.log("[WEBHOOK] Email sending check:", {
        email: emailToSend,
        customerEmailFromVar: customerEmail,
        customerEmailFromSession: session.customer_details?.email,
        resendConfigured: !!resend,
        resendApiKey: !!process.env.RESEND_API_KEY,
        isTestMode,
        verifiedEmail,
      });
      
      if (emailToSend && resend) {
        // Don't await - let it run in the background
        (async () => {
          try {
            console.log("[EMAIL] Starting email send process for:", emailToSend);
            
            // Fetch full order data with products
            const fullOrder = await db.order.findUnique({
              where: { id: orderId },
              include: {
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
            });

            if (fullOrder) {
              // Calculate totals
              const subtotal = fullOrder.orderItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
              );
              const total = (session.amount_total ?? 0) / 100; // Convert from cents
              const shippingCost = total - subtotal;

              // Prepare products array for email
              const products = fullOrder.orderItems.map((item) => ({
                name: item.product.name,
                image: item.product.images[0] || "",
                size: item.size || "One Size",
                quantity: item.quantity,
                price: item.product.price,
              }));

              // Format shipping address
              const formattedAddress = address || "Address not provided";

              console.log("[EMAIL] Sending email to:", emailToSend);
              
              // Send email
              const emailResult = await resend.emails.send({
                from: "MyPlug <onboarding@resend.dev>",
                to: emailToSend,
                subject: `Order Confirmed: #${fullOrder.id.slice(-6).toUpperCase()}`,
                react: OrderReceipt({
                  orderId: fullOrder.id,
                  customerName: fullOrder.customerName || customerName || undefined,
                  customerEmail: fullOrder.customerEmail || customerEmail || undefined,
                  products,
                  shippingAddress: formattedAddress,
                  total,
                  subtotal,
                  shipping: shippingCost > 0 ? shippingCost : undefined,
                }),
              });
              
              // Log full response for debugging
              console.log("[EMAIL] Resend response:", JSON.stringify(emailResult, null, 2));
              
              if (emailResult.error) {
                console.error("[EMAIL] Resend API error:", emailResult.error);
                throw new Error(`Resend API error: ${JSON.stringify(emailResult.error)}`);
              }
              
              if (!emailResult.data || !emailResult.data.id) {
                console.warn("[EMAIL] Email sent but no ID returned. Response:", emailResult);
              } else {
                console.log("[EMAIL] Email sent successfully:", {
                  emailId: emailResult.data.id,
                  to: emailToSend,
                });
              }
            } else {
              console.error("[EMAIL] Order not found:", orderId);
            }
          } catch (emailError: any) {
            // Log error but don't fail the webhook
            console.error("[EMAIL_ERROR] Failed to send email:", emailError?.message);
            console.error("[EMAIL_ERROR] Full error:", emailError);
          }
        })().catch((err) => {
          console.error("[EMAIL_ERROR] Unhandled promise rejection:", err);
        });
      } else {
        if (!emailToSend) {
          console.warn("[EMAIL_WARNING] No customer email found in session");
        }
        if (!resend) {
          console.warn("[EMAIL_WARNING] Resend API key not configured. Email not sent.");
        }
      }
      } catch (error) {
        console.error("[WEBHOOK_ERROR] Error processing checkout.session.completed:", error);
        console.error("[WEBHOOK_ERROR] Order ID:", orderId);
        console.error("[WEBHOOK_ERROR] Error details:", error instanceof Error ? error.message : String(error));
        // Still return 200 to prevent Stripe from retrying
        // The error is logged for debugging
        return NextResponse.json({ 
          received: true, 
          error: "Order processing failed but acknowledged",
          orderId: orderId 
        }, { status: 200 });
      }
    }
  }

  return NextResponse.json({ received: true });
}


