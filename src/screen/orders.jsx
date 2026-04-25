import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProductsApi } from "../api/products";
import "../style/orders.css";

// ✅ Updated currency formatter (INR)
const formatMoney = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "₹ 0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const imageSrcFromBase64 = (image, mimeType) => {
  if (!image || typeof image !== "string") return "";
  if (image.startsWith("data:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `data:${mimeType || "image/jpeg"};base64,${image}`;
};

const getProductName = (p) =>
  p?.name || p?.title || p?.productName || p?.product_name || "Unnamed product";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getProductsApi();
      setProducts(Array.isArray(result) ? result : []);
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        navigate("/login");
        return;
      }
      setError(e?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [fetchProducts, navigate]);

  return (
    <div className="ordersPage">
      <Header showHero={false} />

      <main className="ordersMain">
        <div className="container">
          <div className="ordersTitleRow">
            <div>
              <h2 className="ordersTitle">Products</h2>
              <div className="ordersSubtitle">
                {products.length
                  ? `${products.length} product(s)`
                  : "No products yet"}
              </div>
            </div>

            <button
              className="ordersRefresh"
              type="button"
              onClick={fetchProducts}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {error && <div className="ordersError">{error}</div>}
          {loading && <div className="ordersMuted">Loading...</div>}

          {!loading && products.length === 0 && !error && (
            <div className="ordersEmpty">
              <div className="ordersEmptyTitle">No products found</div>
              <div className="ordersEmptySub">
                `GET /api/products` returned no items.
              </div>
              <button
                className="ordersCta"
                type="button"
                onClick={() => navigate("/products")}
              >
                Browse products
              </button>
            </div>
          )}

          <div className="ordersList" role="list">
            {products.map((p) => {
              const id = p?._id || p?.id || "";
              const name = getProductName(p);
              const price = Number(p?.price ?? 0);
              const imgSrc = imageSrcFromBase64(
                p?.image,
                p?.imageMimeType || p?.mimeType
              );

              return (
                <div
                  className="orderCard"
                  role="listitem"
                  key={id || `${name}-${price}`}
                >
                  <div className="orderTop">
                    <div className="orderId">
                      <div className="orderIdLabel">Product</div>
                      <div className="orderIdValue">
                        {id ? `#${id}` : name}
                      </div>
                    </div>

                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={name}
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="orderMeta">
                    <div className="orderMetaItem">
                      <div className="orderMetaLabel">Name</div>
                      <div className="orderMetaValue">{name}</div>
                    </div>

                    <div className="orderMetaItem">
                      <div className="orderMetaLabel">Price</div>
                      <div className="orderMetaValue">
                        {formatMoney(price)}
                      </div>
                    </div>

                    <div className="orderMetaItem">
                      <div className="orderMetaLabel">Image</div>
                      <div className="orderMetaValue">
                        {imgSrc ? "Available" : "Not available"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;