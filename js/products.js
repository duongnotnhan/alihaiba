(function (app) {
	"use strict";
	const {
		PRODUCTS,
		STORAGE_KEYS,
		readStorage,
		formatPrice,
		escapeHtml
	} = app;

	function renderProductCard(product) {
		const favorites = readStorage(STORAGE_KEYS.favorites, []);
		const isFavorite = Array.isArray(favorites) && favorites.includes(product.id);
		const oldPrice = product.oldPrice
			? `<small class="d-block text-secondary fw-normal text-decoration-line-through">
                    ${formatPrice(product.oldPrice)}
                </small>`
			: "";
		const badge = product.badge
			? `<span class="product-badge">${escapeHtml(product.badge)}</span>`
			: "";

		return `<div class="col-6 col-lg-3">
			<article class="product-card">
				<div class="product-image-wrap">
					<img class="product-image" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"/>
					${badge}
					<button
						class="favorite-button ${isFavorite ? "is-favorite" : ""}"
						type="button"
						data-favorite="${product.id}"
						aria-label="${isFavorite ? "Xóa" : "Thêm"} ${escapeHtml(product.name)} ${isFavorite ? "khỏi" : "vào"} yêu thích"
					>
						<i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
					</button>
				</div>
				<div class="product-content">
					<span class="product-category">${escapeHtml(product.category)}</span>
					<a class="product-name" href="products.html">${escapeHtml(product.name)}</a>
					<div class="product-rating">
						<i class="fa-solid fa-star" aria-hidden="true"></i>
						${product.rating} <span>(Đánh giá)</span>
					</div>
					<div class="product-price-row">
						<div class="product-price">${formatPrice(product.price)}${oldPrice}</div>
						<button
							class="add-cart-button"
							type="button"
							data-product-id="${product.id}"
							aria-label="Thêm ${escapeHtml(product.name)} vào giỏ">
							<i class="fa-solid fa-plus" aria-hidden="true"></i>
						</button>
					</div>
				</div>
			</article>
		</div>`;
	}

	function renderFeaturedProducts() {
		const host = document.querySelector("[data-featured-products]");
		if (!host) return;

		host.innerHTML = PRODUCTS.slice(0, 4).map(renderProductCard).join("");
	}

	function renderProducts() {
		const host = document.querySelector("#product-list");
		const searchInput = document.querySelector("#product-search");
		const categoryFilter = document.querySelector("#category-filter");
		const sortSelect = document.querySelector("#sort-products");
		const countLabel = document.querySelector("#catalog-count");
		if (!host || !searchInput || !categoryFilter || !sortSelect || !countLabel) {
			return;
		}

		const searchTerm = searchInput.value.trim().toLocaleLowerCase("vi");
		const selectedCategory = categoryFilter.value;

		const filteredProducts = PRODUCTS
			.filter((product) => {
				const searchableText = `${product.name} ${product.category}`.toLocaleLowerCase("vi");
				const matchesCategory = !selectedCategory || product.category === selectedCategory;
				const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
				return matchesCategory && matchesSearch;
			})
			.sort((firstProduct, secondProduct) => {
				if (sortSelect.value === "price-asc") {
					return firstProduct.price - secondProduct.price;
				}
				if (sortSelect.value === "price-desc") {
					return secondProduct.price - firstProduct.price;
				}
				if (sortSelect.value === "name") {
					return firstProduct.name.localeCompare(secondProduct.name, "vi");
				}
				return 0;
			});

		countLabel.textContent = `Hiển thị ${filteredProducts.length} / ${PRODUCTS.length} sản phẩm`;
		host.innerHTML = filteredProducts.length ? 
			filteredProducts.map(renderProductCard).join("") : 
			`<div class="empty-state">
        		<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        		Không tìm thấy sản phẩm phù hợp.</div>
			`;
	}
	Object.assign(app, {
		renderProductCard,
		renderFeaturedProducts,
		renderProducts
	});
})(window.AliHaiBa = window.AliHaiBa || {});
