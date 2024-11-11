import { Box, Button, HStack } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"

const WaveformChart = ({ mp3File }: { mp3File: string }) => {
  const wavesurferRef = useRef(null)
  const [waveform, setWaveform] = useState<WaveSurfer>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!wavesurferRef.current) return
    const wavesurfer = WaveSurfer.create({
      container: wavesurferRef.current,
      waveColor: "pink",
      progressColor: "red",
      cursorColor: "white",
      barWidth: 2,
      barHeight: 1,
      cursorWidth: 1,
      height: 80,
      autoplay: false,
      // responsive: true,
      backend: "MediaElement",
    })

    wavesurfer.load(mp3File)
    setWaveform(wavesurfer)

    return () => {
      wavesurfer.destroy()
      setWaveform(null)
    }
  }, [mp3File, wavesurferRef])

  return (
    <Box>
      <Box ref={wavesurferRef} h="80px" w="100%" />
      <HStack>
        <Button
          onClick={() => {
            setIsPlaying((current) => {
              if (waveform) {
                if (current) {
                  waveform.pause()
                } else {
                  waveform.play()
                }
              }
              return !current
            })
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button as="a" target="_blank" href={mp3File}>
          Download
        </Button>
      </HStack>
    </Box>
  )
}

export default WaveformChart