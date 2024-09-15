// filter.js

document.addEventListener('DOMContentLoaded', () => {
    const priceRange = document.getElementById('priceRange');
    const priceRangeValue = document.getElementById('priceRangeValue');
    const rating = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');
  
    priceRange.addEventListener('input', () => {
      priceRangeValue.textContent = `${priceRange.value} TWD`;
    });
  
    rating.addEventListener('input', () => {
      ratingValue.textContent = `${rating.value} 星`;
    });
  });
  