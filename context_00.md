# HealthMate - Context Documentation

### Git Commit Guidelines
⚠️ **IMPORTANT**:
- KHÔNG BAO GIỜ đề cập đến AI, chatbot tools, hoặc code generators trong commit messages
- Commit messages phải như được viết bởi developer thực
- Focus vào technical changes và business value
- Sử dụng conventional commits format

**Good Examples:**
```
feat: Add blood type and health history to user profile

- Added blood type selection with standard types
- Implemented symptoms and disease tracking
- Created emergency contact fields
- Updated backend API to handle health data
```

```
fix: Resolve profile image upload issue

- Fixed Cloudinary upload timeout
- Added proper error handling
- Improved image compression
```

**Bad Examples (DON'T DO THIS):**
```
❌ AI-generated profile enhancement
❌ Used Claude to add features
❌ ChatGPT helped implement this
```

## Project Overview
HealthMate là một ứng dụng quản lý sức khỏe full-stack cho phép người dùng đặt lịch hẹn với bác sĩ, quản lý hồ sơ sức khỏe cá nhân và theo dõi các cuộc hẹn y tế.

## Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Payment Gateways**:
  - Razorpay
  - Stripe
- **Validation**: validator library

### Frontend
- **Framework**: React
- **State Management**: Context API (AppContext)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Notifications**: React Toastify
- **Routing**: React Router

### Admin Panel
- Separate admin interface for managing doctors and appointments

## Project Structure

```
healthmate-full-stack/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── doctorModel.js
│   │   └── appointmentModel.js
│   ├── middleware/
│   │   └── authUser.js
│   └── routes/
│       └── userRoute.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       │   └── AppContext.jsx
│       └── pages/
│           ├── Login.jsx
│           └── MyProfile.jsx
└── admin/
```

## Current Features

### User Management
- User registration with email/password
- Login authentication with JWT
- Profile management with image upload
- Personal information (name, email, phone, address, gender, DOB)

### Appointment System
- Book appointments with doctors
- View appointment history
- Cancel appointments
- Payment integration (Razorpay & Stripe)

### Enhanced User Profile (Latest Addition)
Người dùng có thể lưu thông tin sức khỏe quan trọng:

**Health Information Fields:**
- **Blood Type**: A+, A-, B+, B-, AB+, AB-, O+, O-, Not Specified
- **Symptoms**: Danh sách các triệu chứng hiện tại
- **Diseases**: Lịch sử bệnh lý
- **Allergies**: Danh sách dị ứng
- **Medications**: Thuốc đang sử dụng

**Emergency Contact:**
- Name: Tên người liên hệ khẩn cấp
- Phone: Số điện thoại
- Relationship: Mối quan hệ

## API Endpoints

### Authentication (Public)
- `POST /api/user/register` - Đăng ký tài khoản mới
- `POST /api/user/login` - Đăng nhập
- `POST /api/user/google-login` - Đăng nhập với Google OAuth

### User Profile (Protected - requires JWT token)
- `GET /api/user/get-profile` - Lấy thông tin profile
- `POST /api/user/update-profile` - Cập nhật profile + health information

### Appointments (Protected)
- `POST /api/user/book-appointment` - Đặt lịch hẹn
- `GET /api/user/appointments` - Xem danh sách lịch hẹn
- `POST /api/user/cancel-appointment` - Hủy lịch hẹn

### Payments (Protected)
- `POST /api/user/payment-razorpay` - Thanh toán qua Razorpay
- `POST /api/user/verifyRazorpay` - Xác nhận thanh toán Razorpay
- `POST /api/user/payment-stripe` - Thanh toán qua Stripe
- `POST /api/user/verifyStripe` - Xác nhận thanh toán Stripe

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  googleId: String (unique, sparse - for Google OAuth users),
  image: String (default: base64 profile picture),
  phone: String (default: '000000000'),
  address: { line1: String, line2: String },
  gender: String (default: 'Not Selected'),
  dob: String (default: 'Not Selected'),

  // Health Information
  bloodType: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not Specified']),
  symptoms: [String],
  diseases: [String],
  allergies: [String],
  medications: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}
```

## Planned Features (Roadmap)

### 1. Enhanced User Profile ✅ COMPLETED
- Blood type, symptoms, diseases tracking
- Allergies and medications list
- Emergency contact information

### 2. Notification System (Pending)
**Purpose Ideas:**
- Appointment reminders (before 24h, 1h)
- Medication reminders
- Doctor availability alerts
- Payment confirmations
- System announcements

### 3. Google Login Integration ✅ COMPLETED & TESTED
OAuth 2.0 authentication cho đăng nhập nhanh:

**Features:**
- One-click sign up/login với Google account
- Auto-create user từ Google profile
- Link existing accounts by email
- Profile picture từ Google
- Không cần password cho Google users

**Implementation:**
- Frontend: @react-oauth/google package
- GoogleOAuthProvider wrapper trong main.jsx
- GoogleLogin button trong Login page với divider "OR"
- JWT decode để extract user info (email, name, sub, picture)
- Backend: googleLogin controller trong userController.js
- User model có googleId field (unique, sparse)
- Route: POST /api/user/google-login

**Setup Required:**
- Google Cloud Console project
- Enable People API (hoặc Google+ API)
- Create OAuth 2.0 credentials
- Add authorized origins: http://localhost:5173 (và http://localhost:5174 nếu cần)
- Set VITE_GOOGLE_CLIENT_ID trong frontend/.env

**Troubleshooting:**
- Port conflicts: Sử dụng `npm run dev:safe` để tự động kill port 5173
- Vite strictPort: Config để không auto-switch sang port khác
- origin_mismatch error: Kiểm tra authorized origins trong Google Console
- Backend restart: Luôn restart backend sau khi thêm routes mới

**Documentation:**
- GOOGLE_OAUTH_SETUP.md - Hướng dẫn chi tiết 7 bước
- GOOGLE_SETUP_SIMPLE.md - Hướng dẫn đơn giản bằng tiếng Việt
- GOOGLE_QUICK_GUIDE.txt - Quick reference
- FIX_ORIGIN_MISMATCH.md - Troubleshooting guide
- PORT_5173_GUIDE.md - Port management guide

**Branch**: feature/google-login
**Status**: ✅ TESTED & WORKING - Ready to merge

### 4. Multilanguage Support ✅ COMPLETED
**Features:**
- English (EN) and Vietnamese (VI) translations
- i18next implementation with react-i18next
- Language switcher in navigation bar with flags
- All pages translated: Home, Doctors, About, Contact, Profile, Appointments
- Language persistence in localStorage
- Dynamic content support with interpolation (e.g., copyright year)
- Localized address for Vietnam office

**Implementation:**
- Frontend: i18next, react-i18next packages
- Translation files: frontend/src/i18n/locales/{en,vi}.json
- i18n config: frontend/src/i18n/i18n.js
- Language switcher component with EN/VN flags
- useTranslation hook in all components

**Branch**: feature/multilanguage
**Status**: ✅ MERGED TO MAIN

### 5. Dark Mode (Pending)
- Toggle between light/dark themes
- User preference persistence
- Tailwind dark mode classes

### 6. AI Chatbot Integration (Pending)
**Potential Use Cases:**
- Health consultation assistant
- Symptom checker
- Medication information
- Appointment booking assistance
- FAQs about common health issues
- Doctor recommendation based on symptoms

## Development Workflow

### Branch Strategy
Mỗi feature được phát triển trên branch riêng:
- `feature/enhanced-user-profile` - User profile với health info
- `feature/notification-system` - Hệ thống thông báo
- `feature/google-login` - Đăng nhập Google
- `feature/multilanguage` - Hỗ trợ đa ngôn ngữ
- `feature/dark-mode` - Chế độ tối
- `feature/ai-chatbot` - Tích hợp chatbot AI

## Environment Variables

### Backend (.env)
```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_SECRET_KEY=<cloudinary_secret_key>
RAZORPAY_KEY_ID=<razorpay_key_id>
RAZORPAY_KEY_SECRET=<razorpay_key_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>
CURRENCY=USD
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
VITE_RAZORPAY_KEY_ID=<razorpay_key_id>
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # Chạy bình thường
npm run dev:safe   # Tự động kill port 5173 trước khi chạy
npm run kill-port  # Chỉ kill port 5173
```

### Admin Panel
```bash
cd admin
npm install
npm run dev
```

## Testing Checklist

### User Profile Feature ✅

- [x] Register new user
- [x] Login successfully
- [x] View profile page
- [x] Edit basic information (name, phone, address, gender, DOB)
- [x] Upload profile image
- [x] Select blood type
- [x] Add symptoms (comma-separated)
- [x] Add diseases (comma-separated)
- [x] Add allergies (comma-separated)
- [x] Add medications (comma-separated)
- [x] Set emergency contact information
- [x] Save all changes
- [x] Verify data persists after reload

### Google Login Feature ✅

- [x] Setup Google Cloud Console project
- [x] Enable People API
- [x] Create OAuth 2.0 credentials
- [x] Configure authorized JavaScript origins
- [x] Add VITE_GOOGLE_CLIENT_ID to .env
- [x] Click "Sign in with Google" button
- [x] Select Google account
- [x] Successfully login with new Google user (auto-create account)
- [x] Successfully login with existing user
- [x] Profile picture synced from Google
- [x] JWT token stored and user redirected
- [x] Backend endpoint working correctly

## Known Issues & Technical Debt
- None currently

## Notes for Future Development

### Notification System Considerations
- Use Socket.io for real-time notifications
- Store notifications in database
- Implement notification preferences
- Add email/SMS integration options

### Google Login Integration
- Need to register OAuth app with Google
- Implement passport.js or next-auth
- Handle profile merging for existing users

### Multilanguage Implementation
- Use i18next library
- Create translation files for EN and VI
- Implement language detection
- Store user language preference

### Dark Mode
- Use Tailwind's dark mode feature
- Store preference in localStorage
- Add smooth theme transition
- Test color contrast for accessibility

### AI Chatbot
- Consider OpenAI API, Google Dialogflow, or local models
- Implement rate limiting
- Add disclaimer for medical advice
- Store chat history for context
- HIPAA/privacy considerations for health data

## Contact & Support
- Developer: [Your contact info]
- Repository: [Git repository URL]
- Documentation: This file (context_00.md)

---

**Last Updated**: 2025-10-22
**Current Version**: v3.0 - Enhanced User Profile + Google Login + Multilanguage Support
**Next Feature**: Notification System or Dark Mode
