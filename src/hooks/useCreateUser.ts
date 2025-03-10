import { AxiosError } from "axios"
import { useState } from "react"
import useAuth from "./useAuth"
import useUser from "./useUser"
import useCustomToast from "./useCustomToast"

const useCreateUser = () => {
    const { fetcher } = useAuth()
    const [body, setBody] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { mutate } = useUser()
    const toast = useCustomToast()

    const handleChange = (
        key: "username" | "password" | "name" | "confirmPassword",
        value: string
    ) => {
        setBody((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSubmit = async (onSuccess?: () => void) => {
        setLoading(true)
        setError("")

        if (body.password !== body.confirmPassword) {
            setError("Password and Confirm Password do not match.")
            setLoading(false)
            return false
        }

        try {
            const payload = {
                name: body.name,
                username: body.username,
                password: body.password,
            }
            await fetcher().post("/user", payload)
            mutate();
            setBody({
                name: "",
                username: "",
                password: "",
                confirmPassword: "",
            })
            toast({
                title: "User created",
                description: `User has been created successfully`,
                status: "success",
            })
            if (onSuccess) onSuccess()
            return true
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data.message || error.message)
                return false
            }
            setError(error.message)
            return false
        } finally {
            setLoading(false)
            return false
        }
    }

    const init = () => {
        setError("")
        setBody({
            name: "",
            username: "",
            password: "",
            confirmPassword: "",
        })
    }

    const remove = async (id: string) => {
        setLoading(true)
        setError("")
        try {
            await fetcher().delete(`/user/${id}`)
            mutate()
            toast({
                title: "User deleted",
                description: `User has been deleted successfully`,
                status: "success",
            })
            return true
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data.message || error.message)
                return false
            }
            setError(error.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        body,
        error,
        loading,
        handleChange,
        handleSubmit,
        init,
        remove,
    }
}

export default useCreateUser
