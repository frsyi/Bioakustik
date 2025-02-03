import { useRouter } from "next/router"
import useSWR from "swr"
import useAuth from "./useAuth"

const useAudioTitle = () => {
  const router = useRouter()
  const { fetcher } = useAuth()
  const { data, error } = useSWR("/audio/title", (url) =>
    fetcher()
      .get<string[]>(url)
      .then(({ data }) => data)
  )

  const title = (router.query?.title as string) || ""
  const setTitle = (title: string) => {
    const { title: _, ...query } = router.query
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        ...(title && { title }),
      },
    })
  }

  console.log("title", title)
  return {
    title,
    titleList: data?.length ? data : [],
    setTitle,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useAudioTitle
