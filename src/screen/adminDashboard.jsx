import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/admin.css";
import { deleteProductImageApi } from "../api/products";

const apiBaseUrl = process.env.REACT_APP_API_URL;
const productImageFieldName = process.env.REACT_APP_PRODUCT_IMAGE_FIELD || "image";

const getProductId = (product) => product?._id || product?.id;

const getProductTitle = (product) =>
  product?.name ||
  product?.title ||
  product?.productName ||
  product?.product_name ||
  "Untitled product";

const getProductDescription = (product) =>
  product?.description || product?.desc || product?.details || "";

const getProductCategory = (product) =>
  product?.category || product?.cat || product?.type || "";

const imageSrcFromBase64 = (image, mimeType) => {
  if (!image) return "";
  if (typeof image !== "string") return "";
  if (image.startsWith("data:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `data:${mimeType || "image/jpeg"};base64,${image}`;
};

const parseDataUrl = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== "string") return { mimeType: "", base64: "" };
  if (!dataUrl.startsWith("data:")) return { mimeType: "", base64: "" };
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return { mimeType: "", base64: "" };
  return { mimeType: match[1] || "", base64: match[2] || "" };
};

const dataUrlToBase64 = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== "string") return "";
  return dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
};

const estimateBytesFromBase64 = (base64) => {
  if (!base64) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const dataUrlToBlob = (dataUrl) => {
  const { mimeType, base64 } = parseDataUrl(dataUrl);
  if (!mimeType || !base64) return null;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binaryString.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
};

const fileToCompressedJpegDataUrl = (file, { maxDim = 900, quality = 0.78 } = {}) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const src = String(reader.result || "");
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const imageUploadRef = React.useRef(null);

  const [form, setForm] = React.useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imageFile: null,
    imageBase64: "",
    imageMimeType: "",
    existingImageBase64: "",
    existingImageMimeType: "",
    previewSrc: "",
  });

  React.useEffect(() => {
    if (role !== "admin") navigate("/login");
  }, [role, navigate]);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || "Failed to load products");
        setProducts([]);
        return;
      }
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      imageFile: null,
      imageBase64: "",
      imageMimeType: "",
      existingImageBase64: "",
      existingImageMimeType: "",
      previewSrc: "",
    });
    setIsEditorOpen(true);
  };

  const openEdit = (product) => {
    const rawImage = product?.image;
    const mimeType = product?.imageMimeType || product?.mimeType || "";
    const previewSrc = imageSrcFromBase64(rawImage, mimeType);
    const parsed = parseDataUrl(previewSrc);
    const existingImageBase64 =
      parsed.base64 || (typeof rawImage === "string" && !rawImage.startsWith("http") ? rawImage : "");
    const existingImageMimeType = parsed.mimeType || mimeType || "";
    setEditingProduct(product);
    setForm({
      name: getProductTitle(product),
      price: product?.price ?? "",
      category: getProductCategory(product),
      description: getProductDescription(product),
      imageFile: null,
      imageBase64: "",
      imageMimeType: "",
      existingImageBase64,
      existingImageMimeType,
      previewSrc,
    });
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingProduct(null);
  };

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePaste = async (e) => {
    const clipboardItems = e.clipboardData?.items;
    if (!clipboardItems) return false;

    let imageFound = false;
    
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      
      if (item.type.indexOf('image') !== -1) {
        imageFound = true;
        const file = item.getAsFile();
        
        if (file) {
          try {
            const jpegDataUrl = await fileToCompressedJpegDataUrl(file);
            const base64 = dataUrlToBase64(jpegDataUrl);
            const bytes = estimateBytesFromBase64(base64);
            if (bytes > 2.5 * 1024 * 1024) {
              alert("Pasted image is large after compression. Please choose a smaller image.");
            }
            const blob = dataUrlToBlob(jpegDataUrl);
            const compressedFile = blob
              ? new File([blob], "pasted-image.jpg", { type: "image/jpeg" })
              : null;
            setForm((prev) => ({
              ...prev,
              imageFile: compressedFile,
              imageBase64: base64,
              imageMimeType: "image/jpeg",
              previewSrc: jpegDataUrl,
            }));
          } catch (err) {
            console.error('Failed to process pasted image:', err);
            alert("Failed to process pasted image");
          }
        }
        break;
      }
    }
    
    return imageFound;
  };

  // FIXED: Global paste handler - ONLY handles images, doesn't interfere with text
  React.useEffect(() => {
    const handleGlobalPaste = (e) => {
      if (!isEditorOpen) return;
      
      // Check if clipboard contains images
      const items = e.clipboardData?.items;
      let hasImage = false;
      
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            hasImage = true;
            break;
          }
        }
      }
      
      // ONLY handle image pastes
      if (hasImage) {
        e.preventDefault();
        handleImagePaste(e);
      }
      // For text pastes, do NOTHING - let the browser handle it normally
    };

    document.addEventListener('paste', handleGlobalPaste);
    
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [isEditorOpen]);

  const buildPayload = () => {
    const payload = {
      name: form.name,
      price: form.price === "" ? "" : Number(form.price),
      category: form.category,
      description: form.description,
    };
    const finalBase64 = form.imageBase64 || form.existingImageBase64;
    const finalMimeType = form.imageMimeType || form.existingImageMimeType;
    if (finalBase64) payload.image = finalBase64;
    if (finalMimeType) payload.imageMimeType = finalMimeType;
    return payload;
  };

const saveProduct = async () => {
  if (!apiBaseUrl) {
    alert("Missing REACT_APP_API_URL");
    return;
  }
  if (!form.name?.trim()) {
    alert("Please enter a product name");
    return;
  }

  try {
    const id = getProductId(editingProduct);
    const isEdit = Boolean(id);

    if (!isEdit && !form.imageFile && !form.imageBase64) {
      alert("Please upload an image.");
      return;
    }

    const url = isEdit
      ? `${apiBaseUrl}/products/${id}`
      : `${apiBaseUrl}/products`;

    const hasUploadFile = Boolean(form.imageFile);

    const response = await fetch(
      url,
      hasUploadFile
        ? {
            method: isEdit ? "PUT" : "POST",
            headers: { ...authHeaders },
            body: (() => {
              const fd = new FormData();
              fd.append("name", form.name);
              fd.append("price", String(form.price ?? ""));
              fd.append("category", form.category ?? "");
              fd.append("description", form.description ?? "");
              if (form.imageFile) {
                fd.append(productImageFieldName, form.imageFile);
              }
              if (form.imageBase64) fd.append("imageBase64", form.imageBase64);
              if (form.imageMimeType) fd.append("imageMimeType", form.imageMimeType);
              return fd;
            })(),
          }
        : {
            method: isEdit ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(buildPayload()),
          }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.message || "Save failed");
      return;
    }

    // ✅ SUCCESS ALERT
    alert(isEdit ? "Product updated successfully!" : "Product added successfully!");

    closeEditor();
    fetchProducts();
  } catch (e) {
    console.error(e);
    alert("Save failed");
  }
};

const deleteProduct = async (product) => {
  const id = getProductId(product);
  if (!id) return;

  const title = getProductTitle(product);
  const ok = window.confirm(`Delete "${title}"?`);
  if (!ok) return;

  const deletedProduct = product;

  // Optimistic UI
  setProducts((prev) =>
    prev.filter((p) => getProductId(p) !== id)
  );

  try {
    const response = await fetch(`${apiBaseUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 404) {
        alert("Product was already deleted");
        fetchProducts();
        return;
      }

      // restore
      setProducts((prev) => {
        if (!prev.find((p) => getProductId(p) === id)) {
          return [...prev, deletedProduct];
        }
        return prev;
      });

      alert(data.message || "Delete failed");
      return;
    }

    // ✅ SUCCESS ALERT
    alert("Product deleted successfully!");
  } catch (e) {
    console.error(e);

    // restore
    setProducts((prev) => {
      if (!prev.find((p) => getProductId(p) === id)) {
        return [...prev, deletedProduct];
      }
      return prev;
    });

    alert("Delete failed");
  }
};

  const removeImageFromForm = () => {
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      imageBase64: "",
      imageMimeType: "",
      previewSrc: "",
    }));
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authchange"));
    navigate("/login");
  };

  return (
    <div className="admin-root">
      <div className="admin-topbar">
        <div className="admin-title">Admin Dashboard</div>
        <div className="admin-actions">
         
          <button className="admin-btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-contentHeader">
          <h2 className="admin-h2">Products</h2>
          <div className="admin-contentActions">
            <button className="admin-btn" type="button" onClick={fetchProducts} disabled={loading}>
              Refresh
            </button>
            <button className="admin-btn" type="button" onClick={openCreate}>
              Add Product
            </button>
          </div>
        </div>

        {error ? <div className="admin-error">{error}</div> : null}
        {loading ? <div className="admin-muted">Loading…</div> : null}

        <div className="admin-grid">
          {products.map((p) => {
            const id = getProductId(p);
            const title = getProductTitle(p);
            const price = p?.price ?? "";
            const imgSrc = imageSrcFromBase64(p?.image, p?.imageMimeType || p?.mimeType);
            return (
              <div key={id || title} className="admin-card">
                <div className="admin-cardImage">
                  {imgSrc ? <img src={imgSrc} alt={title} /> : <div className="admin-imgPlaceholder" />}
                </div>
                <div className="admin-cardBody">
                  <div className="admin-cardTitle" title={title}>
                    {title}
                  </div>
                  <div className="admin-cardMeta">
                    {price !== "" ? <span className="admin-pill">₹ {price}</span> : null}
                    {getProductCategory(p) ? (
                      <span className="admin-pill">{getProductCategory(p)}</span>
                    ) : null}
                  </div>
                  <div className="admin-cardButtons">
                    <button className="admin-btn admin-btnSecondary" type="button" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button className="admin-btn admin-btnDanger" type="button" onClick={() => deleteProduct(p)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isEditorOpen ? (
        <div className="admin-modalOverlay" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div className="admin-modalHeader">
              <div className="admin-modalTitle">
                {editingProduct ? "Edit Product" : "Add Product"}
              </div>
              <button className="admin-iconBtn" type="button" onClick={closeEditor} aria-label="Close">
                ×
              </button>
            </div>

            <div className="admin-form">
              <label className="admin-label">
                Name
                <input 
                  className="admin-input" 
                  name="name" 
                  value={form.name} 
                  onChange={onFieldChange}
                  placeholder="Enter product name"
                />
              </label>
              <label className="admin-label">
                Price
                <input
                  className="admin-input"
                  name="price"
                  value={form.price}
                  onChange={onFieldChange}
                  inputMode="decimal"
                  placeholder="Enter price"
                />
              </label>
              <label className="admin-label">
                Category
                <input
                  className="admin-input"
                  name="category"
                  value={form.category}
                  onChange={onFieldChange}
                  placeholder="e.g. Birthday, Anniversary"
                />
              </label>
              <label className="admin-label admin-labelWide">
                Description
                <textarea
                  className="admin-textarea"
                  name="description"
                  value={form.description}
                  onChange={onFieldChange}
                  rows={4}
                  placeholder="Enter product description"
                />
              </label>

              <label className="admin-label admin-labelWide">
                Product Image
                <div
                  ref={imageUploadRef}
                  className="admin-imageUpload"
                  style={{
                    minHeight: '150px',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#f8f9fa',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // Optional: Create a hidden file input for clicking
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const jpegDataUrl = await fileToCompressedJpegDataUrl(file);
                        const base64 = dataUrlToBase64(jpegDataUrl);
                        const blob = dataUrlToBlob(jpegDataUrl);
                        const compressedFile = blob
                          ? new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: "image/jpeg" })
                          : null;
                        setForm((prev) => ({
                          ...prev,
                          imageFile: compressedFile,
                          imageBase64: base64,
                          imageMimeType: "image/jpeg",
                          previewSrc: jpegDataUrl,
                        }));
                      }
                    };
                    input.click();
                  }}
                >
                  {form.previewSrc ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={form.previewSrc}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btnDanger"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImageFromForm();
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          padding: '0',
                          fontSize: '12px',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <small>
                        <strong>How to add image:</strong><br/>
                        • Click to browse files<br/>
                        • Or copy any image (Ctrl+C) and paste here (Ctrl+V)<br/>
                        • Image will be automatically compressed
                      </small>
                    </div>
                  )}

                  {editingProduct && form.existingImageBase64 && !form.previewSrc && (
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btnWarning"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const ok = window.confirm(`Delete image for "${getProductTitle(editingProduct)}"?`);
                          if (ok) {
                            try {
                              await deleteProductImageApi(getProductId(editingProduct), token);
                              alert("Image deleted successfully");
                              setForm(prev => ({
                                ...prev,
                                existingImageBase64: "",
                                existingImageMimeType: "",
                                previewSrc: ""
                              }));
                              fetchProducts();
                            } catch (e) {
                              console.error(e);
                              alert(e.message || "Delete image failed");
                            }
                          }
                        }}
                      >
                        Delete Existing Image
                      </button>
                    </div>
                  )}
                </div>
              </label>

              <div className="admin-formButtons">
                <button className="admin-btn admin-btnSecondary" type="button" onClick={closeEditor}>
                  Cancel
                </button>
                <button className="admin-btn" type="button" onClick={saveProduct}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
