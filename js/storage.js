(function (app) {
"use strict";

function readStorage(storageKey, fallbackValue) {
    try {
        const serializedValue = localStorage.getItem(storageKey);
        return serializedValue === null
            ? fallbackValue
            : JSON.parse(serializedValue);
    } catch (error) {
        console.error(
            `AliHaiBa could not read localStorage key "${storageKey}".`,
            error
        );
        return fallbackValue;
    }
}

function writeStorage(storageKey, data) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(
            `AliHaiBa could not write localStorage key "${storageKey}".`,
            error
        );
        notify(
            "Không thể lưu dữ liệu trên thiết bị. Vui lòng kiểm tra dung lượng trình duyệt.",
            "error"
        );
        return false;
    }
}

function removeStorage(storageKey) {
    try {
        localStorage.removeItem(storageKey);
        return true;
    } catch (error) {
        console.error(
            `AliHaiBa could not remove localStorage key "${storageKey}".`,
            error
        );
        notify("Không thể đăng xuất khỏi thiết bị này.", "error");
        return false;
    }
}

function notify(message, icon = "success") {
    if (window.Swal) {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon,
            title: message,
            showConfirmButton: false,
            timer: 2600,
        });
        return;
    }

    window.alert(message);
}

function formatPrice(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function escapeHtml(untrustedText) {
    return String(untrustedText).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}
Object.assign(app, {
    readStorage,
    writeStorage,
    removeStorage,
    notify,
    formatPrice,
    escapeHtml
});
})(window.AliHaiBa = window.AliHaiBa || {});
