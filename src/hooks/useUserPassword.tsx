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
    useDisclosure,
  } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { createContext, useContext, useState } from "react"
import useSWR from "swr"
import useAuth from "./useAuth"
import useCustomToast from "./useCustomToast"
  
const ctx = createContext(null)
  
export const useUserPassword = () => {
    return useContext(ctx)
}
  
export const UserPasswordProvider = ({ children }) => {
    const [error, setError] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [userId, setUserId] = useState(null)
    const { fetcher } = useAuth()
    const toast = useCustomToast()
  
    const handleOpen = (id) => {
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      setUserId(id)
      onOpen()
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
      fetcher()
        .patch(`/user/change-password`, { userId, newPassword })
        .then(() => {
          toast({
            title: "Password changed",
            description: `User's password has been changed successfully`,
            status: "success",
          })
          onClose()
        })
        .catch((err) => {
          if (err instanceof AxiosError)
            return setError(err?.response?.data?.message || "An error occurred")
          setError(err.message)
        })
    }
  
    return (
      <ctx.Provider value={{ handleOpen }}>
        {children}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalBody>
              {error && (
                <Alert status="error" my={4}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap={3}>
                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    bgColor="purple"
                    color="white"
                    _hover={{ opacity: 0.8 }}
                  >
                    Save
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
  