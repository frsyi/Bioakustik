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

const useAudioList = (page: number = 1) => {
  const { fetcher } = useAuth()
  const url = `/audio?page=${page}&take=5`
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