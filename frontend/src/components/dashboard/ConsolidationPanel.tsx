import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SummaryData, RoomStats, YearStats } from '@/lib/api';

export interface ConsolidationPanelProps {
  summary: SummaryData;
  roomWise: {
    [room: string]: RoomStats;
  };
  yearWise: {
    [year: string]: YearStats;
  };
}

const ConsolidationPanel = ({ summary, roomWise, yearWise }: ConsolidationPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Consolidation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="rooms">Room-wise</TabsTrigger>
            <TabsTrigger value="years">Year-wise</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.total_students}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Students Paid</p>
                  <p className="text-2xl font-bold text-green-600">{summary.paid_count}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Students Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{summary.unpaid_count}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Collection Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {((summary.paid_count / summary.total_students) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Financial Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Expected Total:</span>
                    <span className="font-semibold">₹{summary.expected_total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Collected:</span>
                    <span className="font-semibold">₹{summary.total_paid_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Pending:</span>
                    <span className="font-semibold">₹{summary.pending_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Room-wise Tab */}
          <TabsContent value="rooms">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Unpaid</TableHead>
                    <TableHead className="text-right">Collected</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Expected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(roomWise)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([room, stats]) => (
                      <TableRow key={room}>
                        <TableCell className="font-medium">{room}</TableCell>
                        <TableCell className="text-right text-green-600">{stats.paid_count}</TableCell>
                        <TableCell className="text-right text-orange-600">{stats.unpaid_count}</TableCell>
                        <TableCell className="text-right">
                          ₹{stats.paid_amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{stats.pending_amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{stats.expected_amount.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Year-wise Tab */}
          <TabsContent value="years">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Unpaid</TableHead>
                    <TableHead className="text-right">Collected</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Expected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(yearWise)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([year, stats]) => (
                      <TableRow key={year}>
                        <TableCell className="font-medium">{year}</TableCell>
                        <TableCell className="text-right text-green-600">{stats.paid_count}</TableCell>
                        <TableCell className="text-right text-orange-600">{stats.unpaid_count}</TableCell>
                        <TableCell className="text-right">
                          ₹{stats.collected_amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{stats.pending_amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{stats.expected_amount.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConsolidationPanel;