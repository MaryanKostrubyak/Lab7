function fetchData(url) {
  return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(new Error(`Error fetching data: ${xhr.statusText}`));
          }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send();
  });
}

function renderCategories(categories) {
  const categoryLinksContainer = document.getElementById('category-links');
  categories.forEach(category => {
      const categoryLink = document.createElement('a');
      categoryLink.href = '#';
      categoryLink.textContent = category.name;
      categoryLink.addEventListener('click', () => loadCategory(category.shortname));
      const col = document.createElement('div');
      col.classList.add('col');
      col.appendChild(categoryLink);
      categoryLinksContainer.appendChild(col);
  });
}

function loadCategory(categoryShortname) {
  const categoryContentContainer = document.getElementById('category-content');
  categoryContentContainer.innerHTML = ''; 
  fetchData(`${categoryShortname}.json`)
      .then(data => {
          const categoryTitle = document.createElement('h2');
          categoryTitle.textContent = data.name;
          categoryContentContainer.appendChild(categoryTitle);
          data.products.forEach(product => {
              const productContainer = document.createElement('div');
              productContainer.classList.add('card', 'mt-3');
              productContainer.style.width = '18rem';

              const image = document.createElement('img');
              image.src = product.image; 
              image.classList.add('card-img-top');

              const cardBody = document.createElement('div');
              cardBody.classList.add('card-body');

              const productName = document.createElement('h5');
              productName.classList.add('card-title');
              productName.textContent = product.name;

              const productDescription = document.createElement('p');
              productDescription.classList.add('card-text');
              productDescription.textContent = product.description;

              const productPrice = document.createElement('p');
              productPrice.classList.add('card-text');
              productPrice.textContent = `Price: ${product.price}`;

              cardBody.appendChild(productName);
              cardBody.appendChild(productDescription);
              cardBody.appendChild(productPrice);

              productContainer.appendChild(image);
              productContainer.appendChild(cardBody);

              categoryContentContainer.appendChild(productContainer);
          });
      })
      .catch(error => console.error('Error loading category:', error));
}

function showRandomCategory() {
  const categories = ['books', 'clothing', 'electronics']; 
  const randomCategoryShortname = categories[Math.floor(Math.random() * categories.length)];
  loadCategory(randomCategoryShortname);
}

document.getElementById('catalog-link').addEventListener('click', showRandomCategory);
document.querySelector('.navbar-brand[href="#"]').addEventListener('click', () => location.reload());