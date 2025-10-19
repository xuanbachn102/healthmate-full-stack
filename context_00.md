# HealthMate - Context Documentation

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

### 3. Google Login Integration (Pending)
- OAuth 2.0 authentication
- One-click sign up/login
- Profile sync from Google account

### 4. Multilanguage Support (Pending)
- English (EN)
- Vietnamese (VI)
- i18n implementation
- Language switcher in UI

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
npm run dev
```

### Admin Panel
```bash
cd admin
npm install
npm run dev
```

## Testing Checklist

### User Profile Feature
- [ ] Register new user
- [ ] Login successfully
- [ ] View profile page
- [ ] Edit basic information (name, phone, address, gender, DOB)
- [ ] Upload profile image
- [ ] Select blood type
- [ ] Add symptoms (comma-separated)
- [ ] Add diseases (comma-separated)
- [ ] Add allergies (comma-separated)
- [ ] Add medications (comma-separated)
- [ ] Set emergency contact information
- [ ] Save all changes
- [ ] Verify data persists after reload

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

**Last Updated**: 2025-10-20
**Current Version**: Enhanced User Profile v1.0
**Next Feature**: Notification System
