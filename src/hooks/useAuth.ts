import axios from "axios"
import { useState } from "react"

const useAuth = () => {
    const tokenKey = "accessToken"
    const baseURL = process.env.BASE_URL || "http://localhost:3000/api"

    const getStore = (key: string) => {
        if (typeof window === "undefined") return null
        return localStorage.getItem(key)
    }

    const setStore = (key: string, value: string) => {
        if (typeof window === "undefined") return null
        localStorage.setItem(key, value)
    }

    const [accessToken, setAccessToken] = useState<string | null>(
        getStore(tokenKey)
    )

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(
                "/auth/login",
                { username, password },
                { baseURL }
            )
            const token = response.data.access_token
            setAccessToken(token)
            setStore(tokenKey, token)
        } catch (error) {
            console.error("Login failed:", error)
            logout()
            throw new Error("Invalid Username or Password.")
        }
    }

    const updateToken = (token: string) => {
        setAccessToken(token)
        setStore(tokenKey, token)
    }

    const logout = () => {
        setAccessToken(null)
        setStore(tokenKey, "")
    }

    const fetcher = () => {
        const instance = axios.create({
            baseURL,
            withCredentials: true,
        })
        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
        return instance
    }

    return { accessToken, login, logout, fetcher, updateToken }
}

export default useAuth
