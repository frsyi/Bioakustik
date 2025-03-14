import { Box, Flex, HStack, Select, Text, VStack, Input } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import AudioCard from "../../components/AudioCard"
import Pagination from "../../components/Pagination"
import DateTimeFilter from "../../components/DateTimeFilter"
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
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    router.query.date as string
  )
  const [startHour, setStartHour] = useState<string | undefined>()
  const [startPeriod, setStartPeriod] = useState<string | undefined>("AM")
  const [endHour, setEndHour] = useState<string | undefined>()
  const [endPeriod, setEndPeriod] = useState<string | undefined>("AM")
  const [isTimeApplied, setIsTimeApplied] = useState(false)

  const { title, setTitle, titleList } = useAudioTitle()
  const { data: recording } = useAudioList({
    page: Number(router.query.page) || 1,
    title: title ? title : undefined,
    date: selectedDate,
    startHour: startHour ? (startPeriod === "PM" ? Number(startHour) + 12 : Number(startHour)) : undefined,
    endHour: endHour ? (endPeriod === "PM" ? Number(endHour) + 12 : Number(endHour)) : undefined,
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
      <Flex align="center" gap={4}>
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

        <DateTimeFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          startHour={startHour}
          setStartHour={setStartHour}
          startPeriod={startPeriod}
          setStartPeriod={setStartPeriod}
          endHour={endHour}
          setEndHour={setEndHour}
          endPeriod={endPeriod}
          setEndPeriod={setEndPeriod}
          isTimeApplied={isTimeApplied}
          setIsTimeApplied={setIsTimeApplied}
        />

        <Box ml="auto">
          <Pagination
            currentPage={recording?.currentPage}
            maxPage={recording?.totalPage}
            goPage={goPage}
          />
        </Box>
      </Flex>
      <VStack align="center" spacing={4} my={10}>
        {recording?.data?.length > 0 ? (
          recording.data.map((recording, index) => (
            <AudioCard recording={recording} key={index} />
          ))
        ) : (
          <Box 
            p={3}
            borderRadius="lg"
            bg="gray.50"
            w="full"
            textAlign="center"
          >
            <Text fontSize="md">
              No audio recording available.
            </Text>
          </ Box>
        )}
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