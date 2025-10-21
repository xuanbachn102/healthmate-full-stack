# 🔧 Hướng dẫn Quản lý Port 5173

## ⚠️ Vấn đề: Port 5173 bị chiếm

Port 5173 là port mặc định của Vite (frontend HealthMate). Nếu bạn có app khác cũng dùng port này, sẽ bị conflict.

## ✅ Giải pháp - 3 cách

### Cách 1: Dùng `npm run dev:safe` (KHUYÊN DÙNG)

Script này tự động kill process cũ trên port 5173 trước khi start:

```bash
cd frontend
npm run dev:safe
```

**Output:**
```
🔍 Checking if port 5173 is in use...
⚠️  Port 5173 is being used by process 12345
🔫 Killing process...
✅ Successfully killed process on port 5173
🚀 Port 5173 is ready for HealthMate!

VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Cách 2: Kill port thủ công

Nếu chỉ muốn kill mà không start:

```bash
cd frontend
npm run kill-port
```

Hoặc dùng lệnh trực tiếp:

```bash
# Tìm process đang dùng port 5173
lsof -i :5173

# Kill process (thay PID bằng số thật)
kill -9 PID
```

**Ví dụ:**
```bash
$ lsof -i :5173
COMMAND   PID  USER   FD   TYPE    DEVICE SIZE/OFF NODE NAME
node    79819 admin   16u  IPv6  0x12345      0t0  TCP *:5173 (LISTEN)

$ kill -9 79819
```

### Cách 3: Đổi port của HealthMate (KHÔNG KHUYÊN)

Nếu muốn dùng port khác (ví dụ 5174):

1. Edit `frontend/vite.config.js`:
   ```js
   export default defineConfig({
     plugins: [react()],
     server: { port: 5174 }  // Đổi từ 5173 sang 5174
   })
   ```

2. **QUAN TRỌNG**: Phải update Google OAuth:
   - Vào Google Cloud Console
   - Credentials → Edit OAuth client
   - Authorized JavaScript origins: Thêm `http://localhost:5174`
   - Save

3. Start frontend:
   ```bash
   npm run dev
   # Sẽ chạy ở http://localhost:5174
   ```

## 🚫 Ngăn app khác dùng port 5173

### Option 1: Đổi port app kia

Nếu app khác cũng là Vite/React:
- Tìm file `vite.config.js` của app đó
- Đổi port thành số khác (5174, 3000, 8080, v.v.)

### Option 2: Luôn dùng `npm run dev:safe`

Để HealthMate luôn chiếm port 5173, **LUÔN LUÔN** dùng:
```bash
npm run dev:safe
```

Thay vì:
```bash
npm run dev  # ❌ Có thể bị conflict
```

### Option 3: Tạo alias trong shell

Thêm vào `~/.zshrc` hoặc `~/.bashrc`:

```bash
# Alias cho HealthMate
alias healthmate-dev='cd /Users/admin/Desktop/healthmate-full-stack/frontend && npm run dev:safe'
alias healthmate-kill='cd /Users/admin/Desktop/healthmate-full-stack/frontend && npm run kill-port'
```

Sau đó reload:
```bash
source ~/.zshrc
```

Dùng:
```bash
healthmate-dev    # Start HealthMate và auto-kill port
healthmate-kill   # Chỉ kill port 5173
```

## 📝 Scripts có sẵn

File `frontend/package.json` có các scripts:

```json
{
  "scripts": {
    "dev": "vite",                          // Start thông thường
    "dev:safe": "sh kill-port.sh && vite",  // Kill port trước khi start
    "kill-port": "sh kill-port.sh"          // Chỉ kill port
  }
}
```

File `frontend/kill-port.sh` - Script tự động kill port 5173:
- Tìm process đang dùng port
- Kill process đó
- Verify đã kill thành công
- Ready để start

## 🔍 Troubleshooting

### Lỗi: "Address already in use"

```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:**
```bash
cd frontend
npm run kill-port
npm run dev
```

Hoặc dùng luôn:
```bash
npm run dev:safe
```

### Lỗi: Script không chạy được

```
sh: kill-port.sh: Permission denied
```

**Fix:**
```bash
chmod +x frontend/kill-port.sh
```

### Lỗi: Không tìm thấy lsof

Trên macOS, `lsof` có sẵn. Nếu bị lỗi:
```bash
which lsof  # Should show: /usr/sbin/lsof
```

### Port vẫn bị chiếm sau khi kill

Đợi 1-2 giây rồi thử lại:
```bash
npm run kill-port
sleep 2
npm run dev
```

## ⚙️ How It Works

### Script `kill-port.sh`:

1. Dùng `lsof -ti :5173` để tìm PID của process đang LISTEN trên port 5173
2. Nếu tìm thấy → Kill bằng `kill -9 PID`
3. Verify port đã free
4. Ready để Vite start

### Script `dev:safe`:

1. Chạy `kill-port.sh` trước
2. Sau đó chạy `vite`
3. Đảm bảo 100% port 5173 free

## 🎯 Best Practices

### ✅ DO:
- Luôn dùng `npm run dev:safe` cho HealthMate
- Setup aliases để tiện
- Đổi port của app khác nếu có thể

### ❌ DON'T:
- Dùng `npm run dev` nếu biết port đang bị chiếm
- Force kill terminal mà không stop dev server đúng cách
- Chạy nhiều instance của cùng 1 app

## 📚 Related Files

- `frontend/kill-port.sh` - Script kill port
- `frontend/package.json` - NPM scripts
- `frontend/vite.config.js` - Vite config với port settings

## 🆘 Cần Giúp Đỡ?

Nếu vẫn gặp vấn đề:

1. Check port đang bị dùng bởi app nào:
   ```bash
   lsof -i :5173
   ```

2. Kill tất cả process Node:
   ```bash
   killall node  # ⚠️ Cẩn thận: Kill TẤT CẢ node processes
   ```

3. Restart terminal và thử lại

4. Worst case: Reboot máy

---

**Created**: 2025-10-20
**Feature Branch**: feature/google-login
**Status**: Port 5173 Management Solution
