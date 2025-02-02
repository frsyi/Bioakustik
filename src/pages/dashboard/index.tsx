import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import AudioCard from "../../components/AudioCard"
import Pagination from "../../components/Pagination"
import useAudioList from "../../hooks/useAudioList"

const DashboardPage = () => {
  const router = useRouter()
  const goPage = (page: number) => {
    router.push({
      pathname: "/dashboard",
      query: { page },
    })
  }
  
  // Ambil data rekaman jika perlu
  const { data: recording } = useAudioList(Number(router.query.page as string))

  // Jika tidak ada data dari server, gunakan file lokal
  const recordings = recording?.data ?? [
    {
      id: "local-audio",
      title: "Sample Recording",
      description: "Rekaman lokal untuk contoh",
      url: "/audio/sample.mp3", // path ke file audio lokal
      createdAt: new Date().toISOString(),
      user: { id: "1", name: "Admin", username: "admin" }
    }
  ]

  return (
    <Box>
      <Head>
        <title>Bioakustik - Dashboard</title>
      </Head>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        List of Recording Data
      </Text>
      <VStack align="start" spacing={4} my={10}>
        {recordings.map((recording, index) => (
          <AudioCard recording={recording} key={index} />
        ))}
      </VStack>
      <HStack justifyContent="flex-end">
        <Pagination 
          currentPage={recording?.currentPage}
          maxPage={recording?.totalPage}
          goPage={goPage}
        />
      </HStack>
    </Box>
  )
}

export default DashboardPage