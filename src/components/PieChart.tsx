import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Tooltip, IconButton } from "@chakra-ui/react"
import IconPieChart from "../icons/IconPieChart"
import useSWR from "swr"
import useAuth from "../hooks/useAuth"
import { useDisclosure } from "@chakra-ui/react"

const SegmentPieChart = ({ audioId }: { audioId: string }) => {
  const { fetcher } = useAuth();
  const { data, error } = useSWR(`/segment/count-by-audio/${audioId}`, (url) =>
    fetcher().get(url).then((res) => res.data)
  )

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (error) return <p>Error fetching data</p>
  if (!data || data.length === 0) return null

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text x={x} y={y} fill="white" fontSize="12px" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
        {(percent * 100).toFixed(1)}%
      </text>
    )
  }

  return (
    <>
      <Tooltip label="Show Pie Chart">
        <IconButton
          aria-label="pie-chart"
          borderRadius="full"
          colorScheme="blue"
          size="sm"
          onClick={onOpen}
          icon={<IconPieChart />}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Segment Distribution</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                dataKey="count"
                nameKey="tag"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={renderCustomLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SegmentPieChart
