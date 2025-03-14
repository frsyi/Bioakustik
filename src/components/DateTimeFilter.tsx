import { Box, Flex, Select, Text, Input, Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverCloseButton } from "@chakra-ui/react"
import { useState } from "react"

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

  const applyTimeFilter = () => {
    setStartHour(tempStartHour)
    setStartPeriod(tempStartPeriod)
    setEndHour(tempEndHour)
    setEndPeriod(tempEndPeriod)
    setIsTimeApplied(true)
  }

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
          <Button bgColor="white" fontWeight="normal">
            {isTimeApplied
              ? `Time: ${startHour} ${startPeriod} - ${endHour} ${endPeriod}`
              : "Filter by Time"}
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

            <Button
              w="full"
              bg="purple"
              color="white"
              _hover={{ bg: "purple" }}
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
