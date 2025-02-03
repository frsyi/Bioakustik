import { createContext, useContext, useState } from "react"
import useSWR from "swr"
import useAuth from "./useAuth"

export type Tag = {
  id: string
  name: string
  color: string
}

export type TagResponse = Tag & {
  Child: Tag[]
  locked: boolean
  parentId: string | null
}

const ctx = createContext<{
  tags: TagResponse[]
  create: (tag: Omit<Tag, "id"> & { parentId?: string }) => Promise<void>
  mutate: () => void
  singleTag: (id: string) => TagResponse
  lastUpdate: number
  remove: (id: string) => Promise<void>
  setLocked: (id: string, locked: boolean) => Promise<void>
}>(null)

export const useTag = () => useContext(ctx)

export const TagProvider = ({
  children,
  parentId,
}: {
  children: React.ReactNode
  parentId?: string
}) => {
  const { fetcher } = useAuth()
  const [lastUpdate, setLastUpdate] = useState(0)

  const { data: tags, mutate } = useSWR("/tag", (url: string) =>
    fetcher()
      .get<TagResponse[]>(url, {
        params: {
          ...(parentId && { parentId }),
        },
      })
      .then(({ data }) => data)
  )

  const handleMutate = () => {
    setLastUpdate(Date.now())
    mutate()
  }

  const singleTag = (id: string) => {
    const { data } = useSWR(
      [`/tag/${id}`, lastUpdate] as [string, number],
      ([url, _]) =>
        fetcher()
          .get<TagResponse>(url)
          .then(({ data }) => data)
    )
    return data
  }

  const create = async (tag: Tag & { parentId?: string }) => {
    await fetcher().post("/tag", tag)
    handleMutate()
  }

  const remove = async (id: string) => {
    await fetcher().delete(`/tag`, { data: { id } })
    handleMutate()
  }

  const setLocked = async (id: string, locked: boolean) => {
    const url = locked ? `/tag/${id}/lock` : `/tag/${id}/unlock`
    return fetcher()
      .post(url)
      .then(() => handleMutate())
      .catch(console.error)
  }

  return (
    <ctx.Provider
      value={{
        tags: tags?.length ? tags : [],
        create,
        mutate: handleMutate,
        singleTag,
        lastUpdate,
        remove,
        setLocked,
      }}
    >
      {children}
    </ctx.Provider>
  )
}
