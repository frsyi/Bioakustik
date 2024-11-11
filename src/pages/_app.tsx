import { Box, ChakraProvider, HStack } from "@chakra-ui/react"

import { AppProps } from "next/app"
import { useRouter } from "next/router"
import LoginGuard from "../components/LoginGuard"
import theme from "../theme"
import Sidebar from "../components/Sidebar"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isHome = router.pathname === "/"
  return (
    <ChakraProvider theme={theme}>
        {isHome ? (
          <Component {...pageProps} />
        ) : (
          <LoginGuard>
            <HStack align="flex-start" spacing={4} h="100vh">
              <Sidebar />
              <Box flex={4} overflow="auto" p={10} bgColor="gray.100" h="full">
                <Component {...pageProps} />
              </Box>
            </HStack>
          </LoginGuard>
        )}
    </ChakraProvider>
  )
}

export default MyApp
