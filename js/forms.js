(function (app) {
    "use strict";
    const {
        STORAGE_KEYS,
        readStorage,
        writeStorage,
        notify
    } = app;

    function handleContactForm(form) {
        if (!form.reportValidity()) return;

        const messages = readStorage(STORAGE_KEYS.messages, []);
        if (!Array.isArray(messages)) {
            notify("Không thể lưu lời nhắn.", "error");
            return;
        }

        messages.push({
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            subject: form.elements.subject.value.trim(),
            message: form.elements.message.value.trim(),
            createdAt: new Date().toISOString()
        });

        if (!writeStorage(STORAGE_KEYS.messages, messages)) return;
        form.reset();

        if (window.Swal) {
            Swal.fire({
                icon: "success",
                title: "Đã ghi nhận lời nhắn!",
                text: "Bản demo lưu lời nhắn trên thiết bị này, không gửi lên máy chủ.",
                confirmButtonText: "Đã hiểu",
                confirmButtonColor: "#6254e7"
            });
        } else {
            notify("Đã ghi nhận lời nhắn trên thiết bị này.");
        }
    }
    Object.assign(app, {
        handleContactForm
    });
})(window.AliHaiBa = window.AliHaiBa || {});
