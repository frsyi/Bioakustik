import { Button, Flex } from "@chakra-ui/react"
import { useTagCreator } from "../../hooks/useTagCreator"

const TagCreateButton = () => {
  const creator = useTagCreator()
  return (
    <Flex>
      <Button onClick={() => creator.create()}>Create</Button>
    </Flex>
  )
}

export default TagCreateButton
