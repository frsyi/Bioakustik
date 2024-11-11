import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import Head from "next/head"

const DashboardPage = () => {
  return (
    <Box>
      <Head>
        <title>Bioakustik - Dashboard</title>
      </Head>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        List of Recording Data
      </Text>
    </Box>
  )
}

export default DashboardPage