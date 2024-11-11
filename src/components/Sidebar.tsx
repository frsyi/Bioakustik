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
import IconLock from "../icons/IconLock"
import IconLogout from "../icons/IconLogout"
import IconUser from "../icons/IconUser"

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
        Biokustik Database
      </Box>
      <Box>Simple database for biokustik recordings</Box>
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
            <ButtonMenu
              path="/token"
              onClick={() => {
                router.push("/token")
              }}
              leftIcon={<IconLock />}
            >
              API Keys
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
    </Flex>
  )
}

export default Sidebar