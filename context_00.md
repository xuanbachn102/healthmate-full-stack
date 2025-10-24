# HealthMate - Context Documentation

⚠️ **CRITICAL**:
- KHÔNG ĐƯỢC COMMIT FILE NÀY - FILE LOCAL CHỈ DÀNH CHO CLAUDE
- Commit messages KHÔNG được đề cập AI, chatbot, code generators
- Format: conventional commits (feat/fix/chore/docs)

---

## Tech Stack

### Backend
- Node.js + Express.js + MongoDB (Mongoose)
- JWT authentication + bcrypt
- Cloudinary (images), Multer (upload)
- **Payment**: MoMo (Vietnam, test mode)
- **AI**: Google Gemini 2.5 Flash (API v1beta)
- **RSS**: rss-parser (health news)

### Frontend
- React + Vite + TailwindCSS
- React Router DOM, Axios
- i18next (EN/VI multilanguage)
- react-toastify (notifications)
- Dark mode support

---

## Core Features (Completed ✅)

### 1. Authentication
- Email/Password + Google OAuth 2.0
- JWT tokens, protected routes
- Files: `authContext.js`, `Login.jsx`

### 2. User Profile + Health Records
- Personal info: name, phone, address, DOB, gender, **ethnicity**, **occupation**
- Health: blood type, symptoms, diseases, allergies, medications
- Emergency contact, profile image upload
- Files: `userModel.js`, `MyProfile.jsx`

### 3. AI Health Assistant (Gemini 2.5 Flash)
- **Chatbot**: Health Q&A with user profile context, structured responses (YouMed-style)
- **Symptom Checker**: Analyze symptoms → recommend specialty, emergency detection
- **Enhanced Prompts**: Detailed responses with causes, treatments, medical info
- Emergency: 115 (Vietnam), Vietnamese-friendly warnings
- Files: `aiService.js`, `ChatWidget.jsx`, `SymptomChecker.jsx`

### 4. Doctor Appointment System
- Browse doctors by specialty
- Book/view/cancel appointments
- Files: `doctorModel.js`, `Doctors.jsx`, `MyAppointments.jsx`

### 5. Payment Integration
- **MoMo**: HMAC-SHA256 signatures, IPN/return URL handling
- Test mode (requires business account for production)
- Files: `momoService.js`, `paymentController.js`

### 6. Health News (RSS Feeds - Vietnamese)
- Sources: VnExpress, SKĐS, Dân trí, Tuổi Trẻ
- Filter by source, real-time updates
- Files: `newsService.js`, `HealthNews.jsx`

### 7. Multilanguage (i18next)
- English + Vietnamese
- Files: `en.json`, `vi.json`

### 8. Dark Mode
- Toggle with localStorage persistence
- Files: `ThemeContext.js`, `ThemeToggle.jsx`

---

## Project Structure

```
healthmate-full-stack/
├── backend/
│   ├── config/         # mongodb.js, cloudinary.js
│   ├── controllers/    # userController, doctorController, adminController, newsController
│   ├── middlewares/    # authUser.js, authAdmin.js, authDoctor.js, multer.js
│   ├── models/         # userModel, doctorModel, appointmentModel
│   ├── routes/         # userRoute, doctorRoute, adminRoute, newsRoutes
│   ├── services/       # aiService.js, momoService.js, newsService.js
│   ├── server.js       # Main entry
│   └── .env            # MONGODB_URI, JWT_SECRET, CLOUDINARY_*, GEMINI_API_KEY, MOMO_*
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/  # Navbar, Footer, ChatWidget, ThemeToggle, LanguageSwitcher
    │   ├── context/     # AppContext, ThemeContext
    │   ├── i18n/        # locales/en.json, vi.json
    │   ├── pages/       # Home, Login, Doctors, MyProfile, SymptomChecker, HealthNews, etc.
    │   ├── App.jsx
    │   └── main.jsx
    └── .env             # VITE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID
```

---

## Environment Variables

### Backend `.env`
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...
GEMINI_API_KEY=...          # Google AI Studio
MOMO_PARTNER_CODE=...       # MoMo business.momo.vn
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

### Frontend `.env`
```bash
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=...   # Google Cloud Console
```

---

## API Endpoints

### User
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Email/password login
- `POST /api/user/google-login` - Google OAuth login
- `GET /api/user/profile` - Get user profile (auth required)
- `POST /api/user/update-profile` - Update profile + health info (auth required)

### Doctor
- `GET /api/doctor/list` - List all doctors
- `POST /api/user/book-appointment` - Book appointment (auth required)
- `GET /api/user/appointments` - User's appointments (auth required)
- `POST /api/user/cancel-appointment` - Cancel appointment (auth required)

### AI Services
- `POST /api/user/chat` - Chatbot conversation (auth optional)
- `POST /api/user/analyze-symptoms` - Symptom checker (auth optional)

### Payment
- `POST /api/user/payment-momo` - Create MoMo payment request
- `POST /api/user/momo-ipn` - MoMo IPN callback
- `POST /api/user/momo-return` - MoMo return URL handler

### Health News
- `GET /api/news` - Get all news (query: `?limit=20`)
- `GET /api/news/sources` - List available sources
- `GET /api/news/source/:sourceName` - Filter by source

---

## Important Implementation Details

### 1. Google OAuth Flow
```javascript
// Frontend: Login.jsx
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
</GoogleOAuthProvider>

// Backend: authUser.js middleware
// Verifies JWT token from headers: { token: "Bearer <jwt>" }
```

### 2. Gemini AI Integration
```javascript
// backend/services/aiService.js
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

// Chatbot: Structured responses with medical context
// Symptom Checker: JSON response with specialty, causes, treatments
```

### 3. MoMo Payment
```javascript
// HMAC-SHA256 signature
var signature = crypto
  .createHmac('sha256', secretKey)
  .update(rawSignature)
  .digest('hex');

// IPN handling for payment confirmation
// Return URL for redirecting user after payment
```

### 4. RSS News Parsing
```javascript
// backend/services/newsService.js
const parser = new Parser({ customFields: { item: ['media:content', 'description'] }});
const feed = await parser.parseURL(rssUrl);
// Extract images, clean HTML, sort by date
```

### 5. Dark Mode Implementation
```javascript
// frontend/src/context/ThemeContext.js
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

// Tailwind: dark:bg-gray-900, dark:text-white
```

---

## Recent Updates

### v2.5.0 (Latest - Oct 24, 2025)
- ✅ **Health News**: RSS feeds from 4 Vietnamese sources (VnExpress, SKĐS, Dân trí, Tuổi Trẻ)
- ✅ **AI Enhancement**: YouMed-style responses with structured format
  - Chatbot: Greeting with user name, detailed sections
  - Symptom Checker: Causes, related conditions, medical info, immediate actions
- ✅ **Profile Enhancement**: Added ethnicity and occupation fields
- ✅ **Emergency Localization**: Changed 911 → 115 (Vietnam)
- ✅ **Dark Mode Fixes**: Edit button visibility in MyProfile

### v2.0.0 (Oct 23, 2025)
- ✅ Google OAuth Login
- ✅ MoMo Payment Integration (replaced Stripe/Razorpay)
- ✅ Multilanguage support (EN/VI)
- ✅ Dark mode

### v1.0.0 (Initial)
- Basic appointment booking system
- User authentication (email/password)
- Profile management

---

## Development Commands

```bash
# Backend
cd backend
npm install
npm start          # Port 4000

# Frontend
cd frontend
npm install
npm run dev        # Port 5173
```

---

## Git Workflow

```bash
# Feature development
git checkout -b feature/feature-name
# Make changes, commit frequently
git add .
git commit -m "feat: Add feature description"

# When done
git checkout main
git merge feature/feature-name
git branch -d feature/feature-name
```

---

## Known Issues & Limitations

1. **MoMo Payment**: Requires business account for production, currently test mode
2. **Google OAuth**: Redirect URI must match exactly (http://localhost:5173)
3. **Gemini API**: Free tier limits (60 req/min, 1500 req/day)
4. **RSS Feeds**: No control over source uptime, fallback to cached data recommended
5. **Image Upload**: 10MB limit on Cloudinary free tier

---

## Future Enhancements (Thesis Scope)

### Phase 1: Core Features (Should implement)
1. **Multiple Profiles (Family Accounts)**
   - One account manages multiple health profiles
   - Add CCCD/BHYT fields (text input only)

2. **Hospital/Doctor Directory**
   - Static database of 50-100 Vietnamese hospitals
   - Doctor profiles with specialties
   - Maps integration (Google Maps API)
   - Favorite doctors

3. **Mock Appointment System**
   - Book appointments (mock, not real hospital integration)
   - Appointment history and reminders
   - Cancellation with confirmation dialog

4. **Medical Records Upload**
   - Upload prescriptions, test results
   - Gallery view by profile

### Phase 2: Nice to Have (Optional)
5. **Online Pharmacy Catalog** (UI only, no checkout)
6. **Telemedicine** (requires partnerships)

### NOT for Thesis (Too complex)
- ❌ Real hospital API integration
- ❌ eKYC CCCD scanning
- ❌ NFC chip reading
- ❌ Payment gateway production

---

## Security Notes

- JWT tokens stored in localStorage
- Passwords hashed with bcrypt (10 rounds)
- Protected routes require authentication middleware
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data
- HTTPS recommended for production

---

## Deployment Checklist (When ready)

- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origins to production domain
- [ ] Configure production MongoDB cluster
- [ ] Update Google OAuth redirect URIs
- [ ] Configure MoMo business account
- [ ] Enable Cloudinary signed uploads
- [ ] Add rate limiting middleware
- [ ] Set up monitoring (errors, API usage)
- [ ] Configure CDN for static assets

---

**Last Updated**: October 24, 2025
**Current Branch**: feature/health-news
**Status**: Ready for merge
