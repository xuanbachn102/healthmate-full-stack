import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import { analyzeSymptoms as analyzeSymptomAI, chatWithBot as chatWithBotAI } from '../services/aiService.js';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to handle Google OAuth login
const googleLogin = async (req, res) => {
    try {
        const { email, name, googleId, image } = req.body;

        if (!email || !name || !googleId) {
            return res.json({ success: false, message: 'Missing Google account details' })
        }

        // Check if user already exists
        let user = await userModel.findOne({ email })

        if (user) {
            // User exists, update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId
                await user.save()
            }
        } else {
            // Create new user with Google account
            const userData = {
                name,
                email,
                googleId,
                image: image || user?.image,
                password: await bcrypt.hash(googleId + process.env.JWT_SECRET, 10) // Random password for Google users
            }

            user = new userModel(userData)
            await user.save()
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender, bloodType, symptoms, diseases, allergies, medications, emergencyContact } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Prepare update data
        const updateData = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        }

        // Add health information if provided
        if (bloodType) updateData.bloodType = bloodType
        if (symptoms) updateData.symptoms = JSON.parse(symptoms)
        if (diseases) updateData.diseases = JSON.parse(diseases)
        if (allergies) updateData.allergies = JSON.parse(allergies)
        if (medications) updateData.medications = JSON.parse(medications)
        if (emergencyContact) updateData.emergencyContact = JSON.parse(emergencyContact)

        await userModel.findByIdAndUpdate(userId, updateData)

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to analyze symptoms using AI
const analyzeSymptoms = async (req, res) => {
    try {
        const { userId, symptoms, duration, severity, age, gender } = req.body

        if (!symptoms) {
            return res.json({ success: false, message: 'Please provide symptoms' })
        }

        // Check rate limiting - get user's symptom checks today
        const user = await userModel.findById(userId)
        const today = new Date().setHours(0, 0, 0, 0)

        // Initialize symptomChecks if not exists
        if (!user.symptomChecks) {
            user.symptomChecks = { count: 0, lastReset: new Date() }
        }

        // Reset counter if it's a new day
        const lastReset = new Date(user.symptomChecks.lastReset).setHours(0, 0, 0, 0)
        if (lastReset < today) {
            user.symptomChecks = { count: 0, lastReset: new Date() }
        }

        // Check if user has exceeded daily limit (20 checks per day)
        if (user.symptomChecks.count >= 20) {
            return res.json({
                success: false,
                message: 'Daily symptom check limit reached. Please try again tomorrow.',
                remainingChecks: 0
            })
        }

        // Call AI service
        const result = await analyzeSymptomAI({
            symptoms,
            duration,
            severity,
            age: age || user.dob,
            gender: gender || user.gender
        })

        if (!result.success) {
            return res.json(result)
        }

        // Increment symptom check counter
        user.symptomChecks.count += 1
        await user.save()

        // Optionally save analysis to user history
        const analysisHistory = {
            symptoms,
            duration,
            severity,
            result: result.data,
            date: new Date()
        }

        // Add to user's symptom analysis history
        if (!user.symptomAnalysisHistory) {
            user.symptomAnalysisHistory = []
        }
        user.symptomAnalysisHistory.push(analysisHistory)
        await user.save()

        res.json({
            success: true,
            data: result.data,
            remainingChecks: 20 - user.symptomChecks.count
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to chat with health assistant bot
const chatWithBot = async (req, res) => {
    try {
        const { userId, message, chatHistory } = req.body

        if (!message) {
            return res.json({ success: false, message: 'Please provide a message' })
        }

        // Get user profile for context
        const user = await userModel.findById(userId).select('-password')

        // Check rate limiting - 50 messages per day
        const today = new Date().setHours(0, 0, 0, 0)

        // Initialize chatMessages if not exists
        if (!user.chatMessages) {
            user.chatMessages = { count: 0, lastReset: new Date() }
        }

        // Reset counter if it's a new day
        const lastReset = new Date(user.chatMessages.lastReset).setHours(0, 0, 0, 0)
        if (lastReset < today) {
            user.chatMessages = { count: 0, lastReset: new Date() }
        }

        // Check if user has exceeded daily limit
        if (user.chatMessages.count >= 50) {
            return res.json({
                success: false,
                message: 'Daily chat limit reached. Please try again tomorrow.',
                remainingMessages: 0
            })
        }

        // Prepare user profile for AI context
        const userProfile = {
            allergies: user.allergies,
            medications: user.medications,
            diseases: user.diseases,
            bloodType: user.bloodType
        }

        // Call AI service
        const result = await chatWithBotAI({
            message,
            chatHistory: chatHistory || [],
            userProfile
        })

        if (!result.success) {
            return res.json(result)
        }

        // Increment chat message counter
        user.chatMessages.count += 1
        await user.save()

        res.json({
            success: true,
            data: result.data,
            remainingMessages: 50 - user.chatMessages.count
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    googleLogin,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    analyzeSymptoms,
    chatWithBot
}