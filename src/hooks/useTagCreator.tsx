import {
    Alert,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
  } from "@chakra-ui/react"
  import { AxiosError } from "axios"
  import { createContext, useContext, useState } from "react"
  import { useTag } from "./useTag"
  
  const ctx = createContext<{
    create: (id?: string) => Promise<void>
  }>(null)
  
  export const useTagCreator = () => {
    return useContext(ctx)
  }
  
  export const TagCreatorProvider = ({ children }) => {
    const tag = useTag()
    const defaultBody = { parentId: "", name: "", color: "#000000" }
  
    const [body, setBody] = useState(defaultBody)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [error, setError] = useState("")
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      tag
        .create(body)
        .then((res) => {
          onClose()
          tag.mutate()
        })
        .catch((err) => {
          if (err instanceof AxiosError)
            return setError(err?.response?.data?.message)
          setError(err.message)
        })
    }
  
    const handleClose = () => {
      onClose()
    }
  
    const create = async (id?: string) => {
      setError("")
      setBody({ ...defaultBody, parentId: id })
      onOpen()
    }
  
    return (
      <ctx.Provider value={{ create }}>
        {children}
        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Tag</ModalHeader>
            <ModalBody>
              {error && (
                <Alert status="error" my={4}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap={3}>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={body.name}
                    onChange={(e) => setBody({ ...body, name: e.target.value })}
                  />
                  <Input
                    type="color"
                    placeholder="Color"
                    value={body.color}
                    width="50px"
                    aspectRatio={1}
                    border="none"
                    borderRadius="50%"
                    p={0}
                    onChange={(e) => setBody({ ...body, color: e.target.value })}
                  />
                  <Button
                    type="submit"
                    bgColor={"purple"}
                    color="white"
                    _hover={{ opacity: 0.8 }}
                  >
                    Create
                  </Button>
                </Flex>
              </form>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </ctx.Provider>
    )
  }
  