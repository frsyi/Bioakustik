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
  date?: string
  startHour?: number
  endHour?: number
}) => {
  const { fetcher } = useAuth()

  const urlQuery = new URLSearchParams({
    ...(isFinite(query.page) &&
      query.page > 0 && { page: query.page.toString() }),
    ...(isFinite(query.take) ? { take: query.take.toString() } : { take: "6" }),
    ...(query.title && { title: query.title }),
    ...(query.date && { date: query.date }),
    ...(isFinite(query.startHour) && { startHour: query.startHour?.toString() }),
    ...(isFinite(query.endHour) && { endHour: query.endHour?.toString() }),
  })

  const url = `/audio?${urlQuery.toString()}`
  const swr = useSWR<Response>(
    url,
    (url: string) =>
      fetcher()
        .get(url)
        .then(({ data }) => data),
    { revalidateOnFocus: false }
  )

  const remove = async (id: string) => {
    await fetcher().delete(`/audio/${id}`)
    swr.mutate()
  }

  return {
    ...swr,
    remove,
  }
}

export default useAudioList