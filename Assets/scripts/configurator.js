function getCart() {
    const stored = localStorage.getItem('mymixx-cart');
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem('mymixx-cart', JSON.stringify(cart));
}

function parsePrice(str) {
    return parseFloat(str.replace('€', '').replace(',', '.').trim());
}

function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getTotalItems() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalPrice() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatPrice(num) {
    return '€' + num.toFixed(2).replace('.', ',');
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const total = getTotalItems();
    if (total > 0) {
        badge.textContent = total;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function syncCardQuantity(id, value) {
    document.querySelectorAll('.configurator-card').forEach(card => {
        const name = card.querySelector('.configurator-name')?.textContent.trim();
        if (name && slugify(name) === id) {
            card.querySelector('.configurator-quantity').textContent = value;
        }
    });
}

function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;
    cartModal.classList.remove('open');
    document.body.style.overflow = '';
}

function showErrorModal() {
    const errorModal = document.getElementById('error-modal');
    if (errorModal) errorModal.classList.add('open');
}

function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    if (!cartItemsEl || !cartTotalEl) return;

    const cart = getCart();
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Dein Warenkorb ist leer.</p>';
        cartTotalEl.textContent = '€0,00';
        return;
    }

    cart.forEach(item => {
        const el = document.createElement('div');
        el.classList.add('cart-item');
        el.innerHTML = `
            <img class="cart-item-img" src="${item.imgSrc}" alt="${item.name}">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-weight">${item.weight}</span>
                <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
                ${item.quantity > 1 ? `<span class="cart-item-unit">${formatPrice(item.price)} / Stück</span>` : ''}
            </div>
            <div class="cart-item-controls">
                <button class="cart-btn-minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-btn-plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                <button class="cart-btn-remove" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        cartItemsEl.appendChild(el);
    });

    cartItemsEl.querySelectorAll('.cart-btn-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity++;
                saveCart(cart);
                syncCardQuantity(id, item.quantity);
                updateCartBadge();
                renderCart();
            }
        });
    });

    cartItemsEl.querySelectorAll('.cart-btn-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (!item || item.quantity === 0) {
                showErrorModal();
                return;
            }
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(cart.findIndex(i => i.id === id), 1);
                syncCardQuantity(id, 0);
            } else {
                syncCardQuantity(id, item.quantity);
            }
            saveCart(cart);
            updateCartBadge();
            renderCart();
        });
    });

    cartItemsEl.querySelectorAll('.cart-btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cart = getCart();
            cart.splice(cart.findIndex(i => i.id === id), 1);
            saveCart(cart);
            syncCardQuantity(id, 0);
            updateCartBadge();
            renderCart();
        });
    });

    cartTotalEl.textContent = formatPrice(getTotalPrice());
}

const tabs = document.querySelectorAll('.configurator-tab');
const panels = document.querySelectorAll('.configurator-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.querySelector(`.configurator-panel[data-panel="${target}"]`).classList.add('active');
    });
});

document.querySelectorAll('.configurator-card').forEach(card => {
    const minusBtn   = card.querySelector('.configurator-btn-minus');
    const plusBtn    = card.querySelector('.configurator-btn-plus');
    const quantityEl = card.querySelector('.configurator-quantity');

    const name     = card.querySelector('.configurator-name').textContent.trim();
    const priceRaw = card.querySelector('.configurator-price').textContent.trim();
    const price    = parsePrice(priceRaw);
    const weight   = card.querySelector('.configurator-amount')?.textContent.trim() ?? '';
    const imgSrc   = card.querySelector('.configurator-img').getAttribute('src');
    const id       = slugify(name);

    const existing = getCart().find(i => i.id === id);
    if (existing) quantityEl.textContent = existing.quantity;

    plusBtn.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity++;
        } else {
            cart.push({ id, name, price, weight, imgSrc, quantity: 1 });
        }
        saveCart(cart);
        quantityEl.textContent = cart.find(i => i.id === id).quantity;
        updateCartBadge();
        renderCart();
    });

    minusBtn.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item || item.quantity === 0) {
            showErrorModal();
            return;
        }
        item.quantity--;
        if (item.quantity <= 0) {
            cart.splice(cart.findIndex(i => i.id === id), 1);
            quantityEl.textContent = 0;
        } else {
            quantityEl.textContent = item.quantity;
        }
        saveCart(cart);
        updateCartBadge();
        renderCart();
    });
});

updateCartBadge();

const cartOpenBtn  = document.getElementById('cart-open-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartModal    = document.getElementById('cart-modal');
const errorModal   = document.getElementById('error-modal');
const errorCloseBtn = document.getElementById('error-close-btn');

if (cartOpenBtn) {
    cartOpenBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        renderCart();
        cartModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);

if (cartModal) {
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) closeCart();
    });
}

if (errorCloseBtn) errorCloseBtn.addEventListener('click', () => errorModal.classList.remove('open'));

if (errorModal) {
    errorModal.addEventListener('click', function(e) {
        if (e.target === errorModal) errorModal.classList.remove('open');
    });
}