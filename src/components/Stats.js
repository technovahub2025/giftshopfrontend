import React from 'react';

const Stats = () => {
  const statsData = [
    { number: '4.5K', label: 'Products Sold' },
    { number: '30k+', label: 'Regular Customer' },
    { number: '200k', label: 'Happy Customer' },
    { number: '10+', label: 'Years of Experience' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-item">
              
              {/* Circle with number inside */}
              <div className="stat-ellipse">
                <div className="stat-number">{stat.number}</div>
              </div>

              {/* Label below */}
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;