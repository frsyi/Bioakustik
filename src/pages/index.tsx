import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"

const LoginPage: React.FC = () => {
  const router = useRouter()
  const { login, accessToken, fetcher, updateToken } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
      .then(() => {
        console.log("Logged in")
        router.push("/dashboard")
      })
      .catch((error) => {
        setError(error?.message)
      })
  }

  useEffect(() => {
    if (!accessToken) {
      return
    }

    fetcher()
      .get("/auth/refresh")
      .then(({ data }) => {
        updateToken(data.access_token)
        router.push("/dashboard")
      })
      .catch(() => {
        console.log("Not logged in")
      })
  }, [accessToken])

  return (
    <Flex minH="100vh" alignItems="stretch" justifyContent="stretch">
      <Head>
        <title>Biokustik</title>
      </Head>
      <Box flex={2} bgColor="purple"></Box>
      <Flex flexDir="column" flex={1} p={12} justify="center">
        <Box>
          <Heading as="h2">Selamat Datang di Biokustik!</Heading>
          <Box fontSize="lg" color="gray.500" mb={4}>
            by PT Covwatch Karya Nusantara
          </Box>
          <Box>Silakan masukkan email dan password untuk masuk</Box>
        </Box>
        <form onSubmit={handleSubmit}>
          <Flex gap={4} flexDir="column" my={10}>
            {error && (
              <Alert status="error" my={5}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <FormLabel htmlFor="email" fontWeight="normal">
                Username
              </FormLabel>
              <Input
                id="email"
                value={email}
                onChange={handleEmailChange}
                bgColor="gray.50"
                size="lg"
                border="none"
                required
                placeholder="Masukkan username"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" fontWeight="normal">
                Password
              </FormLabel>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                bgColor="gray.50"
                size="lg"
                border="none"
                required
                placeholder="Masukkan password"
              />
            </FormControl>
          </Flex>

          <Button
            type="submit"
            mt={10}
            size="lg"
            bgColor="purple"
            colorScheme="purple"
            _hover={{
              opacity: 0.9,
            }}
            width="100%"
            alignSelf="center"
          >
            Masuk
          </Button>
        </form>
      </Flex>
    </Flex>
  )
}

export default LoginPage
