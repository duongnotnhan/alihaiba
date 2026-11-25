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
					<button
						class="product-image-button"
						type="button"
						data-product-detail="${product.id}"
						aria-label="Xem chi tiết ${escapeHtml(product.name)}"
					>
						<img class="product-image" src="${product.image}" alt="" loading="lazy"/>
					</button>
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
					<a
						class="product-name"
						href="#product-detail"
						data-product-detail="${product.id}"
					>${escapeHtml(product.name)}</a>
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
		host.innerHTML = filteredProducts.length
			? filteredProducts.map(renderProductCard).join("")
			: `<div class="empty-state">
				<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
				Không tìm thấy sản phẩm phù hợp.
			</div>`;
	}

	function renderProductDetailModal() {
		if (document.querySelector("#product-detail-modal")) return;

		document.body.insertAdjacentHTML("beforeend", `
			<div
				class="modal fade product-detail-modal"
				id="product-detail-modal"
				tabindex="-1"
				aria-labelledby="product-detail-title"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
					<div class="modal-content">
						<div class="modal-header">
							<h2 class="modal-title fs-5" id="product-detail-title">Chi tiết sản phẩm</h2>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Đóng"
							></button>
						</div>
						<div class="modal-body" data-product-detail-content></div>
					</div>
				</div>
			</div>
		`);
	}

	function openProductDetails(productId) {
		const product = PRODUCTS.find((item) => item.id === productId);
		if (!product) {
			console.error(`AliHaiBa cannot find product "${productId}".`);
			return;
		}

		const modal = document.querySelector("#product-detail-modal");
		const title = document.querySelector("#product-detail-title");
		const content = document.querySelector("[data-product-detail-content]");
		if (!modal || !title || !content) {
			console.error("AliHaiBa product detail dialog has not been initialized.");
			return;
		}

		const description =
			`Khám phá ${product.name}, sản phẩm thuộc danh mục ${product.category.toLowerCase()} tại AliHaiBa.`;
		const previousPrice = product.oldPrice
			? `<del class="product-detail-old-price">${formatPrice(product.oldPrice)}</del>`
			: "";
		const badge = product.badge
			? `<span class="product-detail-badge">${escapeHtml(product.badge)}</span>`
			: "";

		title.textContent = product.name;
		content.innerHTML = `
			<div class="row g-4 g-lg-4">
				<div class="col-lg-6">
					<div class="product-detail-image-wrap">
						<img
							class="product-detail-image"
							src="${product.image}"
							alt="${escapeHtml(product.name)}"
						>
					</div>
				</div>
				<div class="col-lg-6">
					<div class="product-detail-info">
						<div class="d-flex align-items-center gap-2">
							<span class="product-category">${escapeHtml(product.category)}</span>
							${badge}
						</div>
						<h3 class="product-detail-name">${escapeHtml(product.name)}</h3>
						<div class="product-rating">
							<i class="fa-solid fa-star" aria-hidden="true"></i>
							${escapeHtml(product.rating)} <span>Đánh giá</span>
						</div>
						<p class="product-detail-description">${escapeHtml(description)}</p>
						<div class="product-detail-price">
							<span>Giá bán</span>
							<strong>${formatPrice(product.price)}</strong>
							${previousPrice}
						</div>
						<h4 class="product-detail-heading">Thông tin sản phẩm</h4>
						<dl class="product-detail-specs">
							<div>
								<dt>Mã sản phẩm</dt>
								<dd>${escapeHtml(product.id.toUpperCase())}</dd>
							</div>
							<div>
								<dt>Danh mục</dt>
								<dd>${escapeHtml(product.category)}</dd>
							</div>
							<div>
								<dt>Đánh giá</dt>
								<dd>${escapeHtml(product.rating)} / 5</dd>
							</div>
						</dl>
						<button
							class="btn btn-primary w-100 py-2"
							type="button"
							data-product-id="${product.id}"
						>
							<i class="fa-solid fa-bag-shopping me-2" aria-hidden="true"></i>
							Thêm vào giỏ hàng
						</button>
					</div>
				</div>
			</div>
		`;

		if (!window.bootstrap || !window.bootstrap.Modal) {
			console.error("AliHaiBa cannot open product details because Bootstrap is unavailable.");
			return;
		}

		window.bootstrap.Modal.getOrCreateInstance(modal).show();
	}

	Object.assign(app, {
		renderProductCard,
		renderFeaturedProducts,
		renderProducts,
		renderProductDetailModal,
		openProductDetails
	});
})(window.AliHaiBa = window.AliHaiBa || {});
