import useSWR from "swr"
import useAuth from "./useAuth"
import useUser from "./useUser"

const useUserRole = () => {
    const { fetcher } = useAuth()
    const { mutate } = useUser()
    
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
          })
          .catch((error) => {
            const msg = error.response?.data.message || error.message
          })
      }
      return { roles, changeRole }
}

export default useUserRole