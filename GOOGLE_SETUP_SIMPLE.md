# 🚀 HƯỚNG DẪN SETUP GOOGLE LOGIN - ĐƠN GIẢN

**Thời gian**: ~10 phút
**Yêu cầu**: Tài khoản Google

---

## BƯỚC 1: Truy cập Google Cloud Console

🔗 Mở link này: **https://console.cloud.google.com/**

Đăng nhập bằng tài khoản Google của bạn.

---

## BƯỚC 2: Tạo Project

1. Nhìn lên **góc trên bên TRÁI**, thấy dropdown "Select a project"
2. Click vào dropdown đó
3. Click nút **"NEW PROJECT"** (góc trên bên phải popup)
4. Điền:
   - **Project name**: `HealthMate`
   - **Location**: Để mặc định
5. Click **"CREATE"**
6. Đợi 5-10 giây
7. Click vào dropdown lại và **chọn project "HealthMate" vừa tạo**

---

## BƯỚC 3: Enable API

### Cách 1: Qua Menu (KHUYÊN DÙNG)

1. Nhìn **menu bên TRÁI**, tìm **"APIs & Services"**
2. Click **"APIs & Services"** → Click **"Library"**
3. Ô search ở giữa màn hình, gõ: **`People API`**
4. Click vào **"Google People API"** trong kết quả
5. Click nút **"ENABLE"** màu xanh
6. Đợi vài giây

### Cách 2: Link trực tiếp

Mở link này (thay YOUR_PROJECT_ID):
```
https://console.cloud.google.com/apis/library/people.googleapis.com
```

**✅ XONG BƯỚC 3 KHI**: Thấy chữ "API enabled" màu xanh

---

## BƯỚC 4: OAuth Consent Screen

1. Menu bên trái → **"APIs & Services"** → **"OAuth consent screen"**

2. **Chọn User Type:**
   - Chọn **"External"** ✅
   - Click **"CREATE"**

3. **Điền thông tin App:**

   📝 **Bắt buộc phải điền:**
   - **App name**: `HealthMate`
   - **User support email**: Chọn email của bạn
   - **Developer contact email**: Email của bạn

   📝 **Không bắt buộc (có thể bỏ qua):**
   - App logo
   - App domain
   - Privacy policy
   - Terms of service

4. Click **"SAVE AND CONTINUE"** ở cuối trang

5. **Scopes** (Phần 2):
   - Click **"ADD OR REMOVE SCOPES"**
   - Tìm và tick vào:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
     - ✅ `openid`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

6. **Test users** (Phần 3):
   - Click **"+ ADD USERS"**
   - Nhập email của bạn
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary** (Phần 4):
   - Click **"BACK TO DASHBOARD"**

**✅ XONG BƯỚC 4**

---

## BƯỚC 5: Tạo OAuth Client ID (QUAN TRỌNG NHẤT)

1. Menu bên trái → **"APIs & Services"** → **"Credentials"**

2. Click nút **"+ CREATE CREDENTIALS"** (đầu trang)

3. Chọn **"OAuth client ID"**

4. **Nếu bị báo lỗi "Configure consent screen"**:
   - Click vào link đó
   - Quay lại BƯỚC 4 làm lại
   - Sau đó quay lại đây

5. **Điền thông tin:**
   - **Application type**: Chọn **"Web application"** ⬇️
   - **Name**: `HealthMate Web Client`

6. **Authorized JavaScript origins** (QUAN TRỌNG):
   - Click **"+ ADD URI"**
   - Nhập CHÍNH XÁC: `http://localhost:5173`
   - ⚠️ **KHÔNG CÓ dấu `/` cuối**
   - ⚠️ **ĐÚNG**: `http://localhost:5173`
   - ❌ **SAI**: `http://localhost:5173/`

7. **Authorized redirect URIs**:
   - **BỎ QUA** - không cần điền

8. Click **"CREATE"**

9. **POPUP HIỆN RA - ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT:**

   ```
   OAuth client created
   Your Client ID
   ┌────────────────────────────────────────────────┐
   │ 123456789-abcdefg.apps.googleusercontent.com   │  ← COPY DÒNG NÀY
   └────────────────────────────────────────────────┘

   Your Client Secret
   ┌────────────────────────────────────────────────┐
   │ xxxxxxxxxx                                      │  ← KHÔNG CẦN
   └────────────────────────────────────────────────┘
   ```

   - **COPY** dòng "Your Client ID"
   - Dạng: `xxxxx-xxxxx.apps.googleusercontent.com`
   - ⚠️ **LƯU LẠI** vào Notepad/Notes
   - Client Secret KHÔNG CẦN

10. Click **"OK"**

**✅ XONG BƯỚC 5 - ĐÃ CÓ CLIENT ID**

---

## BƯỚC 6: Cấu hình Frontend

### Mở Terminal:

```bash
cd /Users/admin/Desktop/healthmate-full-stack/frontend
```

### Mở file .env:

```bash
# Dùng VS Code
code .env

# Hoặc TextEdit
open -a TextEdit .env

# Hoặc nano
nano .env
```

### Thêm dòng này vào cuối file:

```env
VITE_GOOGLE_CLIENT_ID=paste-client-id-của-bạn-ở-đây.apps.googleusercontent.com
```

**VÍ DỤ:**
```env
VITE_BACKEND_URL = 'http://localhost:4000'
VITE_RAZORPAY_KEY_ID = '------ Razorpay Key Id here ------'
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
```

⚠️ **LƯU Ý:**
- KHÔNG có dấu ngoặc kép `' '` quanh Client ID
- KHÔNG có khoảng trắng
- Thay `paste-client-id-của-bạn-ở-đây` bằng Client ID thật

### Lưu file (Cmd+S hoặc Ctrl+S)

**✅ XONG BƯỚC 6**

---

## BƯỚC 7: Test thử

### Terminal 1 - Chạy Backend:

```bash
cd /Users/admin/Desktop/healthmate-full-stack/backend
npm start
```

Thấy dòng: `Server is running on http://localhost:4000` → OK ✅

### Terminal 2 - Chạy Frontend:

```bash
cd /Users/admin/Desktop/healthmate-full-stack/frontend
npm run dev
```

Thấy dòng:
```
  ➜  Local:   http://localhost:5173/
```

### Mở trình duyệt:

1. Mở: **http://localhost:5173/login**

2. Phải thấy:
   - ✅ Nút "Sign in with Google" màu trắng với logo Google
   - ✅ Chữ "OR" giữa nút Google và form email/password

3. **Click vào nút "Sign in with Google"**:
   - ✅ Popup Google hiện ra
   - ✅ Chọn tài khoản Google của bạn
   - ✅ Nếu lần đầu: Click "Allow" hoặc "Continue"
   - ✅ Popup đóng, tự động đăng nhập vào app
   - ✅ Redirect về trang chủ
   - ✅ Thấy tên và avatar của bạn ở góc trên

**✅ THÀNH CÔNG!**

---

## ❌ LỖI THƯỜNG GẶP VÀ CÁCH FIX

### Lỗi 1: "Access blocked: This app's request is invalid"

**Nguyên nhân**: Chưa setup OAuth consent screen
**Fix**: Quay lại BƯỚC 4, làm lại từ đầu

---

### Lỗi 2: "redirect_uri_mismatch"

**Nguyên nhân**: URI không khớp
**Fix**:
1. Vào Credentials → Click vào OAuth client vừa tạo
2. Kiểm tra "Authorized JavaScript origins"
3. Phải có CHÍNH XÁC: `http://localhost:5173`
4. Click "SAVE"

---

### Lỗi 3: Không thấy nút Google

**Nguyên nhân**: Chưa thêm VITE_GOOGLE_CLIENT_ID
**Fix**:
1. Check file `frontend/.env`
2. Phải có dòng: `VITE_GOOGLE_CLIENT_ID=...`
3. Restart frontend: Ctrl+C rồi `npm run dev` lại

---

### Lỗi 4: "Invalid Client ID"

**Nguyên nhân**: Client ID sai hoặc có space
**Fix**:
1. Mở `frontend/.env`
2. Xóa dòng `VITE_GOOGLE_CLIENT_ID`
3. Copy lại Client ID từ Google Console
4. Paste lại, đảm bảo không có space
5. Lưu file
6. Restart frontend

---

### Lỗi 5: Popup bị block

**Nguyên nhân**: Browser chặn popup
**Fix**:
1. Nhìn lên address bar
2. Thấy icon popup bị block
3. Click vào → Allow popups for localhost:5173
4. Thử lại

---

### Lỗi 6: "This app is blocked"

**Nguyên nhân**: Email chưa được add vào test users
**Fix**:
1. Google Console → OAuth consent screen
2. Scroll xuống "Test users"
3. Click "ADD USERS"
4. Add email của bạn
5. Save

---

## 📞 CẦN GIÚP ĐỠ?

**Nếu vẫn lỗi:**

1. Check từng bước lại
2. Screenshot màn hình lỗi
3. Check browser console (F12)
4. Verify file `.env` chính xác
5. Restart cả backend VÀ frontend

**Files quan trọng:**
- ✅ `frontend/.env` - Phải có VITE_GOOGLE_CLIENT_ID
- ✅ Backend phải chạy ở port 4000
- ✅ Frontend phải chạy ở port 5173

**Commands hữu ích:**

```bash
# Check backend có chạy không
lsof -i :4000

# Check frontend có chạy không
lsof -i :5173

# Xem nội dung .env
cat frontend/.env

# Kill process nếu port bị chiếm
kill -9 $(lsof -t -i:5173)
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đã tạo Google Cloud Project
- [ ] Đã enable People API
- [ ] Đã setup OAuth consent screen
- [ ] Đã tạo OAuth Client ID
- [ ] Đã copy Client ID
- [ ] Đã thêm vào frontend/.env
- [ ] Đã restart frontend
- [ ] Thấy nút Google trên login page
- [ ] Click được và popup mở
- [ ] Đăng nhập thành công

**KHI NÀO XONG TẤT CẢ → BÁO LẠI ĐỂ MERGE VÀO MAIN!**

---

**Created**: 2025-10-20
**Feature Branch**: feature/google-login
**Status**: Ready for Testing
