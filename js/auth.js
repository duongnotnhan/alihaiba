(function (app) {
    "use strict";
    const {
        STORAGE_KEYS,
        readStorage,
        writeStorage,
        removeStorage,
        notify
    } = app;

    function getAccounts() {
        const savedAccounts = readStorage(STORAGE_KEYS.accounts, []);
        if (!Array.isArray(savedAccounts)) {
            console.error("AliHaiBa account storage is not an array.");
            return [];
        }

        return savedAccounts.filter((account) => {
            const isValidAccount =
                account &&
                typeof account.id === "string" &&
                typeof account.name === "string" &&
                typeof account.email === "string" &&
                typeof account.salt === "string" &&
                typeof account.passwordHash === "string";

            if (!isValidAccount) {
                console.warn("Ignoring an invalid account record in localStorage.", account);
            }

            return isValidAccount;
        });
    }

    function getCurrentUser() {
        const session = readStorage(STORAGE_KEYS.session, null);
        if (!session || !session.userId) return null;

        return getAccounts().find((account) => account.id === session.userId) || null;
    }

    function bytesToHex(bytes) {
        return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    function createSalt() {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Web Crypto is unavailable. Run this demo on localhost or HTTPS.");
        }

        return bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
    }

    async function hashPassword(password, salt) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Web Crypto is unavailable. Run this demo on localhost or HTTPS.");
        }

        const passwordKey = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            "PBKDF2",
            false,
            ["deriveBits"]
        );
        const saltBytes = Uint8Array.from(
            salt.match(/.{2}/g),
            (byte) => parseInt(byte, 16)
        );
        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: saltBytes,
                iterations: 120000,
                hash: "SHA-256"
            },
            passwordKey,
            256
        );

        return bytesToHex(new Uint8Array(derivedBits));
    }

    function renderAuthModal() {
        const root = document.querySelector("[data-auth-root]");
        if (!root) return;

        root.innerHTML = `
            <div
                class="modal fade auth-modal"
                id="account-modal"
                tabindex="-1"
                aria-labelledby="account-modal-title"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div>
                                <h2 class="modal-title fs-5" id="account-modal-title">Tài khoản AliHaiBa</h2>
                                <p class="form-hint mb-0">Đăng nhập để tiếp tục mua sắm.</p>
                            </div>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Đóng"
                            ></button>
                        </div>

                        <div class="modal-body pt-3">
                            <ul class="nav nav-pills nav-fill mb-4" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button
                                        class="nav-link active"
                                        id="sign-in-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#sign-in-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="sign-in-pane"
                                        aria-selected="true"
                                    >Đăng nhập</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button
                                        class="nav-link"
                                        id="sign-up-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#sign-up-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="sign-up-pane"
                                        aria-selected="false"
                                    >Tạo tài khoản</button>
                                </li>
                                <li class="nav-item" id="change-password-tab-item" role="presentation">
                                    <button
                                        class="nav-link"
                                        id="change-password-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#change-password-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="change-password-pane"
                                        aria-selected="false"
                                    >Đổi mật khẩu</button>
                                </li>
                            </ul>

                            <div class="tab-content">
                                <div
                                    class="tab-pane fade show active"
                                    id="sign-in-pane"
                                    role="tabpanel"
                                    aria-labelledby="sign-in-tab"
                                    tabindex="0"
                                >
                                    <form id="sign-in-form" class="auth-form">
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-in-email">
                                                Email<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-in-email"
                                                name="email"
                                                type="email"
                                                autocomplete="email"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-in-password">
                                                Mật khẩu<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-in-password"
                                                name="password"
                                                type="password"
                                                autocomplete="current-password"
                                                required
                                            >
                                        </div>
                                        <button class="btn btn-primary w-100" type="submit">Đăng nhập</button>
                                    </form>
                                </div>

                                <div
                                    class="tab-pane fade"
                                    id="sign-up-pane"
                                    role="tabpanel"
                                    aria-labelledby="sign-up-tab"
                                    tabindex="0"
                                >
                                    <form id="sign-up-form" class="auth-form">
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-up-name">
                                                Họ và tên<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-up-name"
                                                name="name"
                                                autocomplete="name"
                                                minlength="2"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-up-email">
                                                Email<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-up-email"
                                                name="email"
                                                type="email"
                                                autocomplete="email"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-up-password">
                                                Mật khẩu<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-up-password"
                                                name="password"
                                                type="password"
                                                autocomplete="new-password"
                                                minlength="8"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="sign-up-confirm">
                                                Nhập lại mật khẩu<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="sign-up-confirm"
                                                name="confirmPassword"
                                                type="password"
                                                autocomplete="new-password"
                                                minlength="8"
                                                required
                                            >
                                        </div>
                                        <button class="btn btn-primary w-100" type="submit">Tạo tài khoản</button>
                                    </form>
                                </div>
                                <div
                                    class="tab-pane fade"
                                    id="change-password-pane"
                                    role="tabpanel"
                                    aria-labelledby="change-password-tab"
                                    tabindex="0"
                                >
                                    <form id="change-password-form" class="auth-form">
                                        <div class="mb-3">
                                            <label class="form-label" for="current-password">
                                                Mật khẩu hiện tại<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="current-password"
                                                name="currentPassword"
                                                type="password"
                                                autocomplete="current-password"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="new-password">
                                                Mật khẩu mới<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="new-password"
                                                name="newPassword"
                                                type="password"
                                                autocomplete="new-password"
                                                minlength="8"
                                                required
                                            >
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" for="confirm-new-password">
                                                Nhập lại mật khẩu mới<span class="required-marker">(*)</span>
                                            </label>
                                            <input
                                                class="form-control"
                                                id="confirm-new-password"
                                                name="confirmPassword"
                                                type="password"
                                                autocomplete="new-password"
                                                minlength="8"
                                                required
                                            >
                                        </div>
                                        <button class="btn btn-primary w-100" type="submit">
                                            Cập nhật mật khẩu
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <p class="auth-notice mt-3 mb-0">
                                Bản demo lưu tài khoản trên trình duyệt này; không dùng mật khẩu thật.
                                Dữ liệu localStorage không thay thế hệ thống xác thực phía máy chủ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function openAuthModal(view = "sign-in") {
        const modalElement = document.querySelector("#account-modal");
        const bootstrapApi = window.bootstrap;
        const signedInUser = getCurrentUser();
        const selectedView =
            view === "change-password" && !signedInUser ? "sign-in" : view;
        const tabIds = {
            "sign-up": "#sign-up-tab",
            "change-password": "#change-password-tab"
        };
        const tabId = tabIds[selectedView] || "#sign-in-tab";
        const tabElement = document.querySelector(tabId);

        if (!bootstrapApi || !bootstrapApi.Tab || !bootstrapApi.Modal) {
            console.error("AliHaiBa cannot open the account dialog because Bootstrap is unavailable.");
            notify("Không thể mở biểu mẫu tài khoản.", "error");
            return;
        }

        if (tabElement) {
            bootstrapApi.Tab.getOrCreateInstance(tabElement).show();
        }

        if (modalElement) {
            bootstrapApi.Modal.getOrCreateInstance(modalElement).show();
        }
    }

    function closeAuthModal() {
        const modalElement = document.querySelector("#account-modal");
        const modalApi = window.bootstrap && window.bootstrap.Modal;
        if (!modalElement || !modalApi) return;

        const modal = modalApi.getInstance(modalElement);
        if (modal) modal.hide();
    }

    async function handleSignUp(form) {
        if (!form.reportValidity()) return;

        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim().toLowerCase();
        const password = form.elements.password.value;
        const confirmation = form.elements.confirmPassword.value;
        const accounts = getAccounts();

        if (password !== confirmation) {
            notify("Hai mật khẩu chưa trùng khớp.", "error");
            return;
        }

        if (accounts.some((account) => account.email === email)) {
            notify("Email này đã có tài khoản. Hãy đăng nhập.", "warning");
            openAuthModal("sign-in");
            return;
        }

        try {
            const salt = createSalt();
            const account = {
                id: `account-${Date.now()}-${salt.slice(0, 8)}`,
                name,
                email,
                salt,
                passwordHash: await hashPassword(password, salt),
                createdAt: new Date().toISOString()
            };

            if (!writeStorage(STORAGE_KEYS.accounts, [...accounts, account])) return;
            if (!writeStorage(STORAGE_KEYS.session, { userId: account.id })) return;

            form.reset();
            closeAuthModal();
            app.renderHeader();
            notify("Tài khoản đã được tạo. Bạn đã đăng nhập.");
        } catch (error) {
            console.error("AliHaiBa could not create the demo account.", error);
            notify("Không thể tạo tài khoản. Hãy mở trang qua localhost hoặc HTTPS.", "error");
        }
    }

    async function handleSignIn(form) {
        if (!form.reportValidity()) return;

        const email = form.elements.email.value.trim().toLowerCase();
        const password = form.elements.password.value;
        const account = getAccounts().find((item) => item.email === email);

        if (!account) {
            notify("Email hoặc mật khẩu không chính xác.", "error");
            return;
        }

        try {
            const passwordHash = await hashPassword(password, account.salt);
            if (passwordHash !== account.passwordHash) {
                notify("Email hoặc mật khẩu không chính xác.", "error");
                return;
            }

            if (!writeStorage(STORAGE_KEYS.session, { userId: account.id })) return;

            form.reset();
            closeAuthModal();
            app.renderHeader();
            notify(`Chào mừng ${account.name} quay lại!`);
        } catch (error) {
            console.error("AliHaiBa could not sign in the demo account.", error);
            notify("Không thể đăng nhập. Hãy mở trang qua localhost hoặc HTTPS.", "error");
        }
    }

    async function handleChangePassword(form) {
        if (!form.reportValidity()) return;

        const currentUser = getCurrentUser();
        if (!currentUser) {
            notify("Vui lòng đăng nhập để đổi mật khẩu.", "info");
            openAuthModal("sign-in");
            return;
        }

        const currentPassword = form.elements.currentPassword.value;
        const newPassword = form.elements.newPassword.value;
        const confirmation = form.elements.confirmPassword.value;
        if (newPassword !== confirmation) {
            notify("Mật khẩu mới nhập lại chưa trùng khớp.", "error");
            return;
        }

        try {
            const currentHash = await hashPassword(currentPassword, currentUser.salt);
            if (currentHash !== currentUser.passwordHash) {
                notify("Mật khẩu hiện tại không chính xác.", "error");
                return;
            }

            const newSalt = createSalt();
            const updatedAccount = {
                ...currentUser,
                salt: newSalt,
                passwordHash: await hashPassword(newPassword, newSalt),
                updatedAt: new Date().toISOString()
            };
            const updatedAccounts = getAccounts().map((account) =>
                account.id === currentUser.id ? updatedAccount : account
            );

            if (!writeStorage(STORAGE_KEYS.accounts, updatedAccounts)) return;

            form.reset();
            closeAuthModal();
            notify("Đã đổi mật khẩu thành công.");
        } catch (error) {
            console.error("AliHaiBa could not change the demo account password.", error);
            notify("Không thể đổi mật khẩu. Hãy mở trang qua localhost hoặc HTTPS.", "error");
        }
    }

    function handleSignOut() {
        if (!removeStorage(STORAGE_KEYS.session)) return;
        app.renderHeader();
        notify("Bạn đã đăng xuất.");
    }
    Object.assign(app, {
        getAccounts,
        getCurrentUser,
        renderAuthModal,
        openAuthModal,
        closeAuthModal,
        handleSignUp,
        handleSignIn,
        handleChangePassword,
        handleSignOut
    });
})(window.AliHaiBa = window.AliHaiBa || {});
