(function (app) {
    "use strict";

    const STORAGE_KEYS = {
        cart: "alihai_ba_cart",
        favorites: "alihai_ba_favorites",
        messages: "alihai_ba_messages",
        accounts: "alihai_ba_accounts",
        session: "alihai_ba_session"
    };

    const PRODUCTS = [
        {
            id: "phone-pro",
            name: "AliHaiBa Phone Pro",
            category: "Điện thoại",
            price: 24990000,
            oldPrice: 27990000,
            badge: "Bán chạy",
            rating: "4.9",
            image: "images/product-01.jpg"
        },
        {
            id: "phone-edge",
            name: "AliHaiBa Edge 5G",
            category: "Điện thoại",
            price: 18990000,
            oldPrice: 20990000,
            badge: "Mới",
            rating: "4.8",
            image: "images/product-09.jpg"
        },
        {
            id: "phone-lite",
            name: "AliHaiBa Lite 5G",
            category: "Điện thoại",
            price: 12990000,
            oldPrice: 13990000,
            badge: "Ưu đãi",
            rating: "4.7",
            image: "images/product-10.jpg"
        },
        {
            id: "phone-mini",
            name: "AliHaiBa Mini",
            category: "Điện thoại",
            price: 9990000,
            oldPrice: null,
            badge: "",
            rating: "4.6",
            image: "images/product-11.jpg"
        },
        {
            id: "phone-max",
            name: "AliHaiBa Max",
            category: "Điện thoại",
            price: 21990000,
            oldPrice: 23990000,
            badge: "",
            rating: "4.8",
            image: "images/product-12.jpg"
        },
        {
            id: "phone-fold",
            name: "AliHaiBa Fold",
            category: "Điện thoại",
            price: 32990000,
            oldPrice: null,
            badge: "Cao cấp",
            rating: "4.9",
            image: "images/product-13.jpg"
        },
        {
            id: "laptop-air",
            name: "AliHaiBa Air 14",
            category: "Laptop",
            price: 28990000,
            oldPrice: 31990000,
            badge: "Mới",
            rating: "4.8",
            image: "images/product-02.jpg"
        },
        {
            id: "laptop-pro",
            name: "AliHaiBa Book Pro 16",
            category: "Laptop",
            price: 39990000,
            oldPrice: 42990000,
            badge: "Bán chạy",
            rating: "4.9",
            image: "images/product-14.jpg"
        },
        {
            id: "laptop-creator",
            name: "AliHaiBa Creator 15",
            category: "Laptop",
            price: 35990000,
            oldPrice: null,
            badge: "",
            rating: "4.8",
            image: "images/product-15.jpg"
        },
        {
            id: "laptop-flex",
            name: "AliHaiBa Flex 13",
            category: "Laptop",
            price: 24990000,
            oldPrice: 26990000,
            badge: "Ưu đãi",
            rating: "4.7",
            image: "images/product-16.jpg"
        },
        {
            id: "laptop-gaming",
            name: "AliHaiBa Gaming X",
            category: "Laptop",
            price: 42990000,
            oldPrice: null,
            badge: "Mới",
            rating: "4.9",
            image: "images/product-17.jpg"
        },
        {
            id: "laptop-studio",
            name: "AliHaiBa Studio 14",
            category: "Laptop",
            price: 31990000,
            oldPrice: 33990000,
            badge: "",
            rating: "4.8",
            image: "images/product-18.jpg"
        },
        {
            id: "headphones-studio",
            name: "SoundWave Studio",
            category: "Âm thanh",
            price: 5490000,
            oldPrice: 6290000,
            badge: "Ưu đãi",
            rating: "4.9",
            image: "images/product-03.jpg"
        },
        {
            id: "earbuds-air",
            name: "AirBeat Pro",
            category: "Âm thanh",
            price: 2890000,
            oldPrice: 3290000,
            badge: "Bán chạy",
            rating: "4.8",
            image: "images/product-05.jpg"
        },
        {
            id: "headphones-anc",
            name: "SoundWave ANC",
            category: "Âm thanh",
            price: 6990000,
            oldPrice: 7590000,
            badge: "Chống ồn",
            rating: "4.9",
            image: "images/product-19.jpg"
        },
        {
            id: "speaker-bass",
            name: "BassGo Mini",
            category: "Âm thanh",
            price: 1590000,
            oldPrice: null,
            badge: "",
            rating: "4.6",
            image: "images/product-20.jpg"
        },
        {
            id: "soundwave-max",
            name: "SoundWave Max",
            category: "Âm thanh",
            price: 8990000,
            oldPrice: 9990000,
            badge: "Mới",
            rating: "4.8",
            image: "images/product-21.jpg"
        },
        {
            id: "earbuds-lite",
            name: "AirBeat Lite",
            category: "Âm thanh",
            price: 1290000,
            oldPrice: null,
            badge: "",
            rating: "4.5",
            image: "images/product-22.jpg"
        },
        {
            id: "speaker-boom",
            name: "BoomBox Portable",
            category: "Âm thanh",
            price: 3490000,
            oldPrice: 3890000,
            badge: "",
            rating: "4.7",
            image: "images/product-23.jpg"
        },
        {
            id: "watch-active",
            name: "AliHaiBa Watch Active",
            category: "Phụ kiện",
            price: 3790000,
            oldPrice: null,
            badge: "",
            rating: "4.7",
            image: "images/product-04.jpg"
        },
        {
            id: "tablet-plus",
            name: "AliHaiBa Tab Plus",
            category: "Phụ kiện",
            price: 11990000,
            oldPrice: null,
            badge: "Mới",
            rating: "4.6",
            image: "images/product-06.jpg"
        },
        {
            id: "camera-mini",
            name: "PixelCam Mini",
            category: "Phụ kiện",
            price: 7290000,
            oldPrice: 7990000,
            badge: "",
            rating: "4.7",
            image: "images/product-07.jpg"
        },
        {
            id: "keyboard-mech",
            name: "KeyType Mechanical",
            category: "Phụ kiện",
            price: 2190000,
            oldPrice: null,
            badge: "",
            rating: "4.8",
            image: "images/product-08.jpg"
        },
        {
            id: "watch-fit",
            name: "AliHaiBa Watch Fit",
            category: "Phụ kiện",
            price: 2490000,
            oldPrice: 2790000,
            badge: "Ưu đãi",
            rating: "4.6",
            image: "images/product-24.jpg"
        },
        {
            id: "mouse-air",
            name: "Click Air Wireless",
            category: "Phụ kiện",
            price: 890000,
            oldPrice: null,
            badge: "",
            rating: "4.5",
            image: "images/product-25.jpg"
        },
        {
            id: "powerbank-20k",
            name: "PowerBank 20K",
            category: "Phụ kiện",
            price: 1190000,
            oldPrice: 1390000,
            badge: "Bán chạy",
            rating: "4.7",
            image: "images/product-26.jpg"
        },
        {
            id: "laptop-hub",
            name: "Type-C Hub 8-in-1",
            category: "Phụ kiện",
            price: 1490000,
            oldPrice: null,
            badge: "",
            rating: "4.6",
            image: "images/product-27.jpg"
        },
        {
            id: "gamepad-wireless",
            name: "GamePad Wireless",
            category: "Phụ kiện",
            price: 1890000,
            oldPrice: 2190000,
            badge: "Mới",
            rating: "4.7",
            image: "images/product-28.jpg"
        }
    ];
    Object.assign(app, {
        STORAGE_KEYS,
        PRODUCTS
    });
})(window.AliHaiBa = window.AliHaiBa || {});
