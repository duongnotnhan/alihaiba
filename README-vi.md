# AliHaiBa — Website demo bán thiết bị công nghệ

AliHaiBa là dự án website bán hàng điện tử dạng **front-end demo** dùng để thực hành và trình bày cách xây dựng giao diện thương mại điện tử thuần sử dụng HTML, CSS và JavaScript. Người dùng có thể duyệt sản phẩm, quản lý giỏ hàng và thử các luồng tài khoản, nhưng toàn bộ dữ liệu chỉ được lưu trong trình duyệt; dự án không có máy chủ, cơ sở dữ liệu hay thanh toán thật.

> **Lưu ý:** AliHaiBa là thương hiệu giả lập phục vụ mục đích học tập, không đại diện cho một cửa hàng hoặc doanh nghiệp thực tế.

## Mục tiêu của repository

- Minh họa cấu trúc một website bán hàng nhiều trang, có giao diện responsive.
- Thực hành tách HTML, CSS và JavaScript theo vai trò, đồng thời chia logic JavaScript thành các module nhỏ.
- Mô phỏng những luồng thường gặp trong cửa hàng trực tuyến bằng `localStorage`.
- Cung cấp mã nguồn và tài nguyên để chạy thử hoặc triển khai website tĩnh trên GitHub Pages.

## Phân tích yêu cầu

### Yêu cầu chức năng

- Hiển thị danh mục thiết bị công nghệ và thông tin sản phẩm.
- Tìm kiếm, lọc theo danh mục, sắp xếp sản phẩm và mở cửa sổ xem chi tiết.
- Thêm/xóa sản phẩm yêu thích; thêm sản phẩm vào giỏ và thay đổi số lượng.
- Mô phỏng đăng ký, đăng nhập, đăng xuất và đổi mật khẩu.
- Chỉ cho phép hoàn tất đơn hàng demo khi người dùng đã đăng nhập.
- Lưu lời nhắn từ biểu mẫu liên hệ vào `localStorage` của trình duyệt mà thiết bị đang sử dụng.

### Yêu cầu giao diện

- Bố cục thích ứng với máy tính, máy tính bảng và điện thoại.
- Có điều hướng dùng chung, thông báo tương tác và hiệu ứng chuyển trang.
- Dùng Bootstrap và Font Awesome được lưu trong repository để dựng giao diện.

> **Nâng cao:** Tôn trọng thiết lập giảm chuyển động (`prefers-reduced-motion`) của thiết bị.

## Thiết kế kiến trúc

Ứng dụng được phân thành ba lớp chính:

```text
Trang HTML
  ├── index.html       Trang chủ
  ├── products.html    Danh mục sản phẩm
  ├── about.html       Giới thiệu
  └── contact.html     Liên hệ
          │
          ├── CSS: giao diện chung và quy tắc responsive
          └── JavaScript: giao diện dùng chung và nghiệp vụ demo
                    │
                    └── localStorage của trình duyệt
```

Không có API hoặc backend. Danh mục sản phẩm được khai báo tĩnh trong `js/data.js`; giỏ hàng, yêu thích, tài khoản demo, phiên đăng nhập và lời nhắn đều được lưu trong `localStorage`.

### Vai trò các tệp JavaScript

| Tệp | Vai trò |
| --- | --- |
| `data.js` | Khai báo danh mục sản phẩm và tên các khóa lưu trữ. |
| `storage.js` | Đọc/ghi `localStorage`, định dạng giá, thông báo và xử lý chuỗi hiển thị an toàn. |
| `auth.js` | Giao diện và luồng đăng ký, đăng nhập, đăng xuất, đổi mật khẩu. |
| `products.js` | Kết xuất sản phẩm, tìm kiếm/lọc/sắp xếp và cửa sổ chi tiết sản phẩm. |
| `cart.js` | Quản lý giỏ hàng, yêu thích và đơn hàng demo. |
| `forms.js` | Kiểm tra và lưu biểu mẫu liên hệ. |
| `layout.js` | Kết xuất header, footer, giỏ hàng và cửa sổ tài khoản dùng chung. |
| `main.js` | Khởi tạo trang và điều phối sự kiện tương tác. |

Các trang nạp script theo thứ tự phụ thuộc: dữ liệu và tiện ích lưu trữ trước, tiếp theo là các module tính năng, cuối cùng là `main.js`.

## Cách triển khai mã nguồn

1. **Khung trang:** mỗi trang có cấu trúc HTML riêng và các thẻ đánh dấu để JavaScript kết xuất header, footer, giỏ hàng và tài khoản dùng chung.
2. **Giao diện:** Bootstrap cung cấp lưới và thành phần cơ bản; FontAwesome cung cấp các biểu tượng; `style.css` chứa thiết kế chung và `responsive.css` chứa các điều chỉnh theo kích thước màn hình.
3. **Dữ liệu:** sản phẩm mẫu nằm trong `js/data.js`. Các thao tác của người dùng đọc/ghi dữ liệu demo qua tiện ích trong `js/storage.js`.
4. **Tương tác:** các module JavaScript xử lý sự kiện như tìm sản phẩm, mở chi tiết, quản lý giỏ hàng, xác thực biểu mẫu và trạng thái tài khoản.
5. **Thông báo:** Sử dụng thư viện SweetAlert2 từ CDN để hiển thị thông báo tương tác; nếu không tải được, JS sẽ tự động dùng hộp thoại trình duyệt.

## Mô tả các trang chính

| Trang | Nội dung |
| --- | --- |
| `index.html` | Trang chủ, giới thiệu cửa hàng, nhóm danh mục và một số sản phẩm nổi bật. |
| `products.html` | Danh mục hơn 25 sản phẩm thuộc các nhóm điện thoại, laptop, âm thanh và phụ kiện; hỗ trợ tìm kiếm, lọc, sắp xếp và xem chi tiết. |
| `about.html` | Thông tin giới thiệu và hình ảnh về AliHaiBa. |
| `contact.html` | Thông tin liên hệ và biểu mẫu gửi lời nhắn demo. |

## Tính năng nổi bật

- **Responsive:** bố cục và kích thước thành phần thích ứng với nhiều độ phân giải màn hình.
- **Danh mục sản phẩm:** tìm kiếm theo tên, lọc theo nhóm, sắp xếp theo giá hoặc tên.
- **Chi tiết sản phẩm:** nhấn vào tên hoặc hình ảnh sản phẩm để mở popup thông tin chi tiết.
- **Giỏ hàng và yêu thích:** trạng thái được lưu trong `localStorage` và giữ lại khi tải lại trang trên cùng một trình duyệt.
- **Tài khoản demo:** đăng ký, đăng nhập, đăng xuất và đổi mật khẩu; mật khẩu được giả lập băm bằng Web Crypto trước khi lưu.
- **Đặt hàng demo:** yêu cầu đăng nhập, hiển thị tổng tiền và xác nhận mô phỏng; không tạo giao dịch hoặc gửi đơn hàng lên máy chủ.
- **Biểu mẫu liên hệ:** kiểm tra dữ liệu bắt buộc và lưu lời nhắn cục bộ; không gửi email.
- **Hiệu ứng giao diện:** hiệu ứng vào trang/chuyển trang, thanh thông tin tự cuộn và hiệu ứng trong một số thành phần.

## Hình ảnh minh họa

### Trang chủ

[![Mainpage](https://duongnhanac.orgfree.com/files/alihaiba-mainpage.png)](https://duongnotnhan.github.io/alihaiba/)

### Trang sản phẩm

[![Products](https://duongnhanac.orgfree.com/files/alihaiba-products.png)](https://duongnotnhan.github.io/alihaiba/products.html)

và các trang khác...

## Cấu trúc repository

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

## Chạy thử

Chạy thử website bằng cách truy cập vào địa chỉ [GitHub Page](https://duongnotnhan.github.io/alihaiba/).

## Công nghệ và giới hạn

- **HTML5, CSS3, JavaScript thuần**; không dùng framework JavaScript, node.js hay build front-end.
- **Bootstrap 5.3.8** và **Font Awesome 7.3.1 (free)** được lưu cục bộ trong `css/`.
- **Google Sans** và **SweetAlert2** được nạp từ CDN; cần kết nối Internet để tải các thư viện/font này. Nếu SweetAlert2 không tải được, thông báo sẽ chuyển sang hộp thoại trình duyệt.
- Dữ liệu `localStorage` chỉ thuộc về origin người dùng, không đồng bộ giữa localhost và GitHub Pages, giữa các trình duyệt hoặc thiết bị. Xóa dữ liệu trình duyệt sẽ xóa dữ liệu demo.
- Xác thực hoàn toàn ở phía trình duyệt và có thể bị can thiệp; băm mật khẩu không biến cơ chế demo thành hệ thống bảo mật thực tế. Không dùng cho tài khoản hoặc dữ liệu thật.
- Không có cổng thanh toán, xử lý đơn hàng, gửi email, API hay cơ sở dữ liệu.

----
Dự án được hỗ trợ thực hiện bởi GitHub Copilot (Agent).
