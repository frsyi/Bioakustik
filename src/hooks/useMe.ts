import useSWR from "swr"
import useAuth from "./useAuth"

export type Me = {
  id: string
  name: string
  username: string
  role: "ADMIN" | "USER"
}

const useMe = () => {
  const { fetcher } = useAuth()
  const url = `/auth/me`
  return useSWR(url, (url: string) =>
    fetcher()
      .get<{ data: Me }>(url)
      .then(({ data }) => data.data)
  )
}

export default useMe