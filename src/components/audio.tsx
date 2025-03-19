import { Box, Text, Flex } from "@chakra-ui/react" 
import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram"

const WaveformChart = ({
  mp3File,
  audioRef,
  showSpectrogram,
  onMouseDown,
  onMouseUp,
}: {
  mp3File: string
  audioRef: React.RefObject<HTMLAudioElement>
  showSpectrogram: boolean
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void
}) => {
  const waveformRef = useRef<HTMLDivElement>(null)
  const spectrogramRef = useRef<HTMLDivElement>(null)
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null)

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
      height: 50,
      autoplay: false,
      backend: "MediaElement",
      media: audioRef.current,
    })

    if (showSpectrogram && spectrogramRef.current) {
      wavesurfer.registerPlugin(
        SpectrogramPlugin.create({
          container: spectrogramRef.current,
          labels: true,
          height: 200,
        })
      )
    }

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

      <Flex justify="space-between" mt={1} px={2}>
        {[0, 10, 20, 30, 40, 50, 60].map((time) => (
          <Text key={time} fontSize="xs" color="black">
            {time}
          </Text>
        ))}
      </Flex>

      <Text fontSize="sm" textAlign="center" mt={1} color="black">
        Time [sec]
      </Text>
    </Box>
  )
}

export default WaveformChart