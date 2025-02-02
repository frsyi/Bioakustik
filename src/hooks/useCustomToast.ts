import { useToast } from "@chakra-ui/react"

const useCustomToast = () => {
  return useToast({
    isClosable: true,
    position: "top-right",
    duration: 3000,
  })
}

export default useCustomToast