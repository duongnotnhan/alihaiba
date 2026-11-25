(function (app) {
    "use strict";
    const {
        getCurrentUser,
        escapeHtml,
        renderCart
    } = app;

    function renderHeader() {
        const host = document.querySelector("[data-site-header]");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const user = getCurrentUser();
        const links = [
            ["index.html", "Trang chủ"],
            ["products.html", "Sản phẩm"],
            ["about.html", "Giới thiệu"],
            ["contact.html", "Liên hệ"]
        ];
        const accountActions = user ?
            `<span class="account-greeting" title="Xin chào, ${escapeHtml(user.name)}">
                Xin chào, ${escapeHtml(user.name)}
            </span>
            <button class="btn btn-outline-secondary btn-sm" type="button" data-sign-out>
                Đăng xuất
            </button>` :
                    `<button
                class="btn btn-outline-primary btn-sm"
                type="button"
                data-open-auth="sign-in"
            >Đăng nhập</button>
            <button
                class="btn btn-primary btn-sm"
                type="button"
                data-open-auth="sign-up"
            >Đăng ký</button>
        `;

        host.innerHTML = `
        <nav class="navbar navbar-expand-lg sticky-top">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <span class="brand-mark"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
                    <span class="brand-accent">AliHaiBa</span>
                </a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Mở menu"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mainNavbar">
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                        ${links.map(([href, label]) => `
                            <li class="nav-item">
                                <a
                                    class="nav-link ${currentPage === href ? "active" : ""}"
                                    href="${href}"
                                >${label}</a>
                            </li>
                        `).join("")}
                    </ul>

                    <div class="header-actions">
                        ${accountActions}
                        <button
                            class="cart-button"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#shopping-cart"
                            aria-label="Mở giỏ hàng"
                        >
                            <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
                            <span class="cart-count" data-cart-count>0</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

        renderCart();
    }

    function renderFooter() {
        const host = document.querySelector("[data-site-footer]");

        host.innerHTML = `
            <footer class="site-footer">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-5">
                            <a class="navbar-brand footer-brand" href="index.html">
                                <span class="brand-mark"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
                                <span class="brand-accent">AliHaiBa</span>
                            </a>
                            <p class="footer-copy">
                                Trải nghiệm mua sắm thiết bị công nghệ thật dễ dàng với AliHaiBa.
                            </p>
                            <div class="footer-social">
                                <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f text-primary"></i></a>
                                <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                                <a href="#" aria-label="Youtube"><i class="fa-brands fa-youtube text-danger"></i></a>
                            </div>
                        </div>

                        <div class="col-6 col-lg-2">
                            <h2 class="footer-heading">Khám phá</h2>
                            <div class="footer-links">
                                <a href="products.html">Sản phẩm</a>
                                <a href="about.html">Về AliHaiBa</a>
                                <a href="contact.html">Liên hệ</a>
                            </div>
                        </div>

                        <div class="col-6 col-lg-2">
                            <h2 class="footer-heading">Hỗ trợ</h2>
                            <div class="footer-links">
                                <a href="contact.html">Chính sách bảo hành</a>
                                <a href="contact.html">Giao hàng & đổi trả</a>
                                <a href="contact.html">Câu hỏi thường gặp</a>
                            </div>
                        </div>

                        <div class="col-lg-3">
                            <h2 class="footer-heading">Liên hệ</h2>
                            <div class="footer-links">
                                <span><i class="fa-solid fa-phone me-2" aria-hidden="true"></i>19003667</span>
                                <span><i class="fa-solid fa-envelope me-2" aria-hidden="true"></i>contact@alihaiba.github.com</span>
                                <span><i class="fa-solid fa-location-dot me-2" aria-hidden="true"></i>TP. Hồ Chí Minh</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
                        <span>© 2026 AliHaiBa</span>
                        <span>BootStrap & FontAwesome</span>
                    </div>
                </div>
            </footer>
        `;
    }

    function renderCartRoot() {
        const host = document.querySelector("[data-cart-root]");

        host.innerHTML = `
            <div
                class="offcanvas offcanvas-end"
                tabindex="-1"
                id="shopping-cart"
                aria-labelledby="shopping-cart-title"
            >
                <div class="offcanvas-header">
                    <div>
                        <h2 class="offcanvas-title fs-5" id="shopping-cart-title">Giỏ hàng của bạn</h2>
                        <small class="text-secondary">Sản phẩm đã chọn</small>
                    </div>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Đóng"
                    ></button>
                </div>
                <div class="offcanvas-body d-flex flex-column">
                    <div class="cart-items flex-grow-1" data-cart-items></div>
                    <div class="cart-footer" data-cart-footer></div>
                </div>
            </div>
        `;
    }
    Object.assign(app, {
        renderHeader,
        renderFooter,
        renderCartRoot
    });
})(window.AliHaiBa = window.AliHaiBa || {});
