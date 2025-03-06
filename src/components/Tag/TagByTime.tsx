import React, { useState } from "react"
import { 
  Table, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  IconButton, 
  Spinner, 
  Box,
  Flex,
  Text
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { useTagGrouping } from "../../hooks/useTagGrouping"

export interface GroupedSegment {
  tag: string
  morning: number
  afternoon: number
  night: number
  children?: GroupedSegment[]
}

const TagByTime = () => {
  const { data, error, isLoading } = useTagGrouping()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpanded = (tag: string) => {
    setExpanded((prev) => ({ ...prev, [tag]: !prev[tag] }))
  }

  if (isLoading) return <Spinner />
  if (error) return <Box color="red.500">Error loading data</Box>
  if (!data || Object.keys(data).length === 0) return <Box>No data available</Box>

  const groupedData = data as GroupedSegment[]

  return (
    <Box overflow="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tag</Th>
            <Th textAlign="center">Morning</Th>
            <Th textAlign="center">Afternoon</Th>
            <Th textAlign="center">Night</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groupedData.map((parent) => (
            <React.Fragment key={parent.tag}>
              <Tr 
                onClick={() => toggleExpanded(parent.tag)}
                _hover={{ bg: "gray.100", cursor: parent.children && parent.children.length > 0 ? "pointer" : "default" }}
              >
                <Td>
                  <Flex align="center" justify="flex-start" whiteSpace="nowrap">
                    {parent.children && parent.children.length > 0 && (
                      <IconButton
                        icon={expanded[parent.tag] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        size="xs"
                        mr={2}
                        aria-label="Toggle Children"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(parent.tag);
                        }}
                      />
                    )}
                    <Text>{parent.tag}</Text>
                  </Flex>
                </Td>
                <Td textAlign="center">{parent.morning}</Td>
                <Td textAlign="center">{parent.afternoon}</Td>
                <Td textAlign="center">{parent.night}</Td>
              </Tr>
              {expanded[parent.tag] &&
                parent.children &&
                parent.children.map((child) => (
                  <Tr key={child.tag} bg="gray.50">
                    <Td pl={8}>
                      <Flex align="center">
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg="gray.400"
                          mr={2}
                          ml={8}
                        />
                        <Text>{child.tag}</Text>
                      </Flex>
                    </Td>
                    <Td textAlign="center">{child.morning}</Td>
                    <Td textAlign="center">{child.afternoon}</Td>
                    <Td textAlign="center">{child.night}</Td>
                  </Tr>
                ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default TagByTime