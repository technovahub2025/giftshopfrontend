import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import giftImg from "../assets/gift1.png";
import { useCart } from "../context/CartContext";

const Header = ({ showHero = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const readAuth = () => ({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const [auth, setAuth] = React.useState(readAuth);
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // 🔄 Sync auth
  React.useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);

  // 📱 Mobile menu control
  React.useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authchange"));
    navigateTo("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About us", to: "/about" },
    { label: "Products", to: "/products" },
    { label: "Testimonials", to: "/testimonials" },
    { label: "Contact us", to: "/contact" },
  ];

  const footerLinks = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms and Condition", to: "/terms" },
  ];

  return (
    <header className={`header${showHero ? "" : " header--compact"}`}>
      <div className="container">
        <div className="nav-container">

          {/* LOGO */}
          <div className="logo" aria-label="Gift shop">
            <span className="logo-gift">GIFT</span>
            <span className="logo-shop">SHOP</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="nav-menu" aria-label="Primary navigation">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link${isActive(l.to) ? " active" : ""}`}
              >
                {l.label}
              </Link>
            ))}

            {auth?.token && (
              <Link
                to="/orders"
                className={`nav-link${isActive("/orders") ? " active" : ""}`}
              >
                Orders
              </Link>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="nav-actions">

            {/* HAMBURGER */}
            <button
              className="nav-hamburger"
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen ? "true" : "false"}
              onClick={() => setMobileOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* CART */}
            <button className="cart-btn" onClick={() => navigateTo("/cart")}>
              🛒
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </button>

            {/* AUTH */}
            {!auth?.token ? (
              <button
                className="sign-in-btn"
                onClick={() => navigateTo("/login")}
              >
                Sign In
              </button>
            ) : (
              <>
                {auth.role === "admin" && (
                  <button
                    className="register-btn"
                    onClick={() => navigateTo("/admin")}
                  >
                    Dashboard
                  </button>
                )}

                <button className="sign-in-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="mobileNav" role="dialog">
            <button
              className="mobileNavOverlay"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="mobileNavDrawer">
              <div className="mobileNavHeader">
                <div className="mobileNavTitle">Menu</div>
                <button onClick={() => setMobileOpen(false)}>✖</button>
              </div>

              <nav className="mobileNavLinks">

                {!auth?.token ? (
                  <>
                    <button
                      className={`mobileNavLink${
                        isActive("/login") ? " active" : ""
                      }`}
                      onClick={() => navigateTo("/login")}
                    >
                      Login
                    </button>

                    <button
                      className={`mobileNavLink${
                        isActive("/register") ? " active" : ""
                      }`}
                      onClick={() => navigateTo("/register")}
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    {auth.role === "admin" && (
                      <button
                        className={`mobileNavLink${
                          isActive("/admin") ? " active" : ""
                        }`}
                        onClick={() => navigateTo("/admin")}
                      >
                        Dashboard
                      </button>
                    )}

                    <button className="mobileNavLink" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                )}

                {navLinks.map((l) => (
                  <button
                    key={l.to}
                    className={`mobileNavLink${
                      isActive(l.to) ? " active" : ""
                    }`}
                    onClick={() => navigateTo(l.to)}
                  >
                    {l.label}
                  </button>
                ))}

                {auth?.token && (
                  <button
                    className={`mobileNavLink${
                      isActive("/orders") ? " active" : ""
                    }`}
                    onClick={() => navigateTo("/orders")}
                  >
                    Orders
                  </button>
                )}

                {footerLinks.map((l) => (
                  <button
                    key={l.to}
                    className={`mobileNavLink${
                      isActive(l.to) ? " active" : ""
                    }`}
                    onClick={() => navigateTo(l.to)}
                  >
                    {l.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* HERO SECTION */}
        {showHero && (
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Celebrate moments with gifts that speak louder than words
              </h1>

              <button
                className="explore-btn"
                onClick={() => navigateTo("/products")}
              >
                Explore All
              </button>
            </div>

            <div className="hero-images">
              <img src={giftImg} alt="" className="hero-image-1" />
              <img src={giftImg} alt="" className="hero-image-2" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;