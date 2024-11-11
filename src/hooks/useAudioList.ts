import useSWR from "swr"
import useAuth from "./useAuth"

export interface Response {
  data: AudioItem[]
  totalPage: number
  currentPage: number
  count: number
}

export interface AudioItem {
  id: string
  title: string
  description: string
  url: string
  createdAt: string
  userId: string
  user: User

  Spectrogram?: {
    imageUrl: string
  }
}

export interface User {
  id: string
  name: string
  username: string
}

const useAudioList = (query: {
  page: number
  take?: number
  title?: string
}) => {
  const { fetcher } = useAuth()

  const urlQuery = new URLSearchParams({
    ...(isFinite(query.page) &&
      query.page > 0 && { page: query.page.toString() }),
    ...(isFinite(query.take) ? { take: query.take.toString() } : { take: "5" }),
    ...(query.title && { title: query.title }),
  })

  const url = `/audio?${urlQuery.toString()}`
  return useSWR<Response>(
    url,
    (url: string) =>
      fetcher()
        .get(url)
        .then(({ data }) => data),
    { revalidateOnFocus: false }
  )
}

export default useAudioList