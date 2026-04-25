import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../context/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "../style/cart.css";

// 🖼️ Image handler
const imageSrcFromBase64 = (image, mimeType) => {
  if (!image) return "";
  if (typeof image !== "string") return "";
  if (image.startsWith("data:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `data:${mimeType || "image/jpeg"};base64,${image}`;
};

// 🏷️ Title
const getTitle = (product) =>
  product?.name ||
  product?.title ||
  product?.productName ||
  product?.product_name ||
  "Product";

// 💰 Price
const getPrice = (product) => {
  const value = Number(product?.price ?? 0);
  return Number.isFinite(value) ? value : 0;
};

// 💵 Format money
const formatMoney = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "₹ 0";
  return `₹ ${value.toFixed(2).replace(/\.00$/, "")}`;
};

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    items,
    itemCount,
    subtotal,
    loading,
    error,
    removeItem,
    setItemQuantity,
    clear,
    refresh,
  } = useCart();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="cartPage">
      <Header showHero={false} />

      <main className="cartMain">
        <div className="container">

          {/* TITLE */}
          <div className="cartTitleRow">
            <div>
              <h2 className="cartTitle">Your cart</h2>
              <div className="cartSubtitle">
                {itemCount ? `${itemCount} item(s)` : "No items yet"}
              </div>
            </div>

            <div className="cartActions">
              <button
                className="cartActionBtn"
                onClick={refresh}
                disabled={loading}
              >
                Refresh
              </button>

              <button
                className="cartActionBtn is-danger"
                onClick={clear}
                disabled={loading || itemCount === 0}
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && <div className="cartError">{error}</div>}

          <div className="cartGrid">

            {/* LEFT SIDE */}
            <section className="cartItems">

              {loading && <div className="cartMuted">Loading…</div>}

              {!loading && itemCount === 0 && (
                <div className="cartEmpty">
                  <div className="cartEmpty-title">Your cart is empty</div>
                  <div className="cartEmpty-subtitle">
                    Add something from the products page.
                  </div>
                  <button
                    className="cartEmpty-cta"
                    onClick={() => navigateTo("/products")}
                  >
                    Browse products
                  </button>
                </div>
              )}

              {!loading && itemCount > 0 && (
                <div className="cartList">
                  {items.map((item) => {
                    const product = item?.product || {};
                    const productId = item?.productId;
                    const quantity = Number(item?.quantity || 0);

                    const title = getTitle(product);
                    const imgSrc = imageSrcFromBase64(
                      product?.image,
                      product?.imageMimeType
                    );

                    const price = getPrice(product);
                    const lineTotal = price * quantity;

                    return (
                      <div className="cartItem" key={productId}>

                        {/* IMAGE */}
                        <div className="cartItem-media">
                          {imgSrc ? (
                            <img src={imgSrc} alt={title} />
                          ) : (
                            <div className="cartItem-imgPlaceholder" />
                          )}
                        </div>

                        {/* DETAILS */}
                        <div className="cartItem-body">
                          <div className="cartItem-top">
                            <div className="cartItem-title">{title}</div>

                            <button onClick={() => removeItem(productId)}>
                              Remove
                            </button>
                          </div>

                          <div className="cartItem-meta">
                            <span>{formatMoney(price)} each</span>

                            <div className="cartQty">
                              <button
                                onClick={() =>
                                  setItemQuantity(productId, quantity - 1)
                                }
                              >
                                −
                              </button>

                              <span>{quantity}</span>

                              <button
                                onClick={() =>
                                  setItemQuantity(productId, quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>

                            <span>
                              Line: {formatMoney(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* RIGHT SIDE */}
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={40}
              platformFee={20}
              hasItems={itemCount > 0}
              disabled={loading}
              onCheckout={() => {
                if (!user) {
                  navigate("/login", { state: { from: "/checkout" } });
                } else {
                  navigateTo("/checkout");
                }
              }}
            />

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;