import { Box, Heading } from "@chakra-ui/react"
import TagContainer from "../../components/Tag/Container"
import TagCreateButton from "../../components/Tag/CreateButton"
import { TagProvider } from "../../hooks/useTag"
import { TagCreatorProvider } from "../../hooks/useTagCreator"
import { TagEditorProvider } from "../../hooks/useTagEditor"

const TagPage = () => {
  return (
    <TagProvider parentId="null">
      <TagEditorProvider>
        <TagCreatorProvider>
          <Heading mb={4}>Tags</Heading>
          <Box p={3} borderRadius="xl" bgColor="white">
            <TagCreateButton />
            <TagContainer />
          </Box>
        </TagCreatorProvider>
      </TagEditorProvider>
    </TagProvider>
  )
}

export default TagPage