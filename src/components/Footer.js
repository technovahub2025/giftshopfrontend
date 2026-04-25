import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand" aria-label="Gift shop">
            <div className="footer-logo">
              <span className="logo-gift">GIFT</span>
              <span className="logo-shop">SHOP</span>
            </div>
            <p className="footer-desc">
              Celebrate moments with gifts that speak louder than words—thoughtfully curated to make every occasion
              special.
            </p>

            <div className="footer-social" aria-label="Social links">
              <a
                className="footer-socialLink"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </a>

              <a
                className="footer-socialLink"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v3H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                className="footer-socialLink"
                href="https://wa.me/919234458732"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.1A8.5 8.5 0 1 1 20 11.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.6 8.7c.2-.3.5-.3.7-.2l.9.5c.2.1.3.4.2.6l-.4 1c-.1.2 0 .5.2.7.6.7 1.4 1.4 2.3 1.9.2.1.5.1.7-.1l.8-.8c.2-.2.5-.2.7 0l.9.7c.2.2.3.5.1.8-.6.9-1.5 1.3-2.5 1.1-1.4-.3-3.2-1.5-4.5-2.8-1.4-1.4-2.5-3.3-2.7-4.7-.1-1 .3-1.9 1.1-2.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

            <div className="footer-links">
            <div class="gift-services">

              <p>Our Services</p>
    <p>Gift Cards</p>
    <p>Custom Gifts</p>
    <p>Gift Delivery</p>
    <p>Gift Packaging</p>
</div>

            <div className="footer-column">
              <h3>Contact us</h3>
              <p>+91-9234458732</p>
              <p>Chennai</p>
              <div className="footer-map" aria-label="Map placeholder">
                <div className="footer-mapPlaceholder">
                  <div className="footer-mapPin" aria-hidden="true" />
                  <div className="footer-mapText">Chennai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
