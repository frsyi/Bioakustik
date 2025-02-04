import useSWR from "swr"
import useAuth from "./useAuth"

export type User = {
    id: string
    name: string
    username: string
    role: string
    _count: {
        Audio: number
    }
}

const useUser = () => {
    const { fetcher } = useAuth()
    const url = `/user`
    const { data, ...swr } = useSWR(url, (url: string) =>
        fetcher()
            .get<{ data: User[] }>(url)
            .then(({ data }) => data.data)
    )
    return {
        data: data || [],
        ...swr,
    }
}

export default useUser