import useSWR from "swr"
import useAuth from "./useAuth"
import useCustomToast from "./useCustomToast"
import useUser from "./useUser"

const useUserRole = () => {
  const { fetcher } = useAuth()
  const { mutate } = useUser()

  const toast = useCustomToast()

  const { data: roles } = useSWR("/user/roles", async (url) =>
    fetcher()
      .get<{ [key: string]: string }>(url)
      .then((res) => res.data)
  )

  const changeRole = async (id: string, role: string) => {
    await fetcher()
      .patch(`/user/change-role`, { userId: id, role })
      .then(() => {
        mutate()
        toast({
          title: "Role changed",
          description: `User's role has been changed to ${role}`,
          status: "success",
        })
      })
      .catch((error) => {
        const msg = error.response?.data.message || error.message
        toast({
          title: "Failed to change role",
          description: msg,
          status: "error",
        })
      })
  }
  return { roles, changeRole }
}

export default useUserRole