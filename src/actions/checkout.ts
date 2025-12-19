"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { CartItem, DeliveryMethod } from "@/store/use-cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //@ts-ignore
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function checkout(items: CartItem[], deliveryMethod: DeliveryMethod = "standard") {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (!origin) {
    return { error: "Missing origin header" };
  }

  // Stock validation (server-side final check)
  // Prevent creating an order / Stripe session if requested quantities exceed what's in DB.
  const purchasable = items.filter((i) => i.selectedSize && i.selectedSize !== "One Size");
  if (purchasable.length > 0) {
    const productIds = Array.from(new Set(purchasable.map((i) => i.id)));
    const sizeValues = Array.from(new Set(purchasable.map((i) => i.selectedSize)));

    const sizes = await db.size.findMany({
      where: { productId: { in: productIds }, value: { in: sizeValues } },
      select: { productId: true, value: true, quantity: true },
    });

    const byKey = new Map<string, number>();
    for (const s of sizes) {
      byKey.set(`${s.productId}::${s.value}`, s.quantity);
    }

    for (const item of purchasable) {
      const available = byKey.get(`${item.id}::${item.selectedSize}`);
      if (typeof available !== "number") {
        return { error: `Size ${item.selectedSize} is not available for ${item.name}.` };
      }
      if (item.quantity > available) {
        return { error: `Only ${available} left for ${item.name} (Size: ${item.selectedSize}).` };
      }
    }
  }

  // Build shipping options based on delivery method
  let shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];
  let allowedCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = ["CA"];

  if (deliveryMethod === "standard") {
    shipping_options.push({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 2000, currency: "cad" },
        display_name: "Canada Post Standard",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 2 },
          maximum: { unit: "business_day", value: 2 },
        },
      },
    });
  } else if (deliveryMethod === "express") {
    shipping_options.push({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 3700, currency: "cad" },
        display_name: "Express Delivery (Same/Next Day)",
      },
    });
  } else if (deliveryMethod === "us") {
    allowedCountries = ["US"] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
    shipping_options.push({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 3000, currency: "cad" },
        display_name: "US Shipping",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 5 },
          maximum: { unit: "business_day", value: 10 },
        },
      },
    });
  }
  // Pickup gets no shipping options (Free)

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "cad",
      product_data: {
        name: `${item.name} - Size: ${item.selectedSize}`,
        images: [item.images[0]],
      },
      unit_amount: Math.round(item.price * 100),
    },
  }));

  // Define sessionUrl outside the try block
  let sessionUrl: string | null = null;
  let orderId: string | null = null;

  try {
    const order = await db.order.create({
      data: {
        isPaid: false,
        orderItems: {
          create: items.map((item) => ({
            product: { connect: { id: item.id } },
            quantity: item.quantity,
            size: item.selectedSize,
          })),
        },
      },
    });
    orderId = order.id;

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: [
        "card", // Credit/debit cards
        "afterpay_clearpay", // Afterpay (available in Canada, US, UK, AU, NZ)
        "klarna", // Klarna (available in multiple countries including Canada)
        "affirm", // Affirm (available in US and Canada)
      ],
      shipping_address_collection: { allowed_countries: allowedCountries },
      phone_number_collection: { enabled: true },
      shipping_options: shipping_options.length > 0 ? shipping_options : undefined,
      metadata: {
        orderId: orderId,
        deliveryMethod: deliveryMethod,
        cartItems: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            size: item.selectedSize,
            quantity: item.quantity,
          }))
        ),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    // Assign the URL, but DO NOT redirect here
    sessionUrl = session.url;

  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return { error: "Failed to create Stripe checkout session." };
  }

  // --- THE FIX IS HERE ---
  // We check for the URL and redirect OUTSIDE the try/catch block.
  // This ensures the NEXT_REDIRECT error is not caught.
  if (sessionUrl) {
    redirect(sessionUrl);
  }
}