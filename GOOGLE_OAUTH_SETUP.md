# Google OAuth Setup Guide - HealthMate

Hướng dẫn chi tiết để enable Google Sign-In cho HealthMate application.

## Bước 1: Truy cập Google Cloud Console

1. Mở trình duyệt và truy cập: https://console.cloud.google.com/
2. Đăng nhập với tài khoản Google của bạn

## Bước 2: Tạo Project mới (hoặc chọn project có sẵn)

### Tạo Project mới:
1. Click vào dropdown **"Select a project"** ở góc trên bên trái (bên cạnh logo Google Cloud)
2. Click nút **"NEW PROJECT"** ở góc trên bên phải của popup
3. Nhập thông tin:
   - **Project name**: `HealthMate` (hoặc tên bạn muốn)
   - **Location**: Để mặc định hoặc chọn organization nếu có
4. Click **"CREATE"**
5. Đợi vài giây để project được tạo
6. Chọn project vừa tạo từ dropdown

## Bước 3: Enable Google+ API (QUAN TRỌNG)

### Cách 1: Qua API Library
1. Từ menu bên trái, click vào **"APIs & Services"** → **"Library"**
2. Trong thanh tìm kiếm, gõ: `Google+ API`
3. Click vào **"Google+ API"** từ kết quả tìm kiếm
4. Click nút **"ENABLE"** màu xanh
5. Đợi vài giây để API được kích hoạt

### Cách 2: Qua Dashboard
1. Từ menu bên trái, click **"APIs & Services"** → **"Dashboard"**
2. Click nút **"+ ENABLE APIS AND SERVICES"** ở đầu trang
3. Tìm kiếm `Google+ API`
4. Click và enable

## Bước 4: Configure OAuth Consent Screen

Đây là màn hình mà người dùng sẽ thấy khi đăng nhập.

1. Từ menu bên trái, click **"APIs & Services"** → **"OAuth consent screen"**

2. **Chọn User Type:**
   - Chọn **"External"** (cho phép bất kỳ ai có Google account đăng nhập)
   - Click **"CREATE"**

3. **OAuth consent screen - App information:**
   - **App name**: `HealthMate` (tên app sẽ hiển thị cho users)
   - **User support email**: Chọn email của bạn từ dropdown
   - **App logo**: (Optional) Upload logo nếu có
   - **Application home page**: `http://localhost:5173` (development) hoặc domain thật khi deploy
   - **Application privacy policy link**: (Optional) có thể để trống lúc dev
   - **Application terms of service link**: (Optional) có thể để trống lúc dev
   - **Authorized domains**: (Optional) domain của bạn khi deploy
   - **Developer contact information - Email addresses**: Nhập email của bạn

4. Click **"SAVE AND CONTINUE"**

5. **Scopes (Phạm vi truy cập):**
   - Click **"ADD OR REMOVE SCOPES"**
   - Tìm và chọn các scopes sau:
     - `/.../auth/userinfo.email` - Xem email address
     - `/.../auth/userinfo.profile` - Xem thông tin profile cơ bản
     - `openid` - Authenticate with Google
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

6. **Test users (nếu app đang ở Publishing status "Testing"):**
   - Click **"+ ADD USERS"**
   - Nhập email của bạn và các testers
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary:**
   - Review lại thông tin
   - Click **"BACK TO DASHBOARD"**

## Bước 5: Tạo OAuth 2.0 Credentials

Đây là bước quan trọng nhất để lấy Client ID.

1. Từ menu bên trái, click **"APIs & Services"** → **"Credentials"**

2. Click nút **"+ CREATE CREDENTIALS"** ở đầu trang

3. Chọn **"OAuth client ID"** từ dropdown

4. **Create OAuth client ID:**
   - **Application type**: Chọn **"Web application"**
   - **Name**: `HealthMate Web Client` (hoặc tên bạn muốn)

5. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Nhập: `http://localhost:5173` (cho development)
   - Click **"+ ADD URI"** nếu muốn thêm domain production
   - Ví dụ: `https://healthmate.com`

6. **Authorized redirect URIs:** (KHÔNG CẦN cho @react-oauth/google)
   - Có thể để trống vì library tự xử lý

7. Click **"CREATE"**

8. **Popup hiện ra với Client ID:**
   - Copy **"Your Client ID"** - Chuỗi dạng: `xxxxx.apps.googleusercontent.com`
   - **QUAN TRỌNG**: Copy và lưu lại Client ID này
   - Client Secret không cần cho frontend

## Bước 6: Cấu hình Frontend

1. Tạo file `.env` trong folder `frontend/`:
   ```bash
   cd frontend
   touch .env
   ```

2. Mở file `.env` và thêm:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
   ```

3. **QUAN TRỌNG**:
   - Replace `paste-your-client-id-here.apps.googleusercontent.com` với Client ID thật
   - Không để dấu ngoặc kép `"` xung quanh
   - Không có spaces

## Bước 7: Test Google Sign-In

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend chạy ở: http://localhost:4000

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend chạy ở: http://localhost:5173

3. **Mở trình duyệt:**
   - Truy cập: http://localhost:5173/login
   - Bạn sẽ thấy nút **"Sign in with Google"**
   - Click vào nút đó

4. **Google Sign-In Flow:**
   - Popup Google đăng nhập sẽ mở
   - Chọn tài khoản Google
   - Nếu lần đầu: Popup consent screen yêu cầu permission
   - Click **"Allow"** hoặc **"Continue"**
   - Tự động redirect về app và đăng nhập thành công

## Troubleshooting - Các lỗi thường gặp

### Lỗi: "Access blocked: This app's request is invalid"
**Nguyên nhân**: Chưa setup OAuth consent screen
**Giải pháp**: Quay lại Bước 4, hoàn thành OAuth consent screen

### Lỗi: "redirect_uri_mismatch"
**Nguyên nhân**: URI không khớp với authorized origins
**Giải pháp**:
- Vào Credentials → Edit OAuth client
- Kiểm tra "Authorized JavaScript origins" có `http://localhost:5173`
- Lưu ý: KHÔNG CÓ dấu `/` ở cuối

### Lỗi: "This app is blocked"
**Nguyên nhân**: App đang ở trạng thái "Testing" và email chưa được add
**Giải pháp**:
- Vào OAuth consent screen
- Scroll xuống "Test users"
- Add email của bạn vào danh sách

### Lỗi: Popup không mở hoặc bị chặn
**Nguyên nhân**: Browser block popups
**Giải pháp**:
- Allow popups cho localhost:5173
- Hoặc click vào icon popup bị block trên address bar

### Lỗi: "Invalid Client ID"
**Nguyên nhân**: Client ID sai hoặc chưa được set
**Giải pháp**:
- Kiểm tra file `.env` có đúng `VITE_GOOGLE_CLIENT_ID`
- Restart dev server sau khi thay đổi .env
- Verify Client ID từ Google Cloud Console

### Google One Tap không hiện
**Nguyên nhân**: Đã đăng nhập rồi, hoặc browser blocking
**Giải pháp**:
- One Tap chỉ hiện lần đầu cho new users
- Thử incognito mode
- Clear cookies và thử lại

## Security Notes - Bảo mật

### Môi trường Development:
✅ **OK to use:**
- `http://localhost:5173`
- `http://localhost:3000`
- `http://127.0.0.1:5173`

### Môi trường Production:
⚠️ **PHẢI dùng HTTPS:**
- `https://yourdomain.com`
- KHÔNG dùng `http://` trên production

### Client ID Security:
- ✅ Client ID có thể public (được embed trong frontend)
- ✅ Client ID KHÔNG phải secret key
- ❌ Client Secret phải giữ bí mật (nhưng không cần cho @react-oauth/google)
- ❌ KHÔNG commit file `.env` vào git

### .gitignore
Đảm bảo file `.gitignore` có:
```
# Environment variables
.env
.env.local
.env.production
```

## Publishing App (Optional - Khi deploy production)

Nếu muốn cho nhiều người dùng (không chỉ test users):

1. Vào **OAuth consent screen**
2. Click **"PUBLISH APP"**
3. Google sẽ review app (có thể mất vài ngày)
4. Sau khi approved, bất kỳ ai cũng có thể đăng nhập

**Lưu ý**: Trong lúc development, để "Testing" status là đủ.

## Resources - Tài liệu tham khảo

- Google Cloud Console: https://console.cloud.google.com/
- @react-oauth/google docs: https://www.npmjs.com/package/@react-oauth/google
- OAuth 2.0 for Web Apps: https://developers.google.com/identity/protocols/oauth2/web-server

## Support

Nếu gặp vấn đề:
1. Check lại từng bước trong guide này
2. Xem phần Troubleshooting
3. Check browser console cho error messages
4. Verify `.env` file được config đúng
5. Restart cả backend và frontend sau khi thay đổi .env

---

**Last Updated**: 2025-10-20
**Version**: 1.0
**Feature Branch**: feature/google-login
