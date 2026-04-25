import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryTabs from "../components/products/CategoryTabs";
import ProductCard from "../components/products/ProductCard";
import { useCart } from "../context/CartContext";
import { getProductsApi } from "../api/products";
import "../style/products.css";

const normalizeCategory = (value) => String(value || "").trim();

const getProductCategory = (product) =>
  normalizeCategory(product?.category || product?.cat || product?.type);

const ProductsPage = () => {
  const [products, setProducts] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const { addItem } = useCart();
  const pendingCategoryRef = React.useRef(null);

  React.useEffect(() => {
    try {
      pendingCategoryRef.current = sessionStorage.getItem("products_filter_category");
    } catch {
      pendingCategoryRef.current = null;
    }
  }, []);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getProductsApi();
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = React.useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const c = getProductCategory(p);
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  React.useEffect(() => {
    const pending = pendingCategoryRef.current;
    if (!pending) return;
    if (categories.includes(pending)) {
      setActiveCategory(pending);
    }
    pendingCategoryRef.current = null;
    try {
      sessionStorage.removeItem("products_filter_category");
    } catch {
      // ignore
    }
  }, [categories]);

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("All");
  }, [categories, activeCategory]);

  const filtered = React.useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => getProductCategory(p) === activeCategory);
  }, [products, activeCategory]);

  const handleAddToCart = (product) => addItem(product, 1);

  return (
    <div className="products-page">
      <Header showHero={false} />

      <main className="products-main">
        <div className="container">
          <div className="products-titleRow">
            <h2 className="products-title">Products</h2>
            <button className="products-refresh" type="button" onClick={fetchProducts} disabled={loading}>
              Refresh
            </button>
          </div>

          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

          {error ? <div className="products-error">{error}</div> : null}
          {loading ? <div className="products-muted">Loading…</div> : null}

          <div className="products-grid">
            {filtered.map((p) => (
              <ProductCard key={p?._id || p?.id || `${p?.name}-${p?.price}`} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
