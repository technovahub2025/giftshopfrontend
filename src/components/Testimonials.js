import React from 'react';
import giftImg from '../assets/profile1.png';

const Testimonials = () => {
  const testimonialsData = [
    {
      name: 'Prakash S.',
      text: 'Super fast delivery within 24 hours, very impressed!',
      rating: 4,
    },
    {
      name: 'Arjun K.',
      text: 'Beautiful packaging and quick support. Loved it!',
      rating: 4,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`} aria-hidden="true">
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="testimonial-title">Testimonial</h2>
        <h3 className="testimonial-subtitle">what Our Client Says</h3>

        <div className="testimonials-grid">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-avatarWrap" aria-hidden="true">
                <img className="testimonial-avatarImg" src={giftImg} alt="" loading="lazy" />
              </div>
              <div className="testimonial-stars" aria-label={`${testimonial.rating} out of 5 stars`}>
                {renderStars(testimonial.rating)}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-author">-{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
