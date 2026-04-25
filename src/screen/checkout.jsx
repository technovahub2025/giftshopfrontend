import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import "../style/checkout.css";

// ✅ Fixed rupee formatter
const formatMoney = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "₹ 0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const readUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { itemCount, subtotal, loading: cartLoading, error: cartError } = useCart();
  const [error, setError] = React.useState("");

  const storedUser = React.useMemo(() => readUserFromStorage(), []);
  const [form, setForm] = React.useState(() => ({
    name: storedUser?.name || storedUser?.username || "",
    email: storedUser?.email || "",
    phone: "",
    address: "",
  }));

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const deliveryFee = itemCount > 0 ? 40 : 0;
  const platformFee = itemCount > 0 ? 20 : 0;
  const total = Number(subtotal || 0) + deliveryFee + platformFee;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = String(form.name || "").trim();
    const email = String(form.email || "").trim();
    const phone = String(form.phone || "").trim();
    const address = String(form.address || "").trim();

    if (!name || !email || !phone || !address) {
      setError("All fields are required");
      return;
    }
    if (itemCount <= 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      sessionStorage.setItem("checkout_draft_v1", JSON.stringify(form));
      navigate("/payment");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      setError("Failed to continue to payment");
    }
  };

  return (
    <div className="checkoutPage">
      <Header showHero={false} />

      <main className="checkoutMain">
        <div className="container">
          <div className="checkoutHeader">
            <h2 className="checkoutTitle">Checkout</h2>
            <div className="checkoutSubtitle">
              {itemCount ? `${itemCount} item(s)` : "No items"}
            </div>
          </div>

          {cartError ? <div className="checkoutError">{cartError}</div> : null}
          {error ? <div className="checkoutError">{error}</div> : null}

          <div className="checkoutGrid">
            <section className="checkoutCard" aria-label="Delivery details">
              <h3 className="checkoutCardTitle">Delivery details</h3>

              <form className="checkoutForm" onSubmit={onSubmit}>
                <label className="checkoutField">
                  <span className="checkoutLabel">Name</span>
                  <input
                    className="checkoutInput"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    autoComplete="name"
                  />
                </label>

                <label className="checkoutField">
                  <span className="checkoutLabel">Email</span>
                  <input
                    className="checkoutInput"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                  />
                </label>

                <label className="checkoutField">
                  <span className="checkoutLabel">Phone</span>
                  <input
                    className="checkoutInput"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>

                <label className="checkoutField">
                  <span className="checkoutLabel">Address</span>
                  <textarea
                    className="checkoutTextarea"
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    rows={4}
                    autoComplete="street-address"
                  />
                </label>

                <button
                  className="checkoutBtn"
                  type="submit"
                  disabled={cartLoading || itemCount === 0}
                >
                  Continue to payment
                </button>
              </form>
            </section>

            <aside className="checkoutCard" aria-label="Order summary">
              <h3 className="checkoutCardTitle">Order summary</h3>

              <div className="checkoutSummaryRow">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>

              <div className="checkoutSummaryRow">
                <span>Delivery charge</span>
                <span>{formatMoney(deliveryFee)}</span>
              </div>

              <div className="checkoutSummaryRow">
                <span>Platform fee</span>
                <span>{formatMoney(platformFee)}</span>
              </div>

              <div className="checkoutDivider" role="presentation" />

              <div className="checkoutSummaryRow is-strong">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>

              <div className="checkoutMuted">
                {itemCount > 0
                  ? "You can edit quantities in the cart page."
                  : "Add items to your cart to continue."}
              </div>

              <button
                className="checkoutLinkBtn"
                type="button"
                onClick={() => navigate("/cart")}
              >
                Edit cart
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;