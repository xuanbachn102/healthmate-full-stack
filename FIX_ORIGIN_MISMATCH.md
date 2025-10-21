# 🔧 FIX: Error 400: origin_mismatch

## Checklist Fix - Làm theo thứ tự

### ✅ Bước 1: Verify Google Console Config

1. Vào https://console.cloud.google.com/apis/credentials
2. Chọn project HealthMate
3. Click vào OAuth client
4. **KIỂM TRA KỸ**:
   - Authorized JavaScript origins PHẢI có: `http://localhost:5173`
   - KHÔNG có dấu `/` cuối
   - Là `http` KHÔNG phải `https`
5. Nếu chưa đúng → Sửa lại → Click SAVE
6. **Đợi 2 phút** để Google update

---

### ✅ Bước 2: Clear Browser Cache

**Chrome:**
1. Mở DevTools: `Cmd+Option+I` (Mac) hoặc `F12` (Windows)
2. Click chuột phải vào nút Refresh
3. Chọn **"Empty Cache and Hard Reload"**

**Hoặc:**
1. `Cmd+Shift+Delete` (Mac) hoặc `Ctrl+Shift+Delete` (Windows)
2. Chọn **"Cached images and files"**
3. Time range: **"Last hour"**
4. Click **"Clear data"**

---

### ✅ Bước 3: Restart Frontend Server

```bash
# Stop frontend (Ctrl+C trong terminal)

# Clear npm cache
cd frontend
rm -rf node_modules/.vite

# Restart với port clean
npm run dev:safe
```

---

### ✅ Bước 4: Test trong Incognito Mode

1. Mở Incognito/Private window: `Cmd+Shift+N` (Mac) hoặc `Ctrl+Shift+N` (Windows)
2. Vào: http://localhost:5173/login
3. Click "Sign in with Google"

**Lý do**: Incognito không có cache, test clean hơn

---

### ✅ Bước 5: Kiểm tra .env file

```bash
cd frontend
cat .env
```

**Phải thấy:**
```
VITE_BACKEND_URL = 'http://localhost:4000'
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

**Kiểm tra:**
- [ ] Có dòng VITE_GOOGLE_CLIENT_ID
- [ ] Client ID đúng (check lại Google Console)
- [ ] KHÔNG có dấu ngoặc kép `' '` quanh Client ID
- [ ] KHÔNG có spaces thừa

**Nếu sai → Sửa lại → Lưu → Restart frontend**

---

### ✅ Bước 6: Verify Port đang chạy

```bash
lsof -i :5173
```

**Phải thấy:**
```
node    12345 admin   16u  IPv6  ...  TCP *:5173 (LISTEN)
```

**Nếu không thấy hoặc sai port:**
```bash
cd frontend
npm run dev:safe
```

---

### ✅ Bước 7: Kiểm tra Console Errors

1. Mở DevTools: F12
2. Tab **"Console"**
3. Click "Sign in with Google"
4. Xem error message

**Chụp screenshot error và gửi cho tôi**

---

### ✅ Bước 8: Thử thêm nhiều origins

Đôi khi Google cần cả 2 format. Vào Google Console → OAuth client → Thêm:

```
http://localhost:5173
http://127.0.0.1:5173
```

Click SAVE → Đợi 2 phút → Test lại

---

### ✅ Bước 9: Re-create OAuth Client (Last Resort)

Nếu tất cả đều fail, tạo OAuth client mới:

1. Google Console → Credentials
2. Click vào OAuth client cũ
3. Copy Client ID ra notepad (backup)
4. Quay lại → DELETE client cũ
5. CREATE CREDENTIALS → OAuth client ID
6. Application type: Web application
7. Name: HealthMate Web Client v2
8. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
9. CREATE
10. Copy Client ID mới
11. Update vào `frontend/.env`:
    ```
    VITE_GOOGLE_CLIENT_ID=new-client-id.apps.googleusercontent.com
    ```
12. Restart frontend
13. Test

---

## 🔍 Debug Info Tôi Cần

Nếu vẫn lỗi, gửi cho tôi:

### 1. Screenshot Google Console
Chụp màn hình phần "Authorized JavaScript origins"

### 2. File .env content
```bash
cd frontend
cat .env | grep GOOGLE
```
Copy output gửi cho tôi

### 3. Browser Console Error
F12 → Console tab → Screenshot error đỏ

### 4. Network Request
F12 → Network tab → Filter: "accounts.google"
Click "Sign in" → Chụp lại failed request

### 5. Current URL
Khi bị lỗi, copy URL từ address bar gửi cho tôi

---

## 🎯 Quick Test Commands

Chạy các lệnh này rồi gửi output:

```bash
# Check port
lsof -i :5173

# Check .env
cd /Users/admin/Desktop/healthmate-full-stack/frontend
cat .env

# Check if frontend is on right branch
cd /Users/admin/Desktop/healthmate-full-stack
git branch

# Check vite config
cat frontend/vite.config.js
```

---

## 💡 Common Mistakes

### ❌ SAI:
```
http://localhost:5173/
http://localhost:5173/login
https://localhost:5173
localhost:5173
http://localhost:5174
```

### ✅ ĐÚNG:
```
http://localhost:5173
```

---

## 🆘 Emergency Fix

Nếu tất cả fail, dùng cách này:

```bash
# 1. Stop everything
killall node

# 2. Clear all cache
cd /Users/admin/Desktop/healthmate-full-stack/frontend
rm -rf node_modules/.vite
rm -rf dist

# 3. Restart backend
cd ../backend
npm start &

# 4. Restart frontend
cd ../frontend
npm run dev:safe

# 5. Test trong Incognito mode
# Chrome → Cmd+Shift+N
# Vào: http://localhost:5173/login
```

---

Làm theo checklist từ Bước 1 → Bước 9, báo lại bước nào bị stuck nhé!
