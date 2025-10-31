import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface YearStats {
  paid_count: number;
  unpaid_count: number;
  collected_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface YearRadiometerProps {
  years: {
    [year: string]: YearStats;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const YearRadiometer = ({ years }: YearRadiometerProps) => {
  // Transform data for pie chart
  const chartData = Object.entries(years).map(([year, stats]) => ({
    name: year,
    value: stats.collected_amount,
    paid: stats.paid_count,
    unpaid: stats.unpaid_count,
    pending: stats.pending_amount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-wise Collection Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Year-wise details */}
        <div className="mt-4 space-y-2">
          {Object.entries(years).map(([year, stats]) => (
            <div key={year} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">{year}</span>
              <div className="text-right">
                <p className="text-sm text-green-600 font-semibold">
                  ₹{stats.collected_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-600">
                  {stats.paid_count} paid, {stats.unpaid_count} pending
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default YearRadiometer;