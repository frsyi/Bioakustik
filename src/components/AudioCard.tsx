import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  DownloadIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons"
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { AudioItem } from "../hooks/useAudioList"
import { useAudioSegment } from "../hooks/useAudioSegment"
import useMe from "../hooks/useMe"
import IconPause from "../icons/IconPause"
import IconPieChart from "../icons/IconPieChart"
import IconPlay from "../icons/IconPlay"
import IconPrint from "../icons/IconPrint"
import IconSeekLeft from "../icons/IconSeekLeft"
import IconSeekRight from "../icons/IconSeekRight"
import IconSpeaker from "../icons/IconSpeaker"
import WaveformChart from './audio'
import SegmentPieChart from "./SegmentPieChart"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import AudioReportPDF from "../components/AudioReportPDF"

type AudioCardProps = {
  recording: AudioItem
  onDelete?: (id: string) => Promise<void>
}

const formatTime = (duration: number) => {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  const milliseconds = Math.floor((duration - Math.floor(duration)) * 100)
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}.${
    milliseconds < 10 ? `0${milliseconds}` : milliseconds
  }`
}

// const getPosition = (duration: number, currentTime: number) => {
//   if (!duration) return 0
//   return (currentTime / duration) * 100
// }
const getPosition = (duration: number, currentTime: number) => {
  const min = 0.5
  const max = 99.5
  return (currentTime / duration) * (max - min) + min
}

const AudioCard = ({ recording, onDelete }: AudioCardProps) => {
  const ref = useRef<HTMLAudioElement>(null)

  const [isMouseSelecting, setIsMouseSelecting] = useState(false)

  const [timeRange, setTimeRange] = useState<{
    start: number
    end: number
  }>({
    start: 0,
    end: 0,
  })
  const [audio, setAudio] = useState<{
    currentTime: number
    duration: number
    playing: boolean
    volume: number
    audio: HTMLAudioElement
  }>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (ref.current) {
        setAudio({
          currentTime: ref.current.currentTime,
          duration: ref.current.duration,
          playing: ref.current.paused ? false : true,
          volume: ref.current.volume,
          audio: ref.current,
        })

        if (timeRange.end > 0 && ref.current.currentTime > timeRange.end) {
          ref.current.pause()
          ref.current.currentTime = timeRange.start
        }
      }
    }, 10)
    return () => clearInterval(timer)
  }, [ref.current, timeRange.end])

  useEffect(() => {
    if (typeof ref.current?.currentTime === "number") {
      ref.current.currentTime = timeRange.start || 0
    }
  }, [timeRange.start])

  const { data: me } = useMe()

  const calculate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current == null) return null
    
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    
    const percent = x / width
    const time = percent * ref.current.duration
    
    return { percent, time }
  }

  const { isOpen, onToggle, onOpen, onClose } = useDisclosure({
    defaultIsOpen: false,
  })

  const { createSegment, removeSegment, useSegment } = useAudioSegment()
  const { data: segments } = useSegment(recording.id)
  const [isPieChartOpen, setIsPieChartOpen] = useState(false)
  const toast = useToast()

  const segmentLayers = []
  segments?.forEach((segment) => {
    let placed = false
    for (const layer of segmentLayers) {
      if (!layer.some((s) => s.startTime < segment.endTime && s.endTime > segment.startTime)) {
        layer.push(segment)
        placed = true
        break
      }
    }
    if (!placed) {
      segmentLayers.push([segment])
    }
  })

  const handleDelete = (e) => {
    e.preventDefault()
    if (confirm("Hapus audio? Tindaakan ini tidak dapat dikembalikan")) {
      if (onDelete) {
        onDelete(recording.id).then(() => {
          toast({
            title: "Audio deleted",
            status: "success",
          })
        })
      }
    }
  }

  const pdfRef = useRef()

  const handleDownloadPDF = async () => {
    const input = pdfRef.current
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF('p', 'mm', 'a4', true)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${recording.title}.pdf`)
    })
  }

  return (
    <Box
      borderRadius="lg"
      border="none"
      borderWidth="1px"
      p={4}
      w="100%"
      bgColor="white"
      boxShadow="none"
      ref={pdfRef}
    >
      <Flex gap={3}>
        <Flex flexDir="column">
          <Text fontWeight="bold" fontSize="lg">
            {recording.title}
          </Text>
          <Text fontSize="small">{recording.description}</Text>
          <SegmentPieChart audioId={recording.id} width={350} height={200} />
        </Flex>
        <Flex flexDir="column" align="flex-end" gap={2} ml="auto">
          <Flex align="center" gap={2}>
            <Text fontSize="small" display="inline">
              {new Date(recording.createdAt).toLocaleString()}
            </Text>
            <IconButton
              aria-label="collapse"
              borderRadius="full"
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggle}
            />
          </Flex>
          <Flex
            bgColor={"gray.100"}
            px={2}
            py={1}
            borderRadius="full"
            align="center"
          >
            <Avatar height={"1em"} width={"1em"} />
            <Box px={2} fontWeight="semi">
              {recording.user?.name}
            </Box>
          </Flex>
          <Flex justify={"space-between"} mt={3} gap={2}>
            <Button
              ml="auto"
              borderRadius="full"
              colorScheme={"purple"}
              onClick={onToggle}
              bgColor="purple"
              size="sm"
              as="a"
              target="_blank"
              href={recording?.url}
              leftIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Tooltip label="Download PDF" hasArrow>
              <IconButton
                aria-label="download-pdf"
                borderRadius="full"
                colorScheme={"green"}
                size="sm"
                onClick={handleDownloadPDF}
                icon={<IconPrint />}
              />
            </Tooltip>

            {segments && segments.length > 0 && (
              <>
                <Tooltip label="Show Pie Chart">
                  <IconButton
                    aria-label="pie-chart"
                    borderRadius="full"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setIsPieChartOpen(true)}
                    icon={<IconPieChart />}
                  />
                </Tooltip>
                <Modal isOpen={isPieChartOpen} onClose={() => setIsPieChartOpen(false)}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Segment Distribution</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <SegmentPieChart audioId={recording.id} width={400} height={400} />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </>
            )}

            {me?.role === "ADMIN" && (
              <Tooltip label="Delete Audio" hasArrow>
                <IconButton
                  aria-label="delete"
                  borderRadius="full"
                  colorScheme={"red"}
                  size="sm"
                  onClick={handleDelete}
                  icon={<DeleteIcon />}
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Box position={"relative"} my={4} overflow="hidden">
          <WaveformChart
            mp3File={recording.url}
            audioRef={ref}
            showSpectrogram={isOpen}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsMouseSelecting(true)
              const result = calculate(e)
              if (result) {
                setTimeRange({ start: result.time, end: 0 })
                if (ref.current) ref.current.currentTime = result.time
              }
            }}
            onMouseUp={(e) => {
              e.preventDefault()
              setIsMouseSelecting(false)
              if (ref.current == null) return
              const time = calculate(e).time
              if (time === timeRange.start) {
                setTimeRange({ start: timeRange.start, end: 0 })
                return
              }
              if (time < timeRange.start) {
                setTimeRange({ start: time, end: timeRange.start })
                return
              }
              setTimeRange({ ...timeRange, end: time })
            }}
            onWaveformClick={(startTime) => {
              const endTime = Math.min(startTime + 5, audio?.duration || 0)
              setTimeRange({ start: startTime, end: endTime })
              createSegment({ audioId: recording.id, startTime, endTime })
            }}
          />
        {isFinite(audio?.duration) && (
          <>
            {segments?.length > 0 && segmentLayers.map((layer, index) => (
              layer.map((segment) => (
                <Tooltip
                  key={segment.id}
                  label={segment?.tag?.name}
                  placement="top"
                >
                  <Box
                    key={index}
                    transition={"all 0.3s"}
                    position={"absolute"}
                    left={`${getPosition(audio?.duration, segment.startTime)}%`}
                    width={`calc(${
                      getPosition(audio?.duration, segment.endTime) -
                      getPosition(audio?.duration, segment.startTime)
                    }% + 1px)`}
                    h={"10px"}
                    bottom={`${50 + index * 12}px`}
                    bgColor={segment.tag?.color || "blue"}
                    _hover={{
                      cursor: "pointer",
                    }}
                    opacity={0.8}
                    zIndex="overlay"
                    onClick={() => {
                      setTimeRange({
                        start: segment.startTime,
                        end: segment.endTime,
                      })

                      setAudio({
                        ...audio,
                        currentTime: segment.startTime,
                      })
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      removeSegment(segment.id)
                    }}
                  />
                </Tooltip>
              ))
            ))}
            {timeRange.start > 0 && timeRange.end > 0 && (
              <Box
                transition={"all 0.3s"}
                position={"absolute"}
                left={`${getPosition(audio?.duration, timeRange.start)}%`}
                width={`calc(${
                  getPosition(audio?.duration, timeRange.end) -
                  getPosition(audio?.duration, timeRange.start)
                }% + 1px)`}
                h={"10px"}
                bottom={
                  recording?.Spectrogram?.imageUrl
                    ? isOpen
                      ? "14.5%"
                      : "41%"
                    : "20%"
                }
                bgColor={"red"}
                _hover={{
                  cursor: "pointer",
                }}
                opacity={0.5}
                onClick={() => {
                  createSegment({
                    audioId: recording.id,
                    startTime: timeRange.start,
                    endTime: timeRange.end,
                  })
                }}
              />
            )}
            <Box
              position={"absolute"}
              top={0}
              left={`${getPosition(audio?.duration, audio?.currentTime)}%`}
              h="calc(100% - 15px)"
              borderWidth={1}
              borderColor="red"
              zIndex="overlay"
            />
            <TriangleUpIcon
              color="red"
              position="absolute"
              top="calc(100% - 15px)"
              left={`calc(${getPosition(
                audio?.duration,
                audio?.currentTime
              )}% - 7px)`}
              zIndex="overlay"
            />
          </>
        )}
      </Box>
      <audio ref={ref} controls={false} src={recording.url} />
      <Flex justify="space-between" align="center" mt={4} overflow="auto">
        <Flex flex={1}>
          <Flex
            fontSize="small"
            bgColor={"gray.100"}
            px={3}
            py={1}
            borderRadius="full"
            align={"center"}
          >
            <strong>{formatTime(audio?.currentTime || 0)} </strong>/
            <Box as="span"> {formatTime(audio?.duration || 0)}</Box>
          </Flex>
        </Flex>

        <Flex gap={3} flex={1} justify="center">
          <IconButton
            size="lg"
            borderRadius="full"
            aria-label="seek-left"
            icon={<IconSeekLeft />}
            onClick={() => {
              if (ref.current == null) return
              ref.current.currentTime = Math.max(ref.current.currentTime - 1, 0)
            }}
          />
          <IconButton
            borderRadius="full"
            size="lg"
            aria-label="play"
            bgColor={"gray.800"}
            color={"white"}
            colorScheme="blackAlpha"
            icon={audio?.playing ? <IconPause /> : <IconPlay />}
            onClick={() => {
              if (ref.current == null) return
              if (ref.current.paused) {
                ref.current.play()
              } else {
                ref.current.pause()
              }
            }}
          />
          <IconButton
            size="lg"
            borderRadius="full"
            aria-label="seek-right"
            icon={<IconSeekRight />}
            onClick={() => {
              if (ref.current == null) return
              ref.current.currentTime = Math.max(ref.current.currentTime + 1, 0)
            }}
          />
        </Flex>
        <Flex flex={1} justify="flex-end">
          <Flex
            fontSize="small"
            bgColor={"gray.100"}
            pr={4}
            gap={1}
            py={0}
            borderRadius="full"
            align="center"
          >
            <IconButton
              borderRadius={"full"}
              aria-label="volume"
              size="sm"
              icon={<IconSpeaker boxSize="0.9em" />}
              onClick={() => {
                if (ref.current == null) return
                if (ref.current.volume === 0) {
                  ref.current.volume = audio?.volume || 1
                } else {
                  ref.current.volume = 0
                }
              }}
            />
            <Slider
              aria-label="slider-ex-4"
              value={audio?.volume * 100 || 1}
              width={"100px"}
              onChange={(value) => {
                if (ref.current == null) return
                ref.current.volume = value / 100
              }}
            >
              <SliderTrack bg="gray.300">
                <SliderFilledTrack bg="gray.800" />
              </SliderTrack>
              <SliderThumb boxSize={3} bgColor="gray.800" />
            </Slider>
          </Flex>
        </Flex>
      </Flex>
      {/* {isOpen && (
        <Box alignItems="center" justifyContent="center" w="100%">
          <SegmentPieChart audioId={recording.id} width={400} height={400} />
        </Box>
      )} */}
    </Box>
  )
}

export default AudioCard
