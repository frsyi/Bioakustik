import { Box, ChakraProvider, HStack } from "@chakra-ui/react"

import { AppProps } from "next/app"
import { useRouter } from "next/router"
import LoginGuard from "../components/LoginGuard"
import Sidebar from "../components/Sidebar"
import { ConfirmProvider } from "../hooks/useConfirm"
import { UserPasswordProvider } from "../hooks/useUserPassword"
import theme from "../theme"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isHome = router.pathname === "/"
  return (
    <ChakraProvider theme={theme}>
      <ConfirmProvider>
        {isHome ? (
          <Component {...pageProps} />
        ) : (
          <LoginGuard>
            <HStack align="flex-start" spacing={4} h="100vh">
              <Sidebar />
              <Box flex={4} overflow="auto" p={10} bgColor="gray.100" h="full">
                <UserPasswordProvider>
                  <Component {...pageProps} />
                </UserPasswordProvider>
              </Box>
            </HStack>
          </LoginGuard>
        )}
      </ConfirmProvider>
    </ChakraProvider>
  )
}

export default MyApp
