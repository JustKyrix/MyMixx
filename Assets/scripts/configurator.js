const cart = []; 

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
    const minusBtn = card.querySelector('.configurator-btn-minus');
    const plusBtn  = card.querySelector('.configurator-btn-plus');
    const quantityEl = card.querySelector('.configurator-quantity');

    const name    = card.querySelector('.configurator-name').textContent.trim();
    const priceRaw = card.querySelector('.configurator-price').textContent.trim(); 
    const price   = parsePrice(priceRaw);
    const weight  = card.querySelector('.configurator-amount')?.textContent.trim() ?? '';
    const imgSrc  = card.querySelector('.configurator-img').getAttribute('src');
    const id      = slugify(name);

    plusBtn.addEventListener('click', () => {
        addToCart({ id, name, price, weight, imgSrc });
        const item = getCartItem(id);
        quantityEl.textContent = item.quantity;
        updateCartBadge();
        renderCart();
    });

    minusBtn.addEventListener('click', () => {
        const item = getCartItem(id);
        if (!item || item.quantity === 0) {
            showErrorModal();
            return;
        }
        decreaseCart(id);
        const updated = getCartItem(id);
        quantityEl.textContent = updated ? updated.quantity : 0;
        updateCartBadge();
        renderCart();
    });
});

function parsePrice(str) {
    
    return parseFloat(str.replace('€', '').replace(',', '.').trim());
}

function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getCartItem(id) {
    return cart.find(item => item.id === id);
}

function addToCart({ id, name, price, weight, imgSrc }) {
    const existing = getCartItem(id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, weight, imgSrc, quantity: 1 });
    }
}

function decreaseCart(id) {
    const item = getCartItem(id);
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) {
        const idx = cart.findIndex(i => i.id === id);
        cart.splice(idx, 1);
    }
}

function removeFromCart(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) cart.splice(idx, 1);
    
    syncCardQuantity(id, 0);
}

function syncCardQuantity(id, value) {
    document.querySelectorAll('.configurator-card').forEach(card => {
        const name = card.querySelector('.configurator-name').textContent.trim();
        if (slugify(name) === id) {
            card.querySelector('.configurator-quantity').textContent = value;
        }
    });
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalPrice() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatPrice(num) {
    return '€' + num.toFixed(2).replace('.', ',');
}

const cartBadge = document.getElementById('cart-badge');

function updateCartBadge() {
    const total = getTotalItems();
    if (total > 0) {
        cartBadge.textContent = total;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

const cartModal     = document.getElementById('cart-modal');
const cartItemsEl   = document.getElementById('cart-items');
const cartTotalEl   = document.getElementById('cart-total-price');
const cartOpenBtn   = document.getElementById('cart-open-btn');
const cartCloseBtn  = document.getElementById('cart-close-btn');

cartOpenBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('open');
    document.body.style.overflow = 'hidden';
});

cartCloseBtn.addEventListener('click', closeCart);

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) closeCart();
});

function closeCart() {
    cartModal.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCart() {
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
            const item = getCartItem(id);
            if (item) {
                item.quantity++;
                syncCardQuantity(id, item.quantity);
                updateCartBadge();
                renderCart();
            }
        });
    });

    
    cartItemsEl.querySelectorAll('.cart-btn-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = getCartItem(id);
            if (!item || item.quantity === 0) {
                showErrorModal();
                return;
            }
            decreaseCart(id);
            const updated = getCartItem(id);
            syncCardQuantity(id, updated ? updated.quantity : 0);
            updateCartBadge();
            renderCart();
        });
    });

    
    cartItemsEl.querySelectorAll('.cart-btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            removeFromCart(id);
            updateCartBadge();
            renderCart();
        });
    });

    cartTotalEl.textContent = formatPrice(getTotalPrice());
}

const errorModal     = document.getElementById('error-modal');
const errorCloseBtn  = document.getElementById('error-close-btn');

function showErrorModal() {
    errorModal.classList.add('open');
}

errorCloseBtn.addEventListener('click', () => {
    errorModal.classList.remove('open');
});

errorModal.addEventListener('click', (e) => {
    if (e.target === errorModal) errorModal.classList.remove('open');
});