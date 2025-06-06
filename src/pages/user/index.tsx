import { AddIcon, SearchIcon } from "@chakra-ui/icons"
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Head from "next/head"
import { useState } from "react"
import { useConfirm } from "../../hooks/useConfirm"
import useCreateUser from "../../hooks/useCreateUser"
import useUser from "../../hooks/useUser"
import useUserRole from "../../hooks/useUserRole"
import { useUserPassword } from "../../hooks/useUserPassword"

const UserPage = () => {
  const { data } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { body, error, handleChange, handleSubmit, loading, init, remove } =
    useCreateUser()

  const fuse = new Fuse(data, {
    keys: ["name", "username"],
  })

  const [search, setSearch] = useState("")
  const users = search ? fuse.search(search).map((i) => i.item) : data
  const { confirm } = useConfirm()
  const { changeRole, roles } = useUserRole()
  const password = useUserPassword()

  return (
    <Box>
      <Head>
        <title>Bioakustik - User Management</title>
      </Head>
      <Heading fontSize="xl" mb={10}>
        User Management
      </Heading>

      <Box bgColor="white" borderRadius="lg" p={6}>
        <Box fontWeight="semibold">User List</Box>
        <Flex gap={2} justify="space-between" my={4}>
          <Box>
            <InputGroup>
              <InputLeftElement border="none">
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input
                border="none"
                type="text"
                bgColor="gray.100"
                placeholder="Search"
                onChange={(e) => setSearch(e.currentTarget.value)}
                value={search}
              />
            </InputGroup>
          </Box>
          <Button
            bgColor="purple"
            colorScheme="purple"
            leftIcon={<AddIcon />}
            onClick={() => {
              init()
              onOpen()
            }}
          >
            Add New User
          </Button>
        </Flex>
        <Box overflow="auto">
          <Table size="sm" my={10}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.username}</Td>
                  <Td>
                    <Select
                      value={user.role}
                      onChange={(e) => {
                        changeRole(user.id, e.currentTarget.value)
                      }}
                    >
                      {roles &&
                        Object.entries(roles).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                    </Select>
                  </Td>
                  <Td>
                    <ButtonGroup size="sm">
                      <Button 
                        bgColor="purple" 
                        colorScheme="purple"
                        onClick={() => {
                          password.handleOpen(user.id)
                        }}
                      >
                        Change Password
                      </Button>
                      {user._count.Audio === 0 && (
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            confirm(
                              `Are you sure want to delete "${user.name}"?`,
                              () => {
                                remove(user.id)
                              }
                            )
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontSize="xl">Create User</Heading>
          </ModalHeader>
          <ModalBody>
            {error && <Alert status="error">{error}</Alert>}
            <Input
              value={body.name}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
              placeholder="Name"
              my={2}
            />
            <Input
              value={body.username}
              onChange={(e) => handleChange("username", e.currentTarget.value)}
              placeholder="Username"
              my={2}
            />
            <Input
              type="password"
              value={body.password}
              onChange={(e) => handleChange("password", e.currentTarget.value)}
              placeholder="Password"
              my={2}
            />
            <Input
              type="password"
              value={body.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.currentTarget.value)
              }
              placeholder="Confirm Password"
              my={2}
            />
            <Button
              colorScheme="purple"
              bgColor="purple"
              w="full"
              isLoading={loading}
              onClick={() => handleSubmit(onClose)}
            >
              Create User
            </Button>
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
    </Box>
  )
}

export default UserPage
