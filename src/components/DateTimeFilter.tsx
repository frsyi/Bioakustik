import { 
  Box, Flex, Select, Text, Input, Button, Popover, 
  PopoverTrigger, PopoverContent, PopoverBody, PopoverCloseButton, IconButton
} from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"
import { useState, useCallback } from "react"

const hours = Array.from({ length: 12 }, (_, i) => i + 1)
const periods = ["AM", "PM"]

interface DateTimeFilterProps {
  selectedDate: string | undefined
  setSelectedDate: (date: string) => void
  startHour: string | undefined
  setStartHour: (hour: string | undefined) => void
  startPeriod: string
  setStartPeriod: (period: string) => void
  endHour: string | undefined
  setEndHour: (hour: string | undefined) => void
  endPeriod: string
  setEndPeriod: (period: string) => void
  isTimeApplied: boolean
  setIsTimeApplied: (applied: boolean) => void
}

const DateTimeFilter = ({
  selectedDate, setSelectedDate,
  startHour, setStartHour,
  startPeriod, setStartPeriod,
  endHour, setEndHour,
  endPeriod, setEndPeriod,
  isTimeApplied, setIsTimeApplied
}: DateTimeFilterProps) => {

  const [tempStartHour, setTempStartHour] = useState<string | undefined>()
  const [tempStartPeriod, setTempStartPeriod] = useState<string>("AM")
  const [tempEndHour, setTempEndHour] = useState<string | undefined>()
  const [tempEndPeriod, setTempEndPeriod] = useState<string>("AM")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const applyTimeFilter = useCallback(() => {
    if (parseInt(tempStartHour) > parseInt(tempEndHour) && tempStartPeriod === tempEndPeriod) {
      setErrorMessage("End time cannot be earlier than start time.")
      return
    }

    setErrorMessage(null)
    setStartHour(tempStartHour)
    setStartPeriod(tempStartPeriod)
    setEndHour(tempEndHour)
    setEndPeriod(tempEndPeriod)
    setIsTimeApplied(true)
  }, [tempStartHour, tempStartPeriod, tempEndHour, tempEndPeriod])

  const clearTimeFilter = useCallback(() => {
    setStartHour(undefined)
    setStartPeriod("AM")
    setEndHour(undefined)
    setEndPeriod("AM")
    setIsTimeApplied(false)
    setErrorMessage(null)
  }, [])

  return (
    <Flex align="center" gap={4}>
      <Input
        type="date"
        value={selectedDate || ""}
        onChange={(e) => setSelectedDate(e.target.value)}
        bgColor="white"
        w="200px"
      />

      <Popover>
        <PopoverTrigger>
          <Button bgColor="white" fontWeight="normal" position="relative">
            {isTimeApplied ? (
              <Flex align="center" gap={2}>
                <Text>
                  {startHour} {startPeriod} - {endHour} {endPeriod}
                </Text>
                <IconButton
                  icon={<CloseIcon />}
                  size="xs"
                  aria-label="Clear time"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearTimeFilter()
                  }}
                  variant="ghost"
                  color="gray.500"
                  _hover={{ bg: "gray.100" }}
                />
              </Flex>
            ) : (
              "Select Range Time"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody>
            <Text fontSize="md" fontWeight="bold" mb={2}>Select Time Range</Text>
            <Flex gap={2} mb={2}>
              <Select
                placeholder="Start Hour"
                value={tempStartHour}
                onChange={(e) => setTempStartHour(e.target.value)}
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </Select>
              <Select
                value={tempStartPeriod}
                onChange={(e) => setTempStartPeriod(e.target.value)}
              >
                {periods.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </Select>
            </Flex>

            <Flex gap={2} mb={4}>
              <Select
                placeholder="End Hour"
                value={tempEndHour}
                onChange={(e) => setTempEndHour(e.target.value)}
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </Select>
              <Select
                value={tempEndPeriod}
                onChange={(e) => setTempEndPeriod(e.target.value)}
              >
                {periods.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </Select>
            </Flex>

            {errorMessage && (
              <Text color="red.500" fontSize="sm" textAlign="center" mt={1} mb={3}>
                {errorMessage}
              </Text>
            )}

            <Button
              w="full"
              bg="purple"
              color="white"
              _hover={{ bg: "purple.600" }}
              isDisabled={!tempStartHour || !tempEndHour}
              onClick={applyTimeFilter}
            >
              Apply Time
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default DateTimeFilter
