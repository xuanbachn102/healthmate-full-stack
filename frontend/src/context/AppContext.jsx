import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    const [profiles, setProfiles] = useState([])
    const [activeProfile, setActiveProfile] = useState(null)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting Profiles using API
    const loadProfiles = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/profile/list', { headers: { token } })

            if (data.success) {
                setProfiles(data.profiles)
                // Set active profile to default or first profile
                const defaultProfile = data.profiles.find(p => p.isDefault)
                if (defaultProfile) {
                    setActiveProfile(defaultProfile)
                } else if (data.profiles.length > 0) {
                    setActiveProfile(data.profiles[0])
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
            loadProfiles()
        } else {
            setProfiles([])
            setActiveProfile(null)
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        profiles, setProfiles, loadProfiles,
        activeProfile, setActiveProfile
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider