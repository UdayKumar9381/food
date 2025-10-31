// src/components/dashboard/RoomWiseChart.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RoomData {
  room: string;
  paid_count: number;
  unpaid_count: number;
  paid_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface RoomWiseChartProps {
  data: RoomData[];
  title?: string;
}

const RoomWiseChart = ({ data, title }: RoomWiseChartProps) => {
  const sorted = [...data].sort((a, b) => a.room.localeCompare(b.room));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {title ?? "Room-wise Payment Status"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sorted}
            margin={{ top: 10, right: 15, left: 10, bottom: 60 }}
            barCategoryGap="6%"
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />

            {/* X-axis: Room labels (tilted for space) */}
            <XAxis
              dataKey="room"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={70}
            />

            {/* Y-axis: Shared for all bars */}
            <YAxis tick={{ fontSize: 11 }} />

            <Tooltip
              contentStyle={{ fontSize: "12px", padding: "4px 8px" }}
              formatter={(value: number, name: string) => {
                const formatted = value.toLocaleString("en-IN");
                return name.includes("₹") ? `₹${formatted}` : formatted;
              }}
            />

            <Legend
              verticalAlign="top"
              height={32}
              iconSize={10}
              wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
            />

            {/* 4 Compact Bars */}
            <Bar
              dataKey="paid_count"
              fill="#10b981"
              name="Paid"
              barSize={16}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="unpaid_count"
              fill="#f59e0b"
              name="Unpaid"
              barSize={16}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="paid_amount"
              fill="#22c55e"
              name="Paid ₹"
              barSize={16}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="pending_amount"
              fill="#ef4444"
              name="Pending ₹"
              barSize={16}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Optional: Mini summary */}
        <div className="mt-2 text-xs text-center text-gray-500">
          {sorted.length} rooms • Click bars for details
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomWiseChart;