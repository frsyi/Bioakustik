import { Box, Flex, HStack, Select, Text, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import AudioCard from "../../components/AudioCard"
import Pagination from "../../components/Pagination"
import useAudioList from "../../hooks/useAudioList"
import { AudioSegmentProvider } from "../../hooks/useAudioSegment"
import useAudioTitle from "../../hooks/useAudioTitle"

const DashboardPage = () => {
  const router = useRouter()
  const goPage = (page: number) => {
    router.push({
      pathname: "/dashboard",
      query: { ...router.query, page },
    })
  }
  const { title, setTitle, titleList } = useAudioTitle()
  const { data: recording } = useAudioList({
    page: Number(router.query.page) || 1,
    title: title ? title : undefined,
  })

  if (!recording) return null
  return (
    <AudioSegmentProvider>
      <Head>
        <title>Biokustik - Dashboard</title>
      </Head>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        List of Recoding Data
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
          currentPage={recording.currentPage}
          maxPage={recording.totalPage}
          goPage={goPage}
        />
      </Flex>
      <VStack align="start" spacing={4} my={10}>
        {recording?.data?.map((recording, index) => (
          <AudioCard recording={recording} key={index} />
        ))}
      </VStack>
      <HStack justifyContent="flex-end">
        <Pagination
          currentPage={recording.currentPage}
          maxPage={recording.totalPage}
          goPage={goPage}
        />
      </HStack>
    </AudioSegmentProvider>
  )
}

export default DashboardPage