import {
  ChevronDownIcon,
  ChevronUpIcon,
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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { AudioItem } from "../hooks/useAudioList"
import IconPause from "../icons/IconPause"
import IconPlay from "../icons/IconPlay"
import IconSeekLeft from "../icons/IconSeekLeft"
import IconSeekRight from "../icons/IconSeekRight"
import IconSpeaker from "../icons/IconSpeaker"

type AudioCardProps = {
  recording: AudioItem
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

const getPosition = (duration: number, currentTime: number) => {
  const min = 7.02
  const max = 99
  return (currentTime / duration) * (max - min) + min
}

const AudioCard = ({ recording }: AudioCardProps) => {
  const ref = useRef<HTMLAudioElement>(null)
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
      }
    }, 10)
    return () => clearInterval(timer)
  }, [ref.current])

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: false,
  })

  return (
    <Box
      borderRadius="lg"
      border="none"
      borderWidth="1px"
      p={4}
      w="100%"
      bgColor="white"
      boxShadow="none"
    >
      <Flex gap={3}>
        <Flex flexDir="column">
          <Text fontWeight="bold" fontSize="lg">
            {recording.title}
          </Text>
          <Text fontSize="small">{recording.description}</Text>
        </Flex>
        <Flex flexDir="column" align="flex-end" gap={2} ml="auto">
          <Text fontSize="small" display="inline">
            {new Date(recording.createdAt).toLocaleString()}
          </Text>
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
        </Flex>
        <Box>
          <IconButton
            aria-label="collapse"
            borderRadius={"full"}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={onToggle}
          />
        </Box>
      </Flex>
      <Flex justify={"flex-end"} mt={3}>
        <Button
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
      </Flex>
      <Box position={"relative"} my={4} overflow="hidden">
        {/* {audio?.audio.buffered.length} */}
        <Image
          src={
            recording?.Spectrogram?.imageUrl ?? "/img/default-spectrogram.png"
          }
          alt="Spectrogram"
          loading="lazy"
          w="100%"
          draggable={false}
          transition={"all 0.8s"}
          marginTop={
            !isOpen && recording?.Spectrogram?.imageUrl ? "-20.2%" : undefined
          }
          onClick={(e) => {
            // get click position
            if (ref.current == null) return
            const rect = (e.target as HTMLImageElement).getBoundingClientRect()
            const x = e.clientX - rect.left

            const min = (7.02 * rect.width) / 100
            const max = (99 * rect.width) / 100
            const percent = ((x - min) / (max - min)) * 100

            const currentTime = (percent / 100) * ref.current.duration
            if (isFinite(currentTime)) ref.current.currentTime = currentTime
          }}
        />
        {isFinite(audio?.duration) && (
          <>
            <Box
              position={"absolute"}
              top={0}
              left={`${getPosition(audio?.duration, audio?.currentTime)}%`}
              h="calc(100% - 15px)"
              borderWidth={1}
              borderColor="red"
            />
            <TriangleUpIcon
              color="red"
              position="absolute"
              top="calc(100% - 15px)"
              left={`calc(${getPosition(
                audio?.duration,
                audio?.currentTime
              )}% - 7px)`}
            />
          </>
        )}
      </Box>
      <audio ref={ref} controls={false} src={recording.url} />
      <Flex justify="space-between" align="center" mt={4}>
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
    </Box>
  )
}

export default AudioCard
