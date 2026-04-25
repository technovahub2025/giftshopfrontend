import React from "react";

const imageSrcFromBase64 = (image, mimeType) => {
  if (!image) return "";
  if (typeof image !== "string") return "";
  if (image.startsWith("data:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `data:${mimeType || "image/jpeg"};base64,${image}`;
};

const getProductId = (product) => product?._id || product?.id;

const getProductTitle = (product) =>
  product?.name ||
  product?.title ||
  product?.productName ||
  product?.product_name ||
  "Untitled product";

const ProductCard = ({ product, onAddToCart }) => {
  const title = getProductTitle(product);
  const id = getProductId(product);
  const price = product?.price ?? "";
  const description = product?.description || product?.desc || "";
  const imgSrc = imageSrcFromBase64(
    product?.image,
    product?.imageMimeType || product?.mimeType
  );

  // ✅ Handle Add to Cart with alert
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      alert("Item added to cart!"); // 🔔 Alert here
    } else {
      console.warn("onAddToCart function not provided");
    }
  };

  return (
    <div className="product-card" data-id={id || undefined}>
      <div className="product-imageWrap">
        {imgSrc ? (
          <img
            className="product-image"
            src={imgSrc}
            alt={title}
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="product-body">
        <div className="product-row">
          <div className="product-title" title={title}>
            {title}
          </div>
          {price !== "" ? (
            <div className="product-priceBadge">₹ {price}</div>
          ) : null}
        </div>

        {description && (
          <div className="product-description" title={description}>
            {description}
          </div>
        )}

        <button
          className="product-addBtn"
          type="button"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;