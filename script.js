const products = [
  { id: 1, name: 'This Is APRIL Vera Vest', category: 'Tops', price: 140000, oldPrice: 300000, condition: 'Like new', image: 'https://images.unsplash.com/photo-1790137658124-4012ee8f60bc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',  shopeeUrl: 'https://shopee.co.id/link-produk-asli'
 },
  { id: 2, name: 'Sunday Knit', category: 'Tops', price: 119000, oldPrice: 219000, condition: 'Very good', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'Dune Slip Dress', category: 'Dresses', price: 149000, oldPrice: 299000, condition: 'Like new', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Moss Midi Dress', category: 'Dresses', price: 159000, oldPrice: 349000, condition: 'Very good', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'Marais Blazer', category: 'Outerwear', price: 189000, oldPrice: 429000, condition: 'Like new', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Oat Trench Coat', category: 'Outerwear', price: 229000, oldPrice: 499000, condition: 'Very good', image: 'https://images.unsplash.com/photo-1548624313-0396c75ce32a?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Cocoa Cardigan', category: 'Tops', price: 99000, oldPrice: 189000, condition: 'Good', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'Check Shacket', category: 'Outerwear', price: 129000, oldPrice: 259000, condition: 'Good', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=85' }
];

const grid = document.querySelector('#productGrid');
const emptyState = document.querySelector('#emptyState');
const cartCount = document.querySelector('#cartCount');
const toast = document.querySelector('#toast');
let currentFilter = 'All';
let sortMode = 'featured';
let cart = 0;
const saved = new Set();

const formatPrice = (value) => `Rp${value.toLocaleString('id-ID')}`;
const getShopeeUrl = (product) => product.shopeeUrl || `https://shopee.co.id/search?keyword=${encodeURIComponent(product.name)}`;

function renderProducts() {
  let visible = products.filter((product) => currentFilter === 'All' || product.category === currentFilter);
  if (sortMode === 'low') visible.sort((a, b) => a.price - b.price);
  if (sortMode === 'high') visible.sort((a, b) => b.price - a.price);
  emptyState.hidden = visible.length > 0;
  grid.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 60}ms">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="condition">${product.condition}</span>
        <button class="wish ${saved.has(product.id) ? 'saved' : ''}" data-wish="${product.id}" aria-label="${saved.has(product.id) ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}">${saved.has(product.id) ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span>${product.category}</span><span>pre-loved</span></div>
        <h3>${product.name}</h3>
        <div class="price">${formatPrice(product.price)} <s>${formatPrice(product.oldPrice)}</s></div>
        <a class="add-button" href="${getShopeeUrl(product)}" target="_blank" rel="noopener noreferrer">Beli Sekarang ↗</a>
      </div>
    </article>`).join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  currentFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item.dataset.navFilter === currentFilter || (currentFilter === 'All' && !item.dataset.navFilter)));
  renderProducts();
}));

document.querySelectorAll('[data-nav-filter]').forEach((link) => link.addEventListener('click', () => {
  const target = document.querySelector(`[data-filter="${link.dataset.navFilter}"]`);
  if (target) target.click();
}));

document.querySelector('#sortSelect').addEventListener('change', (event) => { sortMode = event.target.value; renderProducts(); });
grid.addEventListener('click', (event) => {
  const wishButton = event.target.closest('[data-wish]');
  if (wishButton) {
    const id = Number(wishButton.dataset.wish);
    saved.has(id) ? saved.delete(id) : saved.add(id);
    renderProducts();
    showToast(saved.has(id) ? 'Disimpan ke wishlist ♥' : 'Dihapus dari wishlist');
  }
});

const searchPanel = document.querySelector('#searchPanel');
const searchInput = document.querySelector('#searchInput');
document.querySelector('#searchToggle').addEventListener('click', () => { searchPanel.hidden = false; searchInput.focus(); });
document.querySelector('#closeSearch').addEventListener('click', () => { searchPanel.hidden = true; });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') searchPanel.hidden = true; });
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) { currentFilter = 'All'; renderProducts(); return; }
  const matches = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map((product) => `<article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}" /><span class="condition">${product.condition}</span></div><div class="product-info"><div class="product-meta"><span>${product.category}</span><span>pre-loved</span></div><h3>${product.name}</h3><div class="price">${formatPrice(product.price)}</div></div></article>`).join('');
  emptyState.hidden = matches.length > 0;
});

document.querySelector('#cartButton').addEventListener('click', () => showToast(cart ? `${cart} item siap dibawa ke Shopee` : 'Pilihanmu masih kosong'));
document.querySelector('#newsletterForm').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#formNote').textContent = 'Terima kasih! Kamu akan jadi yang pertama tahu drop baru kami.'; event.target.reset(); });
renderProducts();
