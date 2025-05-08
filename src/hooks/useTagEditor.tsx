import {
  Alert,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import { createContext, useContext, useState } from "react"
import useSWR from "swr"
import useAuth from "./useAuth"
import { useTag } from "./useTag"

const ctx = createContext(null)

export const useTagEditor = () => {
  return useContext<{
    handleOpen: (props: EditorBody) => void
  }>(ctx)
}

type EditorBody = {
  id: string
  name: string
  color: string
  parentId: string | null
}

export const TagEditorProvider = ({ children }) => {
  const { mutate } = useTag()
  const defaultBody = { id: "", name: "", color: "#000000", parentId: "" }
  const [body, setBody] = useState<EditorBody>(defaultBody)

  const [error, setError] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { fetcher } = useAuth()
  const { data } = useSWR(body.id, async (id) => {
    if (id)
      return fetcher()
        .get<{ id: string; name: string; color: string }[]>(
          `/tag/${id}/possible-parent`
        )
        .then(({ data }) => data)
    return Promise.resolve([])
  })
  const tags = data?.length ? data : []

  const handleOpen = (props: EditorBody) => {
    setBody({ ...props })
    setError("")
    onOpen()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetcher()
      .patch(`/tag/${body.id}`, body)
      .then(() => {
        onClose()
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          return setError(err?.response?.data?.message)
        setError(err.message)
      })
      .finally(() => {
        mutate()
      })
  }

  return (
    <ctx.Provider value={{ handleOpen }}>
      {children}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Tag</ModalHeader>
          <ModalBody>
            {error && (
              <Alert status="error" my={4}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Flex flexDir="column" gap={3}>
                <FormControl>
                  <FormLabel>Parent</FormLabel>
                  <Select
                    value={body.parentId || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setBody({ ...body, parentId: null })
                        return
                      }
                      setBody({ ...body, parentId: e.target.value })
                    }}
                  >
                    <option value="">None</option>
                    {tags?.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter name tag"
                    value={body.name}
                    onChange={(e) => setBody({ ...body, name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input
                    type="color"
                    placeholder="Enter color"
                    value={body.color}
                    width="50px"
                    aspectRatio={1}
                    border="none"
                    borderRadius="50%"
                    p={0}
                    cursor="pointer"
                    onChange={(e) => setBody({ ...body, color: e.target.value })}
                  />
                </FormControl>
                <Button
                  type="submit"
                  bgColor={"purple"}
                  color="white"
                  _hover={{ opacity: 0.8 }}
                >
                  Save
                </Button>
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button 
              w="full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ctx.Provider>
  )
}
