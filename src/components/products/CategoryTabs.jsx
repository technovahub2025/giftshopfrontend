import React from "react";

const CategoryTabs = ({ categories, active, onChange }) => {
  return (
    <div className="products-categories" role="tablist" aria-label="Product categories">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            className={`products-category${isActive ? " is-active" : ""}`}
            onClick={() => onChange(cat)}
            role="tab"
            aria-selected={isActive}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;

