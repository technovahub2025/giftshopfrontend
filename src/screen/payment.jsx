import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { checkoutApi } from "../api/checkout";
import { addToCartApi, clearCartApi } from "../api/cart";
import "../style/payment.css";

const formatMoney = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "â‚¹ 0";
  return `â‚¹ ${value.toFixed(2).replace(/\.00$/, "")}`;
};

const readDraft = () => {
  try {
    const raw = sessionStorage.getItem("checkout_draft_v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, loading: cartLoading, error: cartError, refresh, clear } = useCart();
  const [method, setMethod] = React.useState("COD");
  const [draft, setDraft] = React.useState(() => readDraft());
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (cartError) {
      setError(cartError);
      return;
    }
    if (!cartLoading && itemCount === 0) {
      setError("Your cart is empty. Add items to proceed.");
      return;
    }
    const d = readDraft();
    if (!d) {
      navigate("/checkout");
      return;
    }
    setDraft(d);
  }, [cartLoading, cartError, itemCount, navigate]);

  React.useEffect(() => {
    if (itemCount <= 0 && !cartLoading) {
      navigate("/cart");
    }
  }, [itemCount, cartLoading, navigate]);

  const deliveryFee = itemCount > 0 ? 40 : 0;
  const platformFee = itemCount > 0 ? 20 : 0;
  const total = Number(subtotal || 0) + deliveryFee + platformFee;

  const placeOrder = async () => {
    setError("");
    const name = String(draft?.name || "").trim();
    const email = String(draft?.email || "").trim();
    const phone = String(draft?.phone || "").trim();
    const address = String(draft?.address || "").trim();
    if (!name || !email || !phone || !address) {
      navigate("/checkout");
      return;
    }

    setSubmitting(true);
    try {
      try {
        await clearCartApi();
      } catch (syncError) {
        if (syncError?.status !== 404) {
          throw syncError;
        }
      }

      for (const item of items) {
        const productId = String(item?.productId || "").trim();
        const quantity = Number(item?.quantity || 0);
        if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue;
        await addToCartApi({ productId, quantity });
      }

      const result = await checkoutApi({ name, email, phone, address });
      setSuccess(result?.order || result);
      sessionStorage.removeItem("checkout_draft_v1");
      await clear();
      await refresh();
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        navigate("/login");
        return;
      }
      setError(err?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="paymentPage">
      <Header showHero={false} />

      <main className="paymentMain">
        <div className="container">
          <div className="paymentHeader">
            <h2 className="paymentTitle">Payment</h2>
            <div className="paymentSubtitle">{itemCount ? `${itemCount} item(s)` : "No items"}</div>
          </div>

          {cartError ? <div className="paymentError">{cartError}</div> : null}
          {error ? <div className="paymentError">{error}</div> : null}

          {success ? (
            <div className="paymentSuccess" role="status" aria-live="polite">
              <div className="paymentSuccessTitle">Order placed successfully</div>
              {success?._id ? <div className="paymentSuccessMeta">Order ID: {success._id}</div> : null}
              <div className="paymentSuccessActions">
                <button className="paymentBtn" type="button" onClick={() => navigate("/orders")}>
                  View orders
                </button>
                <button className="paymentBtn is-secondary" type="button" onClick={() => navigate("/products")}>
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="paymentGrid">
              <section className="paymentCard" aria-label="Payment method">
                <h3 className="paymentCardTitle">Choose payment method</h3>

                <div className="paymentMethods" role="radiogroup" aria-label="Payment methods">
                  <label className={`paymentMethod${method === "COD" ? " is-selected" : ""}`}>
                    <input type="radio" name="method" value="COD" checked={method === "COD"} onChange={() => setMethod("COD")} />
                    <div>
                      <div className="paymentMethodTitle">Cash on Delivery</div>
                      <div className="paymentMethodSub">Pay when your order arrives</div>
                    </div>
                  </label>

                  <label className="paymentMethod is-disabled" aria-disabled="true">
                    <input type="radio" name="method" value="CARD" disabled />
                    <div>
                      <div className="paymentMethodTitle">Card (Coming soon)</div>
                      <div className="paymentMethodSub">Razorpay not integrated</div>
                    </div>
                  </label>

                  <label className="paymentMethod is-disabled" aria-disabled="true">
                    <input type="radio" name="method" value="UPI" disabled />
                    <div>
                      <div className="paymentMethodTitle">UPI (Coming soon)</div>
                      <div className="paymentMethodSub">Razorpay not integrated</div>
                    </div>
                  </label>
                </div>

                <div className="paymentActions">
                  <button className="paymentLinkBtn" type="button" onClick={() => navigate("/checkout")}>
                    Edit delivery details
                  </button>
                  <button
                    className="paymentBtn"
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting || cartLoading || itemCount === 0 || method !== "COD"}
                  >
                    {submitting ? "Placing orderâ€¦" : "Confirm order"}
                  </button>
                </div>
              </section>

              <aside className="paymentCard" aria-label="Order summary">
                <h3 className="paymentCardTitle">Order summary</h3>

                <div className="paymentSummaryRow">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="paymentSummaryRow">
                  <span>Delivery charge</span>
                  <span>{formatMoney(deliveryFee)}</span>
                </div>
                <div className="paymentSummaryRow">
                  <span>Platform fee</span>
                  <span>{formatMoney(platformFee)}</span>
                </div>
                <div className="paymentDivider" role="presentation" />
                <div className="paymentSummaryRow is-strong">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>

                <div className="paymentAddress">
                  <div className="paymentAddressTitle">Deliver to</div>
                  <div className="paymentAddressLine">{draft?.name}</div>
                  <div className="paymentAddressLine">{draft?.phone}</div>
                  <div className="paymentAddressLine">{draft?.email}</div>
                  <div className="paymentAddressLine">{draft?.address}</div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
