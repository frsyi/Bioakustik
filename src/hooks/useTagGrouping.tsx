import useSWR from "swr"
import useAuth from "./useAuth"

export const useTagGrouping = () => {
  const { fetcher } = useAuth()
  return useSWR("/segment/grouped-by-time", async (url) => {
    return fetcher().get(url).then((res) => res.data)
  })
}