import { SunIcon } from "@chakra-ui/icons"
import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Flex,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useAuth from "../hooks/useAuth"
import useMe from "../hooks/useMe"
import { IconHome } from "../icons/IconHome"
import IconLogout from "../icons/IconLogout"
import IconUser from "../icons/IconUser"
import ConfirmationModal from "./Confirmation"

const ButtonMenu = ({ path, ...props }: ButtonProps & { path?: string }) => {
  const router = useRouter()
  return (
    <Button
      fontWeight="semi"
      size="lg"
      fontSize="md"
      justifyContent="flex-start"
      isActive={path ? router.asPath.startsWith(path) : false}
      px={3}
      _active={{ bgColor: "purple", color: "white" }}
      {...props}
    />
  )
}

const Sidebar = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const { data: me } = useMe()
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <Flex flexDir="column" h="100%" flex={1} p={10} px={8}>
      <Box fontSize="xl" fontWeight="bold" mb={4}>
        Bioakustik Database
      </Box>
      <Box>Simple database for bioakustik recordings</Box>
      <Flex flexDir="column" my={10} gap={10}>
        <Box>
          <Box color="gray" fontSize="sm" textTransform="uppercase">
            Home
          </Box>
          <VStack spacing={2} align="stretch" mt={3}>
            <ButtonMenu
              path="/dashboard"
              onClick={() => {
                router.push("/dashboard")
              }}
              leftIcon={<IconHome />}
            >
              Dashboard
            </ButtonMenu>
            <ButtonMenu
              path="/tag"
              leftIcon={<SunIcon w="32px" />}
              onClick={() => {
                router.push("/tag")
              }}
            >
              Tags
            </ButtonMenu>
          </VStack>
        </Box>
        <Box>
          <Box color="gray" fontSize="sm" textTransform="uppercase">
            User
          </Box>
          <VStack spacing={2} align="stretch" mt={3}>
            {me?.role === "ADMIN" && (
              <ButtonMenu
                leftIcon={<IconUser />}
                onClick={() => router.push("/user")}
                path="/user"
              >
                User Management
              </ButtonMenu>
            )}
            <ButtonMenu onClick={onOpen} leftIcon={<IconLogout />}>
              Logout
            </ButtonMenu>
          </VStack>
        </Box>
      </Flex>
      <Box mt="auto">
        <Box color="gray" fontSize="sm" textTransform="uppercase">
          Account
        </Box>
        <Flex gap={3} my={2} align="center">
          <Avatar />
          <Box lineHeight={1.2}>
            <Box fontWeight="bold">{me?.name}</Box>
            <Box fontSize="sm">{me?.username}</Box>
          </Box>
        </Flex>
      </Box>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Do you want to log out?"
        confirmLabel="Logout"
        onConfirm={() => {
          logout()
          router.push("/")
        }}
      >
        You are going to sign out from this account
      </ConfirmationModal>
    </Flex>
  )
}

export default Sidebar