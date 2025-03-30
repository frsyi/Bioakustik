import { Box, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline"
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram"

const WaveformChart = ({
  mp3File,
  audioRef,
  showSpectrogram,
  onMouseDown,
  onMouseUp,
  onWaveformClick,
}: {
  mp3File: string
  audioRef: React.RefObject<HTMLAudioElement>
  showSpectrogram: boolean
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void
  onWaveformClick?: (startTime: number) => void
}) => {
  const waveformRef = useRef<HTMLDivElement>(null)
  const spectrogramRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null)
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#1f77b4",
      progressColor: "#1f77b4",
      cursorColor: "transparent",
      cursorWidth: 0,
      barWidth: 3,
      barGap: 1,
      height: 45,
      autoplay: false,
      backend: "MediaElement",
      media: audioRef.current,
      sampleRate: 40000,
    })
    
    if (showSpectrogram && spectrogramRef.current) {
      wavesurfer.registerPlugin(
        SpectrogramPlugin.create({
          container: spectrogramRef.current,
          labels: true,
          height: 600,
          fftSamples: 1024,
          frequencyMin: 0,
          frequencyMax: 20000,
          scale: "linear"
        })
      )
    }  

    const timeline = TimelinePlugin.create({
      container: timelineRef.current!,
      height: 20,
      timeInterval: 5, 
      primaryLabelInterval: 5,
      secondaryLabelInterval: 1,
      style: {
        fontSize: "12px",
      },
    })
    
    wavesurfer.registerPlugin(timeline)

    setWaveform(wavesurfer)

    return () => {
      wavesurfer.destroy()
      setWaveform(null)
    }
  }, [mp3File, audioRef, showSpectrogram])

  useEffect(() => {
    if (!waveform || !audioRef.current) return

    const audioElement = audioRef.current

    const syncWaveform = () => {
      if (waveform && !waveform.isPlaying()) {
        waveform.setTime(audioElement.currentTime)
      }
    }

    audioElement.addEventListener("timeupdate", syncWaveform)

    return () => {
      audioElement.removeEventListener("timeupdate", syncWaveform)
    }
  }, [waveform, audioRef])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !audioRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    let startTime = percent * audioRef.current.duration

    startTime = Math.floor(startTime / 5) * 5 
    setHoveredSegment(startTime)
  }

  const handleMouseLeave = () => {
    setHoveredSegment(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveform || !audioRef.current) return

    const rect = timelineRef.current!.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    let startTime = percent * audioRef.current.duration

    startTime = Math.floor(startTime / 5) * 5
    onWaveformClick?.(startTime)
  }

  return (
    <Box position="relative">
      {showSpectrogram && (
        <Box 
          ref={spectrogramRef} 
          h="100%" 
          w="100%"
          border="2px solid #ccc" 
          borderRadius="5px"
          mb={2}
          position="relative"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      )}

      <Box 
        ref={waveformRef} 
        h="50px" 
        w="100%"
        border="2px solid #ccc" 
        borderRadius="5px"
        position="relative"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
      
      <Box
        ref={timelineRef}
        h="25px"
        w="100%"
        bg="gray.100"
        cursor="pointer"
        borderTop="1px solid gray"
        position="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {[...Array(Math.ceil(audioRef.current?.duration / 5) || 12)].map((_, i) => {
          const segmentStart = i * 5
          return (
            <Box
              key={i}
              position="absolute"
              left={`${(i / (Math.ceil(audioRef.current?.duration / 5) || 12)) * 100}%`}
              top="0"
              bottom="0"
              w="calc(100% / 12)"
              bg={hoveredSegment === segmentStart ? "gray.300" : "transparent"}
              transition="background-color 0.2s ease-in-out"
            />
          )
        })}
      </Box>
      <Text fontSize="sm" textAlign="center" mt={1} color="black">
        Time [sec]
      </Text>
    </Box>
  )
}

export default WaveformChart
