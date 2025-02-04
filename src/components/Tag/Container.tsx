import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    LockIcon,
    UnlockIcon,
} from "@chakra-ui/icons"
import { Box, Circle, Flex, IconButton, Tooltip } from "@chakra-ui/react"
import { useState } from "react"
import { useConfirm } from "../../hooks/useConfirm"
import useMe from "../../hooks/useMe"
import { useTag } from "../../hooks/useTag"
import { useTagCreator } from "../../hooks/useTagCreator"
import { useTagEditor } from "../../hooks/useTagEditor"
  
const TagItem = ({ tagId }: { tagId: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { confirm } = useConfirm()
    const { singleTag, remove, setLocked } = useTag()
    const { create } = useTagCreator()
    const tag = singleTag(tagId)
    const editor = useTagEditor()
    const me = useMe()
  
    const handleRemove = async (id: string, name: string) => {
      const message = `Are you sure you want to delete "${name}"?`
      confirm(message, () => remove(id).catch(console.error))
    }
  
    if (!tag) return null
    return (
      <Box>
        <Flex
          align="center"
          gap={2}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          cursor={"pointer"}
          _hover={{ fontWeight: "semibold" }}
        >
          <Circle bgColor={tag.color} size="0.8em" />
          <Box my={2}>{tag.name}</Box>
          {tag.locked && (
            <Tooltip label="Admin only unlocks." placement="right">
              <LockIcon fontSize="xs" />
            </Tooltip>
          )}
          <Flex
            align="center"
            gap={2}
            transform={isOpen ? "scale(1)" : "scale(0)"}
            transition={"all 0.2s ease-in-out"}
          >
            <IconButton
              size="xs"
              borderRadius="full"
              colorScheme="green"
              aria-label="Create"
              onClick={() => {
                create(tag.id)
              }}
              icon={<AddIcon />}
            />
            {!tag.locked && (
              <>
                <IconButton
                  size="xs"
                  borderRadius="full"
                  colorScheme="blue"
                  aria-label="Edit tag"
                  onClick={() => {
                    editor.handleOpen({
                      id: tag.id,
                      name: tag.name,
                      color: tag.color,
                      parentId: tag.parentId,
                    })
                  }}
                  icon={<EditIcon />}
                />
                <IconButton
                  size="xs"
                  borderRadius="full"
                  colorScheme="red"
                  aria-label="Delete tag"
                  onClick={() => {
                    handleRemove(tag.id, tag.name)
                  }}
                  icon={<DeleteIcon />}
                />
              </>
            )}
            {me.data?.role === "ADMIN" && (
              <IconButton
                size="xs"
                borderRadius="full"
                aria-label="Lock"
                onClick={() => {
                  setLocked(tag.id, !tag.locked)
                }}
                icon={tag.locked ? <UnlockIcon /> : <LockIcon />}
              />
            )}
          </Flex>
        </Flex>
        <Box pl={4} ml={1}>
          {tag.Child?.length > 0 &&
            tag.Child.map((child, idx) => (
              <Box key={child.id} position="relative">
                <Box
                  position="absolute"
                  h="1.3em"
                  borderBottomWidth={2}
                  left={-4}
                  w={3}
                />
                <Box
                  position={"absolute"}
                  h={tag.Child.length == idx + 1 ? "1.3em" : "100%"}
                  borderLeftWidth={2}
                  left={-4}
                />
                <TagItem tagId={child.id} />
              </Box>
            ))}
        </Box>
      </Box>
    )
}
  
const TagContainer = () => {
    const { tags } = useTag()
    return (
      <Box p={5}>
        {tags.map(({ id }) => (
          <TagItem key={id} tagId={id} />
        ))}
      </Box>
    )
}
  
export default TagContainer
  