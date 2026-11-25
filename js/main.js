(function (app) {
    "use strict";
    const {
        renderCartRoot,
        renderAuthModal,
        renderHeader,
        renderFooter,
        renderFeaturedProducts,
        renderCart,
        addToCart,
        toggleFavorite,
        updateCartQuantity,
        removeFromCart,
        openAuthModal,
        handleSignOut,
        handleCheckout,
        handleContactForm,
        handleSignIn,
        handleSignUp,
        handleChangePassword,
        renderProducts,
        renderProductDetailModal,
        openProductDetails
    } = app;

    function handleClick(event) {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const detailTrigger = target.closest("[data-product-detail]");
        if (detailTrigger) {
            event.preventDefault();
            openProductDetails(detailTrigger.dataset.productDetail);
            return;
        }

        const addButton = target.closest("[data-product-id]");
        if (addButton) {
            addToCart(addButton.dataset.productId);
            return;
        }

        const favoriteButton = target.closest("[data-favorite]");
        if (favoriteButton) {
            toggleFavorite(favoriteButton.dataset.favorite);
            return;
        }

        const quantityButton = target.closest("[data-quantity]");
        if (quantityButton) {
            updateCartQuantity(
                quantityButton.dataset.quantity,
                Number(quantityButton.dataset.change)
            );
            return;
        }

        const removeButton = target.closest("[data-remove-cart]");
        if (removeButton) {
            removeFromCart(removeButton.dataset.removeCart);
            return;
        }

        const authButton = target.closest("[data-open-auth]");
        if (authButton) {
            openAuthModal(authButton.dataset.openAuth);
            return;
        }

        if (target.closest("[data-sign-out]")) {
            handleSignOut();
            return;
        }

        if (target.closest("[data-checkout]")) {
            handleCheckout();
        }
    }

    function handleSubmit(event) {
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;

        if (form.matches("#contact-form")) {
            event.preventDefault();
            handleContactForm(form);
        } else if (form.matches("#sign-in-form")) {
            event.preventDefault();
            handleSignIn(form);
        } else if (form.matches("#sign-up-form")) {
            event.preventDefault();
            handleSignUp(form);
        } else if (form.matches("#change-password-form")) {
            event.preventDefault();
            handleChangePassword(form);
        }
    }

    function initializeProductPage() {
        const searchInput = document.querySelector("#product-search");
        const categorySelect = document.querySelector("#category-filter");
        const sortSelect = document.querySelector("#sort-products");
        const productList = document.querySelector("#product-list");
        if (!searchInput || !categorySelect || !sortSelect || !productList) return;

        const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
        const categoryExists = Array.from(categorySelect.options)
            .some((option) => option.value === categoryFromUrl);

        if (categoryFromUrl && categoryExists) {
            categorySelect.value = categoryFromUrl;
        }

        searchInput.addEventListener("input", renderProducts);
        categorySelect.addEventListener("change", renderProducts);
        sortSelect.addEventListener("change", renderProducts);
        renderProducts();
    }

    renderCartRoot();
    renderAuthModal();
    renderHeader();
    renderFooter();
    renderFeaturedProducts();
    initializeProductPage();
    renderCart();
    renderProductDetailModal();

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
})(window.AliHaiBa);
