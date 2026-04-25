import React from "react";

const formatMoney = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "₹ 0";
  return `₹ ${value.toFixed(2).replace(/\.00$/, "")}`;
};

const Row = ({ label, value, strong = false }) => (
  <div className={`cartSummary-row${strong ? " is-strong" : ""}`}>
    <span className="cartSummary-label">{label}</span>
    <span className="cartSummary-value">{value}</span>
  </div>
);

const OrderSummary = ({
  subtotal = 0,
  deliveryFee = 40,
  platformFee = 20,
  hasItems: hasItemsProp,
  disabled = false,
  onCheckout,
}) => {
  const safeSubtotal = Number(subtotal || 0);
  const hasItems = typeof hasItemsProp === "boolean" ? hasItemsProp : safeSubtotal > 0;
  const safeDelivery = hasItems ? Number(deliveryFee || 0) : 0;
  const safePlatform = hasItems ? Number(platformFee || 0) : 0;
  const grandTotal = safeSubtotal + safeDelivery + safePlatform;

  return (
    <aside className="cartSummary" aria-label="Order summary">
      <h3 className="cartSummary-title">Order summary</h3>
      <div className="cartSummary-body">
        <Row label="Subtotal" value={formatMoney(safeSubtotal)} />
        <Row label="Delivery charge" value={formatMoney(safeDelivery)} />
        <Row label="Platform fee" value={formatMoney(safePlatform)} />
        <div className="cartSummary-divider" role="presentation" />
        <Row label="Grand total" value={formatMoney(grandTotal)} strong />
      </div>

      <button className="cartSummary-checkout" type="button" onClick={() => {
        console.log('Checkout button clicked, disabled:', disabled, 'hasItems:', hasItems);
        if (onCheckout) {
          onCheckout();
        }
      }} disabled={disabled || !hasItems}>
        Checkout
      </button>
    </aside>
  );
};

export default OrderSummary;
