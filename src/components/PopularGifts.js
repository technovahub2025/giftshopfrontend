import React from 'react';
import { useNavigate } from 'react-router-dom';
import giftImg from '../assets/graduate.jpg';
import birthday from '../assets/birthday.jpg';

import aniversary from '../assets/anniversary.jpg';

const PopularGifts = () => {
  const navigate = useNavigate();
  const giftsData = [
    { image: giftImg, title: 'Graduation Gifts' },
    { image: birthday, title: 'Anniversary Gifts' },
    { image: aniversary, title: 'Birthday Gifts' },
  ];

  const navigateToProducts = (category) => {
    try {
      if (category) sessionStorage.setItem('products_filter_category', String(category));
      else sessionStorage.removeItem('products_filter_category');
    } catch {
      // ignore
    }
    navigate('/products');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <section className="popular-gifts">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title-left">Popular gift</h2>
          <button className="view-all-btn" type="button" onClick={() => navigateToProducts(null)}>
            view all collection
          </button>
        </div>

        <div className="gifts-grid">
          {giftsData.slice(0, 3).map((gift, index) => (
            <div
              key={`${gift.title}-${index}`}
              className="gift-card"
              role="button"
              tabIndex={0}
              aria-label={`View ${gift.title}`}
              onClick={() => navigateToProducts(gift.title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigateToProducts(gift.title);
              }}
            >
              <img className="gift-image" src={gift.image} alt={gift.title} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularGifts;
