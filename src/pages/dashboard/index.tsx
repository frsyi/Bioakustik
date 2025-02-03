import { Box, Flex, HStack, Select, Text, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import AudioCard from "../../components/AudioCard"
import Pagination from "../../components/Pagination"
import useAudioList from "../../hooks/useAudioList"
import useAudioTitle from "../../hooks/useAudioTitle"

const DashboardPage = () => {
  const router = useRouter()
  const goPage = (page: number) => {
    router.push({
      pathname: "/dashboard",
      query: { page },
    })
  }
  
  const { title, setTitle, titleList } = useAudioTitle()
  const { data: recording } = useAudioList({
    page: Number(router.query.page) || 1,
    title: title ? title : undefined,
  })

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
      <Flex justifyContent="space-between" align="center" gap={4}>
        <Box borderRadius="xl">
          <Select
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value)
            }}
            variant={"solid"}
            bgColor={"white"}
          >
            <option value="">All</option>
            {titleList.map((title, index) => (
              <option value={title} key={index}>
                {title}
              </option>
            ))}
          </Select>
        </Box>
        <Pagination
          currentPage={recording?.currentPage}
          maxPage={recording?.totalPage}
          goPage={goPage}
        />
      </Flex>
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