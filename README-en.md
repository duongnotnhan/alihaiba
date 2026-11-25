# AliHaiBa — Electronics Storefront Demo

> Contents below are AI-translated from the original Vietnamese [README-vi.md](./README-vi.md). The English version is provided for reference and may contain minor inaccuracies.

AliHaiBa is a **front-end demo** of an electronics storefront, created to practice and demonstrate how to build a multi-page e-commerce interface with HTML, CSS, and vanilla JavaScript. Users can browse products, manage a shopping cart, and try account workflows. User-generated demo data is stored in the browser; the project has no server, database, or real payment processing.

> **Disclaimer:** AliHaiBa is a fictional brand created for educational purposes and is not affiliated with any real store or business.

## Repository goals

- Demonstrate the structure of a responsive, multi-page storefront.
- Practice separating HTML, CSS, and JavaScript by responsibility, and organizing JavaScript logic into small modules.
- Simulate common online-store workflows with `localStorage`.
- Provide the source code and assets needed to run the site locally or deploy it as a static website on GitHub Pages.

## Requirements analysis

### Functional requirements

- Display an electronics catalog and product information.
- Search, filter by category, sort products, and open a product-details modal.
- Add or remove favorites; add products to the cart and change item quantities.
- Simulate sign-up, sign-in, sign-out, and password changes.
- Require the user to be signed in before completing a demo order.
- Save contact-form messages to `localStorage` in the browser being used.

### Interface requirements

- Adapt the layout to desktop, tablet, and mobile screens.
- Provide shared navigation, interactive notifications, and page-transition effects.
- Use Bootstrap and Font Awesome assets stored in the repository.

> **Additional:** Respect the device's reduced-motion preference (`prefers-reduced-motion`).

## Architecture

The application is organized into three main layers:

```text
HTML pages
  ├── index.html       Home
  ├── products.html    Product catalog
  ├── about.html       About
  └── contact.html     Contact
          │
          ├── CSS: shared styles and responsive rules
          └── JavaScript: shared UI and demo business logic
                    │
                    └── Browser localStorage
```

There is no API or back end. The product catalog is defined statically in `js/data.js`; the cart, favorites, demo accounts, sign-in session, and contact messages are stored in `localStorage`.

### JavaScript module responsibilities

| File | Responsibility |
| --- | --- |
| `data.js` | Defines the product catalog and storage-key names. |
| `storage.js` | Reads and writes `localStorage`, formats prices, displays notifications, and safely escapes text for HTML. |
| `auth.js` | Provides the sign-up, sign-in, sign-out, and password-change UI and workflows. |
| `products.js` | Renders products and handles search, filtering, sorting, and the product-details modal. |
| `cart.js` | Manages the shopping cart, favorites, and demo orders. |
| `forms.js` | Validates and saves the contact form. |
| `layout.js` | Renders the shared header, footer, cart, and account modal. |
| `main.js` | Initializes each page and coordinates interaction events. |

Scripts are loaded in dependency order: data and storage utilities first, followed by feature modules, with `main.js` loaded last.

## Source-code implementation

1. **Page structure:** Each page has its own HTML layout and placeholders that JavaScript uses to render the shared header, footer, cart, and account UI.
2. **Interface:** Bootstrap provides the grid and base components; Font Awesome provides icons. `style.css` contains shared styling, while `responsive.css` contains viewport-specific adjustments.
3. **Data:** Sample products are defined in `js/data.js`. User actions read and write demo data through the utilities in `js/storage.js`.
4. **Interactions:** JavaScript modules handle events such as product search, opening product details, cart management, form validation, and account state.
5. **Notifications:** SweetAlert2 is loaded from a CDN for interactive notifications. If it cannot be loaded, the JavaScript falls back to browser dialogs.

## Main pages

| Page | Description |
| --- | --- |
| `index.html` | Home page introducing the store, product categories, and selected featured products. |
| `products.html` | Catalog of more than 25 products across phones, laptops, audio, and accessories, with search, filtering, sorting, and product details. |
| `about.html` | Information about AliHaiBa and related imagery. |
| `contact.html` | Contact information and a demo message form. |

## Key features

- **Responsive layout:** Components adapt to different screen sizes.
- **Product catalog:** Search by name, filter by category, and sort by price or name.
- **Product details:** Select a product name or image to open its details in a popup.
- **Cart and favorites:** Their state is stored in `localStorage` and persists across page reloads on the same origin.
- **Demo accounts:** Sign up, sign in, sign out, and change passwords; passwords are hashed with Web Crypto before being stored.
- **Demo checkout:** Requires sign-in, displays the total, and simulates order confirmation. It does not create a real transaction or send an order to a server.
- **Contact form:** Validates required fields and saves messages locally; it does not send email.
- **Interface effects:** Page-entry and page-transition animations, a self-scrolling information bar, and animations on selected components.

## Screenshots

### Home page

[![Home page](https://duongnhanac.orgfree.com/files/alihaiba-mainpage.png)](https://duongnotnhan.github.io/alihaiba/)

### Product catalog

[![Product catalog](https://duongnhanac.orgfree.com/files/alihaiba-products.png)](https://duongnotnhan.github.io/alihaiba/products.html)

And other pages...

## Repository structure

```text
alihaiba/
├── index.html
├── products.html
├── about.html
├── contact.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── bootstrap-5.3.8-dist/
│   └── fontawesome/
├── js/
│   ├── data.js
│   ├── storage.js
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── layout.js
│   ├── forms.js
│   └── main.js
├── images/
└── .github/workflows/
```

## Try it out

Visit the [AliHaiBa GitHub Pages site](https://duongnotnhan.github.io/alihaiba/) to try the demo.

## Technologies and limitations

- **HTML5, CSS3, and vanilla JavaScript**; no JavaScript framework, Node.js runtime, or front-end build step is required.
- **Bootstrap 5.3.8** and **Font Awesome 7.3.1 Free** are stored locally in `css/`.
- **Google Sans** and **SweetAlert2** are loaded from CDNs and require an Internet connection. If SweetAlert2 cannot be loaded, notifications fall back to browser dialogs.
- `localStorage` is scoped to the current origin and does not sync between localhost and GitHub Pages, different browsers, or devices. Clearing browser data removes the demo data.
- Authentication runs entirely in the browser and can be tampered with. Hashing passwords does not make this demo a production-ready security system. Do not use real accounts or sensitive data.
- There is no payment gateway, real order processing, email delivery, API, or database.

----
This project was developed with assistance from GitHub Copilot (Agent).
