import express from 'express';
import { loginUser, registerUser, googleLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentMoMo, verifyMoMo, checkMoMoPayment, analyzeSymptoms, chatWithBot } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/google-login", googleLogin)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)

// MoMo Payment
userRouter.post("/payment-momo", authUser, paymentMoMo)
userRouter.post("/verify-momo", verifyMoMo) // No auth - MoMo callback
userRouter.post("/check-momo-payment", authUser, checkMoMoPayment)

// AI Features
userRouter.post("/analyze-symptoms", authUser, analyzeSymptoms)
userRouter.post("/chat", authUser, chatWithBot)

export default userRouter;