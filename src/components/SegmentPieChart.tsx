import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts"
import useSWR from "swr"
import useAuth from "../hooks/useAuth"

const SegmentPieChart = ({ audioId, width = 400, height = 400 }: { audioId: string; width?: number; height?: number }) => { 
  const { fetcher } = useAuth();
  const { data, error } = useSWR(`/segment/count-by-audio/${audioId}`, (url) =>
    fetcher().get(url).then((res) => res.data)
  )

  if (error) return <p>Error fetching data</p>
  if (!data || data.length === 0) return <p>No data available</p>

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
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="tag"
        cx="50%"
        cy="50%"
        outerRadius={100}
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
  )
}

export default SegmentPieChart
