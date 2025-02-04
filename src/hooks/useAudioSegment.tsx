import {
    Alert,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    useDisclosure,
} from "@chakra-ui/react"
import { createContext, useContext, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import useAuth from "./useAuth"
import { useConfirm } from "./useConfirm"
import useCustomToast from "./useCustomToast"
import { TagResponse } from "./useTag"
  
export type CreateSegmentDto = {
    startTime: number
    endTime: number
    audioId: string
    tagId: string
}
  
export type SegmentResponse = {
    id: string
    startTime: number
    endTime: number
    tag: TagResponse
}
  
const ctx = createContext<{
    tags: TagResponse[]
    createSegment: (body: Omit<CreateSegmentDto, "tagId">) => void
    useSegment: (audioId: string) => SWRResponse<SegmentResponse[], any>
    removeSegment: (id: string) => void
}>(null)
  
export const useAudioSegment = () => {
    return useContext(ctx)
}
  
export const AudioSegmentProvider = ({ children }) => {
    const { fetcher } = useAuth()
    const defaultBody = {
      startTime: 0,
      endTime: 0,
      audioId: "",
      tagId: "",
    }
  
    const [lastUpdate, setLastUpdate] = useState(0)
    const [body, setBody] = useState<CreateSegmentDto>(defaultBody)
    const [error, setError] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useCustomToast()
    const { confirm } = useConfirm()
  
    const { data: tags } = useSWR("/tag", async (url) => {
      return fetcher()
        .get<TagResponse[]>(url)
        .then((res) => res.data)
    })
  
    const createSegment = async (body: Omit<CreateSegmentDto, "tagId">) => {
      setError(null)
      setBody({ ...defaultBody, ...body })
      onOpen()
    }
  
    const handleSubmit = async () => {
      try {
        await fetcher().post("/segment", body)
        toast({
          title: "Segment created",
          description: "Segment has been created",
          status: "success",
        })
        setLastUpdate(Date.now())
        onClose()
      } catch (error) {
        setError(error.response?.data.message || error.message)
      }
    }
  
    const removeSegment = async (id: string) => {
      confirm("Are you sure you want to delete this segment?", async () => {
        fetcher()
          .delete(`/segment/${id}`)
          .then(() => {
            setLastUpdate(Date.now())
            toast({
              title: "Segment deleted",
              description: "Segment has been deleted",
              status: "success",
            })
          })
          .catch((error) => {
            const msg = error.response?.data.message || error.message
            toast({
              title: "Failed to delete segment",
              description: msg,
              status: "error",
            })
          })
      })
    }
  
    const useSegment = (audioId: string) => {
      return useSWR([audioId, lastUpdate], async ([id, _]) => {
        return fetcher()
          .get(`/segment/${id}`)
          .then((res) => res.data)
      })
    }
  
    return (
      <ctx.Provider
        value={{
          tags: tags || [],
          createSegment,
          useSegment,
          removeSegment,
        }}
      >
        {children}
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Tag</ModalHeader>
            <ModalBody>
              {error && (
                <Alert mb={5} status="error">
                  {error}
                </Alert>
              )}
              <Select
                value={body.tagId}
                onChange={(e) => {
                  setBody({ ...body, tagId: e.currentTarget.value })
                }}
              >
                <option value="">None</option>
                {tags?.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleSubmit}
                bgColor="purple"
                color="white"
                colorScheme="purple"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ctx.Provider>
    )
}
  