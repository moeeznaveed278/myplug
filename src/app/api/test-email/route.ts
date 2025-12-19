import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderReceipt from "@/components/emails/order-receipt";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    return NextResponse.json({ 
      error: "RESEND_API_KEY not found in environment variables",
      instructions: "Add RESEND_API_KEY to your .env file. Get it from https://resend.com/api-keys"
    }, { status: 400 });
  }

  const resend = new Resend(resendApiKey);
  const testEmail = process.env.TEST_EMAIL || "delivered@resend.dev"; // Resend test email

  try {
    // Test email with sample order data
    const result = await resend.emails.send({
      from: "MyPlug <onboarding@resend.dev>",
      to: testEmail,
      subject: "Test Order Confirmation - MyPlug",
      react: OrderReceipt({
        orderId: "test123456",
        customerName: "Test Customer",
        customerEmail: testEmail,
        products: [
          {
            name: "Nike Air Max 90",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            size: "US 10",
            quantity: 1,
            price: 150.0,
          },
          {
            name: "Adidas Ultraboost",
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
            size: "US 9",
            quantity: 2,
            price: 180.0,
          },
        ],
        shippingAddress: "123 Main St, Toronto, ON M5H 2N2, Canada",
        total: 510.0,
        subtotal: 510.0,
        shipping: 20.0,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: result.data?.id,
      to: testEmail,
      note: "Check your email inbox (or Resend dashboard if using delivered@resend.dev)",
    });
  } catch (error: any) {
    console.error("[TEST_EMAIL_ERROR]", error);
    return NextResponse.json({
      error: "Failed to send test email",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

