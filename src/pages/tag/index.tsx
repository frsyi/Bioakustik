import { Box, Heading } from "@chakra-ui/react"
import TagContainer from "../../components/Tag/Container"
import TagCreateButton from "../../components/Tag/CreateButton"
import { TagProvider } from "../../hooks/useTag"
import { TagCreatorProvider } from "../../hooks/useTagCreator"
import { TagEditorProvider } from "../../hooks/useTagEditor"
import TagByTime from "../../components/Tag/TagByTime"

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
          <Box p={3} mt={4} borderRadius="xl" bgColor="white">
            {/* <Box fontWeight="semibold" p={3}>Tag Insight</Box> */}
            <TagByTime />
          </Box>
        </TagCreatorProvider>
      </TagEditorProvider>
    </TagProvider>
  )
}

export default TagPage