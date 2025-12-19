import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface OrderReceiptProps {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  products: Array<{
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  total: number;
  subtotal?: number;
  shipping?: number;
}

export default function OrderReceipt({
  orderId,
  customerName,
  customerEmail,
  products,
  shippingAddress,
  total,
  subtotal,
  shipping,
}: OrderReceiptProps) {
  const calculatedSubtotal = subtotal ?? products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const calculatedShipping = shipping ?? total - calculatedSubtotal;
  const shortOrderId = orderId.slice(-6).toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - MyPlug Canada</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient */}
          <Section style={header}>
            <Text style={logo}>MyPlug</Text>
            <Text style={logoSubtext}>Canada</Text>
          </Section>

          {/* Greeting with customer name */}
          <Section style={section}>
            <Text style={heading}>
              {customerName ? `Hi ${customerName},` : "Hi there,"}
            </Text>
            <Text style={paragraph}>
              Thank you for your order! We're excited to let you know that we've received your order and it's being processed.
            </Text>
          </Section>

          {/* Order Information Card */}
          <Section style={section}>
            <Section style={orderInfoCard}>
              <Row>
                <Column style={{ width: "50%" }}>
                  <Text style={orderInfoLabel}>Order ID</Text>
                  <Text style={orderInfoValue}>#{shortOrderId}</Text>
                </Column>
                {customerEmail && (
                  <Column style={{ width: "50%" }}>
                    <Text style={orderInfoLabel}>Email</Text>
                    <Text style={orderInfoValue}>{customerEmail}</Text>
                  </Column>
                )}
              </Row>
              {customerName && (
                <Row style={{ marginTop: "16px" }}>
                  <Column>
                    <Text style={orderInfoLabel}>Customer Name</Text>
                    <Text style={orderInfoValue}>{customerName}</Text>
                  </Column>
                </Row>
              )}
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Products */}
          <Section style={section}>
            <Text style={sectionHeading}>Order Details</Text>
            {products.map((product, index) => (
              <Section key={index} style={productSection}>
                <Row>
                  <Column style={imageColumn}>
                    <Img
                      src={product.image}
                      alt={product.name}
                      width="80"
                      height="80"
                      style={productImage}
                    />
                  </Column>
                  <Column style={productDetailsColumn}>
                    <Text style={productName}>{product.name}</Text>
                    <Text style={productMeta}>
                      Size: {product.size} • Quantity: {product.quantity}
                    </Text>
                    <Text style={productPrice}>
                      ${(product.price * product.quantity).toFixed(2)} CAD
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totals */}
          <Section style={section}>
            <Row>
              <Column style={totalLabelColumn}>
                <Text style={totalLabel}>Subtotal:</Text>
              </Column>
              <Column style={totalValueColumn}>
                <Text style={totalValue}>${calculatedSubtotal.toFixed(2)} CAD</Text>
              </Column>
            </Row>
            {calculatedShipping > 0 && (
              <Row>
                <Column style={totalLabelColumn}>
                  <Text style={totalLabel}>Shipping:</Text>
                </Column>
                <Column style={totalValueColumn}>
                  <Text style={totalValue}>${calculatedShipping.toFixed(2)} CAD</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={totalLabelColumn}>
                <Text style={totalTotalLabel}>Total:</Text>
              </Column>
              <Column style={totalValueColumn}>
                <Text style={totalTotalValue}>${total.toFixed(2)} CAD</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Text style={sectionHeading}>Shipping Address</Text>
            <Text style={addressText}>{shippingAddress}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
            <Text style={footerText}>Thank you for shopping with MyPlug Canada!</Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} MyPlug Canada. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  marginBottom: "64px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const header = {
  padding: "40px 24px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "8px 8px 0 0",
};

const logo = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0",
  letterSpacing: "1px",
};

const logoSubtext = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center" as const,
  margin: "4px 0 0 0",
  opacity: 0.9,
};

const section = {
  padding: "24px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 12px 0",
  lineHeight: "1.2",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "0 0 16px 0",
};

const orderIdText = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#2563eb",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const sectionHeading = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 20px 0",
  letterSpacing: "-0.5px",
};

const productSection = {
  marginBottom: "24px",
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const imageColumn = {
  width: "80px",
  verticalAlign: "top" as const,
};

const productImage = {
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const productDetailsColumn = {
  paddingLeft: "16px",
  verticalAlign: "top" as const,
};

const productName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const productMeta = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 8px 0",
};

const productPrice = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#2563eb",
  margin: "0",
};

const totalLabelColumn = {
  width: "50%",
  textAlign: "right" as const,
  paddingRight: "16px",
};

const totalValueColumn = {
  width: "50%",
  textAlign: "right" as const,
};

const totalLabel = {
  fontSize: "16px",
  color: "#6b7280",
  margin: "0 0 8px 0",
};

const totalValue = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const totalTotalLabel = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "8px 0 0 0",
};

const totalTotalValue = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#2563eb",
  margin: "8px 0 0 0",
};

const addressText = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "0",
  whiteSpace: "pre-line" as const,
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const orderInfoCard = {
  marginBottom: "24px",
  padding: "20px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const orderInfoLabel = {
  fontSize: "12px",
  color: "#64748b",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  fontWeight: "600",
};

const orderInfoValue = {
  fontSize: "16px",
  color: "#1e293b",
  margin: "0",
  fontWeight: "600",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 8px 0",
};

const footerCopyright = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "16px 0 0 0",
};

