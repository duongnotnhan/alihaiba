(function (app) {
    "use strict";
    const {
        PRODUCTS,
        STORAGE_KEYS,
        readStorage,
        writeStorage,
        notify,
        formatPrice,
        escapeHtml,
        getCurrentUser,
        openAuthModal,
        renderFeaturedProducts,
        renderProducts
    } = app;

    function getCartItems() {
        const savedCart = readStorage(STORAGE_KEYS.cart, []);
        if (!Array.isArray(savedCart)) {
            console.error("AliHaiBa cart storage is not an array.");
            return [];
        }

        return savedCart.filter((cartEntry) => {
            const isValidEntry =
                cartEntry &&
                typeof cartEntry.id === "string" &&
                PRODUCTS.some((product) => product.id === cartEntry.id) &&
                Number.isSafeInteger(cartEntry.quantity) &&
                cartEntry.quantity > 0;

            if (!isValidEntry) {
                console.warn("Ignoring an invalid cart entry in localStorage.", cartEntry);
            }

            return isValidEntry;
        });
    }

    function renderCart() {
        const cartItems = getCartItems();
        const itemCount = cartItems.reduce(
            (total, cartEntry) => total + cartEntry.quantity,
            0
        );

        document.querySelectorAll("[data-cart-count]").forEach((badge) => {
            badge.textContent = itemCount;
        });

        const list = document.querySelector("[data-cart-items]");
        const footer = document.querySelector("[data-cart-footer]");
        if (!list || !footer) return;

        if (cartItems.length === 0) {
            list.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
                    Giỏ hàng đang trống.
                    <br>
                    <span class="small">Hãy khám phá sản phẩm bạn yêu thích nhé!</span>
                </div>
            `;
            footer.innerHTML = "";
            return;
        }

        let total = 0;
        list.innerHTML = cartItems.map((cartEntry) => {
            const product = PRODUCTS.find((catalogProduct) => catalogProduct.id === cartEntry.id);

            total += product.price * cartEntry.quantity;
            return `<div class="cart-line">
                <img src="${product.image}" alt="${escapeHtml(product.name)}">
                <div>
                    <div class="cart-line-name">${escapeHtml(product.name)}</div>
                    <div class="cart-line-price">${formatPrice(product.price)}</div>
                    <div class="cart-qty">
                        <button
                            type="button"
                            data-quantity="${product.id}"
                            data-change="-1"
                            aria-label="Giảm số lượng"
                        >-</button>
                        <span>${cartEntry.quantity}</span>
                        <button
                            type="button"
                            data-quantity="${product.id}"
                            data-change="1"
                            aria-label="Tăng số lượng"
                        >+</button>
                    </div>
                </div>
                <button
                    class="cart-remove"
                    type="button"
                    data-remove-cart="${product.id}"
                    aria-label="Xóa ${escapeHtml(product.name)}">
                    <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
                </button>
            </div>`;
        }).join("");

        footer.innerHTML = `
            <div class="cart-total">
                <span>Tạm tính</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button class="btn btn-primary w-100 py-2" type="button" data-checkout>
                Tiến hành thanh toán
            </button>
            <p class="form-hint text-center mt-2 mb-0">
                Bản demo - Không phát sinh thanh toán thật
            </p>`;
    }

    function saveCart(cart, successMessage) {
        if (!writeStorage(STORAGE_KEYS.cart, cart)) return;
        renderCart();
        if (successMessage) notify(successMessage);
    }

    function addToCart(productId) {
        const cartItems = getCartItems();
        const existingItem = cartItems.find((cartEntry) => cartEntry.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ id: productId, quantity: 1 });
        }

        saveCart(cartItems, "Đã thêm sản phẩm vào giỏ hàng.");
    }

    function toggleFavorite(productId) {
        const storedFavorites = readStorage(STORAGE_KEYS.favorites, []);
        const favorites = Array.isArray(storedFavorites) ? storedFavorites : [];
        const index = favorites.indexOf(productId);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productId);
        }

        if (!writeStorage(STORAGE_KEYS.favorites, favorites)) return;
        renderFeaturedProducts();
        renderProducts();
        notify(index >= 0 ? "Đã xóa khỏi danh sách yêu thích." : "Đã thêm vào danh sách yêu thích.");
    }

    function updateCartQuantity(productId, change) {
        const cartItems = getCartItems();
        const selectedItem = cartItems.find((cartEntry) => cartEntry.id === productId);
        if (!selectedItem) return;

        const newQuantity = selectedItem.quantity + change;
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        selectedItem.quantity = newQuantity;
        saveCart(cartItems);
    }

    function removeFromCart(productId) {
        const remainingItems = getCartItems()
            .filter((cartEntry) => cartEntry.id !== productId);
        saveCart(remainingItems);
    }

    function completeCheckout() {
        const signedInUser = getCurrentUser();
        if (!signedInUser) {
            notify("Vui lòng đăng nhập trước khi thanh toán.", "info");
            openAuthModal("sign-in");
            return;
        }

        const cartItems = getCartItems();
        if (cartItems.length === 0) return;

        const validCartItems = cartItems.filter((cartEntry) =>
            PRODUCTS.some((catalogProduct) => catalogProduct.id === cartEntry.id)
        );

        if (validCartItems.length !== cartItems.length) {
            notify("Một số sản phẩm trong giỏ hàng không còn tồn tại và đã bị loại bỏ.", "warning");
            saveCart(validCartItems);
        }

        const total = validCartItems.reduce((sum, cartEntry) => {
            const product = PRODUCTS.find((catalogProduct) => catalogProduct.id === cartEntry.id);
            return sum + (product ? product.price * cartEntry.quantity : 0);
        }, 0);
        const summary =
            `Đơn demo của ${signedInUser.name}. Tổng cộng ${formatPrice(total)}. Không thanh toán thật.`;

        if (window.Swal) {
            Swal.fire({
                icon: "success",
                title: "Đặt hàng demo thành công!",
                text: summary,
                confirmButtonText: "Hoàn tất",
                confirmButtonColor: "#6254e7"
            }).then((result) => {
                if (!result.isConfirmed) return;

                saveCart([]);
                const panel = document.querySelector("#shopping-cart");
                if (!panel || !window.bootstrap || !window.bootstrap.Offcanvas) return;

                const cartModal = window.bootstrap.Offcanvas.getInstance(panel);
                if (cartModal) cartModal.hide();
            });
            return;
        }

        if (window.confirm(`${summary}\nXác nhận hoàn tất đơn demo?`)) {
            saveCart([]);
        }
    }

    function handleCheckout() {
        completeCheckout();
    }
    Object.assign(app, {
        getCartItems,
        renderCart,
        saveCart,
        addToCart,
        toggleFavorite,
        updateCartQuantity,
        removeFromCart,
        completeCheckout,
        handleCheckout
    });
})(window.AliHaiBa = window.AliHaiBa || {});
