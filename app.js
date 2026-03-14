const products = [
  { id: 'p1', name: 'Multi-Blade Veggie Slicer', price: 24.99, rating: 4.8, category: 'prep', badge: 'Best Seller' },
  { id: 'p2', name: 'Airtight Spice Jar Set (12pc)', price: 19.99, rating: 4.7, category: 'storage', badge: 'New' },
  { id: 'p3', name: 'Silicone Utensil Pro Kit', price: 29.99, rating: 4.9, category: 'cookware', badge: 'Top Rated' },
  { id: 'p4', name: 'Collapsible Colander Duo', price: 14.99, rating: 4.6, category: 'prep', badge: 'Popular' },
  { id: 'p5', name: 'Oil Dispenser + Brush', price: 12.99, rating: 4.5, category: 'prep', badge: 'Value Pick' },
  { id: 'p6', name: 'Glass Meal Prep Containers (5pc)', price: 34.99, rating: 4.8, category: 'storage', badge: 'Premium' },
  { id: 'p7', name: 'Non-Stick Pan Protector Set', price: 9.99, rating: 4.4, category: 'cookware', badge: 'Bundle Saver' },
  { id: 'p8', name: 'Digital Kitchen Scale', price: 17.99, rating: 4.7, category: 'prep', badge: 'Chef Choice' }
];

const state = {
  cart: [],
  category: 'all',
  search: '',
  sort: 'popular'
};

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const toast = document.getElementById('toast');

function renderProducts() {
  let list = [...products];

  if (state.category !== 'all') {
    list = list.filter((item) => item.category === state.category);
  }

  if (state.search) {
    list = list.filter((item) => item.name.toLowerCase().includes(state.search.toLowerCase()));
  }

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  productGrid.innerHTML = list
    .map(
      (item) => `
      <article class="product-card">
        <span class="tag">${item.badge}</span>
        <h3>${item.name}</h3>
        <div class="product-meta">
          <span>⭐ ${item.rating}</span>
          <span>${item.category}</span>
        </div>
        <div class="product-price">$${item.price.toFixed(2)}</div>
        <button class="btn btn-primary" data-add="${item.id}">Add to Cart</button>
      </article>
    `
    )
    .join('');
}

function addToCart(productId) {
  const selected = products.find((item) => item.id === productId);
  if (!selected) return;

  state.cart.push(selected);
  updateCartUI();
  showToast(`${selected.name} added to cart`);
}

function updateCartUI() {
  cartCount.textContent = String(state.cart.length);

  if (!state.cart.length) {
    cartItems.innerHTML = '<li>Your cart is empty.</li>';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item, index) => `
      <li>
        <span>${item.name}</span>
        <button data-remove="${index}" aria-label="Remove ${item.name}">🗑️</button>
      </li>
    `
    )
    .join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

document.addEventListener('click', (event) => {
  const addId = event.target.getAttribute('data-add');
  if (addId) addToCart(addId);

  const removeId = event.target.getAttribute('data-remove');
  if (removeId !== null) {
    state.cart.splice(Number(removeId), 1);
    updateCartUI();
  }
});

document.getElementById('categoryFilter').addEventListener('change', (e) => {
  state.category = e.target.value;
  renderProducts();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  state.search = e.target.value;
  renderProducts();
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
  state.sort = e.target.value;
  renderProducts();
});

document.getElementById('cartButton').addEventListener('click', () => {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
});

document.getElementById('closeCart').addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!state.cart.length) {
    showToast('Your cart is empty. Add products before checkout.');
    return;
  }
  showToast('Checkout flow ready for payment gateway integration.');
});

document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('newsletterMessage').textContent = 'Thanks! Your 10% discount code is: WELCOME10';
  e.target.reset();
});

renderProducts();
updateCartUI();
