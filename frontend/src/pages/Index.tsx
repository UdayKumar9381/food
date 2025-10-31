import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import RoomWiseChart from "@/components/dashboard/RoomWiseChart";
import YearRadiometer from "@/components/dashboard/YearRadiometer";
import ConsolidationPanel from "@/components/dashboard/ConsolidationPanel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type {
  SummaryData,
  RoomWiseData,
  YearWiseData,
  SheetsListData,
} from "@/lib/api";
import { IndianRupee, Users, CheckCircle2, Clock } from "lucide-react";

const Index = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [roomwiseData, setRoomwiseData] = useState<RoomWiseData | null>(null);
  const [yearwiseData, setYearwiseData] = useState<YearWiseData | null>(null);
  const [sheetsList, setSheetsList] = useState<SheetsListData | null>(null);

  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    {
      sheetName,
      isRefresh = false,
    }: {
      sheetName?: string;
      isRefresh?: boolean;
    } = {}
  ) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      const [summary, roomwise, yearwise, sheets] = await Promise.all([
        api.getSummary(sheetName || undefined),
        api.getRoomwise(sheetName || undefined),
        api.getYearwise(sheetName || undefined),
        api.getSheets(),
      ]);

      setSummaryData(summary);
      setRoomwiseData(roomwise);
      setYearwiseData(yearwise);
      setSheetsList(sheets);
      setSelectedSheet((prev) => prev || sheets.default_sheet || "");
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch data from server"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () =>
    fetchData({ sheetName: selectedSheet || undefined, isRefresh: true });

  const handleSheetChange = (sheet: string) => {
    setSelectedSheet(sheet);
    fetchData({ sheetName: sheet || undefined, isRefresh: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription className="flex justify-between items-center">
              <span>❌ {error}</span>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!summaryData || !roomwiseData || !yearwiseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />
        <main className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>No data available</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const roomwiseArray = Object.entries(roomwiseData.room_wise).map(
    ([room, stats]) => ({
      room,
      ...stats,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
        sheets={
          sheetsList
            ? {
                sheets: sheetsList.available_sheets.map((sheet) => ({
                  id: sheet.id.toString(),
                  name: sheet.name,
                })),
              }
            : null
        }
        selectedSheet={selectedSheet}
        onSheetChange={handleSheetChange}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 {summaryData.sheet}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Food Fee Collection Report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={summaryData.total_students.toString()}
            subtitle="Enrolled"
            icon={Users}
          />
          <StatsCard
            title="Collected Amount"
            value={`₹${summaryData.total_paid_amount.toLocaleString("en-IN")}`}
            subtitle={`${summaryData.paid_count} paid`}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Pending Amount"
            value={`₹${summaryData.pending_amount.toLocaleString("en-IN")}`}
            subtitle={`${summaryData.unpaid_count} unpaid`}
            icon={Clock}
          />
          <StatsCard
            title="Expected Total"
            value={`₹${summaryData.expected_total.toLocaleString("en-IN")}`}
            subtitle="Total dues"
            icon={IndianRupee}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RoomWiseChart data={roomwiseArray} />
          <YearRadiometer years={yearwiseData.year_wise} />
        </div>

        <ConsolidationPanel
          summary={summaryData}
          roomWise={roomwiseData.room_wise}
          yearWise={yearwiseData.year_wise}
        />
      </main>
    </div>
  );
};

export default Index;
