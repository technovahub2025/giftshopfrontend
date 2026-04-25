import React from "react";
import { getProductsApi } from "../api/products";

const CartContext = React.createContext(null);

const LOCAL_STORAGE_KEY = "cart_local_v1";

const getProductId = (product) => product?._id || product?.id;

const getTitle = (product) =>
  product?.name || product?.title || product?.productName || product?.product_name || "Item";

const readLocalCart = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log('CartContext - Raw cart data:', raw);
    if (!raw) {
      console.log('CartContext - No raw cart data found');
      return [];
    }
    const parsed = JSON.parse(raw);
    console.log('CartContext - Parsed cart data:', parsed);
    if (!Array.isArray(parsed)) {
      console.log('CartContext - Parsed data is not an array');
      return [];
    }
    const processed = parsed
      .map((item) => {
        const productId = item?.productId;
        const quantity = Number(item?.quantity || 0);
        if (!productId || !Number.isFinite(quantity) || quantity <= 0) return null;
        return { productId, quantity, product: item?.product || null };
      })
      .filter(Boolean);
    console.log('CartContext - Processed cart items:', processed);
    return processed;
  } catch (error) {
    console.error('CartContext - Error reading cart:', error);
    return [];
  }
};

const writeLocalCart = (items) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = React.useState(() => readLocalCart());
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [productsIndex, setProductsIndex] = React.useState(() => new Map());

  const indexProducts = React.useCallback((products) => {
    const incoming = Array.isArray(products) ? products : [];
    setProductsIndex((prev) => {
      const next = new Map(prev);
      incoming.forEach((p) => {
        const id = getProductId(p);
        if (id) next.set(String(id), p);
      });
      return next;
    });
  }, []);

  const fetchAndIndexProducts = React.useCallback(async () => {
    try {
      const products = await getProductsApi();
      const next = new Map();
      (Array.isArray(products) ? products : []).forEach((p) => {
        const id = getProductId(p);
        if (id) next.set(String(id), p);
      });
      setProductsIndex(next);
      return next;
    } catch {
      return productsIndex;
    }
  }, [productsIndex]);

  const hydrateItems = React.useCallback(
    async (rawItems) => {
      const list = Array.isArray(rawItems) ? rawItems : [];
      const missingIds = list
        .filter((i) => !i?.product || typeof i.product !== "object")
        .map((i) => String(i?.productId || ""))
        .filter(Boolean);

      if (missingIds.length === 0) return list;

      let idx = productsIndex;
      const needsFetch = missingIds.some((id) => !idx.has(id));
      if (needsFetch) {
        idx = await fetchAndIndexProducts();
      }
      if (!idx || idx.size === 0) return list;

      return list.map((i) => {
        if (i?.product && typeof i.product === "object") return i;
        const p = idx.get(String(i?.productId || ""));
        return p ? { ...i, product: p } : i;
      });
    },
    [productsIndex, fetchAndIndexProducts]
  );

  React.useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      setLoading(true);
      setError("");
      try {
        const local = readLocalCart();
        const hydrated = await hydrateItems(local);
        if (!active) return;
        setItems(hydrated);
      } catch (e) {
        if (!active) return;
        setError(e?.message || "Failed to load cart");
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, [hydrateItems]);

  React.useEffect(() => {
    writeLocalCart(items);
  }, [items]);

  const addItem = React.useCallback(async (product, quantity = 1) => {
    const productId = typeof product === "string" ? product : getProductId(product);
    const qty = Number(quantity || 0);
    if (!productId || !Number.isFinite(qty) || qty <= 0) return;

    setError("");
    if (productsIndex.size === 0 && product && typeof product === "object") {
      indexProducts([product]);
    }

    setItems((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const index = next.findIndex((i) => i.productId === productId);
      const safeProduct =
        product && typeof product === "object"
          ? {
              ...product,
              name: getTitle(product),
            }
          : null;
      if (index > -1) {
        next[index] = {
          ...next[index],
          quantity: Number(next[index].quantity || 0) + qty,
          product: next[index].product || safeProduct,
        };
      } else {
        next.push({ productId, quantity: qty, product: safeProduct });
      }
      return next;
    });
  }, [productsIndex.size, indexProducts]);

  const removeItem = React.useCallback(async (productId) => {
    if (!productId) return;
    setError("");
    setItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.productId !== productId) : []));
  }, []);

  const setItemQuantity = React.useCallback(
    async (productId, nextQuantity) => {
      const id = String(productId || "");
      const qty = Number(nextQuantity || 0);
      if (!id || !Number.isFinite(qty)) return;

      if (qty <= 0) {
        await removeItem(id);
        return;
      }

      setError("");

      setItems((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const index = list.findIndex((i) => String(i.productId) === id);
        if (index === -1) return list;
        list[index] = { ...list[index], quantity: qty };
        return list;
      });
    },
    [removeItem]
  );

  const clear = React.useCallback(async () => {
    setError("");
    setItems([]);
  }, []);

  const itemCount = React.useMemo(
    () => items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
    [items]
  );

  const subtotal = React.useMemo(() => {
    return items.reduce((sum, i) => {
      const product = i?.product;
      const price = Number(product?.price ?? i?.price ?? 0);
      const qty = Number(i?.quantity || 0);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) return sum;
      return sum + price * qty;
    }, 0);
  }, [items]);

  const value = React.useMemo(
    () => ({
      items,
      loading,
      error,
      itemCount,
      subtotal,
      refresh: async () => {
        setLoading(true);
        setError("");
        try {
          const local = readLocalCart();
          const hydrated = await hydrateItems(local);
          setItems(hydrated);
          return true;
        } catch (e) {
          setError(e?.message || "Failed to refresh cart");
          return false;
        } finally {
          setLoading(false);
        }
      },
      addItem,
      setItemQuantity,
      removeItem,
      clear,
    }),
    [items, loading, error, itemCount, subtotal, hydrateItems, addItem, setItemQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    return {
      items: [],
      loading: false,
      error: "",
      itemCount: 0,
      subtotal: 0,
      refresh: async () => false,
      addItem: async () => {},
      setItemQuantity: async () => {},
      removeItem: async () => {},
      clear: async () => {},
    };
  }
  return ctx;
};
