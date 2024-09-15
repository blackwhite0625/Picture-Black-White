document.addEventListener('DOMContentLoaded', function () {
  const priceRangeInput = document.getElementById('price-range');
  const priceValueSpan = document.getElementById('price-value');
  const customPriceInput = document.getElementById('custom-price');
  const filterButton = document.getElementById('filter-button');
  const filteredResultsDiv = document.getElementById('filtered-results');

  // 更新顯示價格值
  priceRangeInput.addEventListener('input', function () {
      priceValueSpan.textContent = `${priceRangeInput.value} TWD`;
      customPriceInput.value = priceRangeInput.value; // 同步顯示
  });

  customPriceInput.addEventListener('input', function () {
      const customPrice = parseInt(customPriceInput.value, 10);
      if (!isNaN(customPrice) && customPrice >= 50 && customPrice <= 10000) {
          priceRangeInput.value = customPrice; // 同步顯示
          priceValueSpan.textContent = `${customPrice} TWD`;
      }
  });

  // 篩選功能
  filterButton.addEventListener('click', function () {
      const selectedPrice = parseInt(priceRangeInput.value, 10);

      if (isNaN(selectedPrice)) {
          alert('請選擇有效的價格。');
          return;
      }

      const artworks = JSON.parse(localStorage.getItem('artworks')) || [];

      const filteredArtworks = artworks.filter(artwork => {
          const [minPrice, maxPrice] = artwork.priceRange.split(' ~ ').map(price => parseInt(price.replace(' TWD', ''), 10));
          return selectedPrice >= minPrice && selectedPrice <= maxPrice;
      });

      filteredResultsDiv.innerHTML = '';

      if (filteredArtworks.length > 0) {
          filteredArtworks.forEach(artwork => {
              const artworkElement = document.createElement('div');
              artworkElement.classList.add('gallery-item');
              artworkElement.innerHTML = `
                  <img src="${artwork.imageSrc}" alt="${artwork.title}">
                  <p>${artwork.title}</p>
                  <p class="price">價格範圍: ${artwork.priceRange}</p>
                  <p class="username">上傳者: ${artwork.username}</p>
              `;
              filteredResultsDiv.appendChild(artworkElement);
          });
      } else {
          filteredResultsDiv.innerHTML = '<p>沒有找到符合的作品。</p>';
      }
  });
});
