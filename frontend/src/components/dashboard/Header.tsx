import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
  sheets?: { sheets: { id: string; name: string }[] } | null;
  selectedSheet?: string;
  onSheetChange?: (sheetName: string) => void;
}

const Header = ({
  lastUpdated,
  onRefresh,
  isRefreshing,
  sheets,
  selectedSheet,
  onSheetChange,
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title + Last Updated */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🏫 KBH Food Report
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          {/* Sheet Selector + Refresh Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {sheets?.sheets?.length ? (
              <select
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSheet || ""}
                onChange={(e) => onSheetChange?.(e.target.value)}
              >
                <option value="">Select Sheet</option>
                {sheets.sheets.map((sheet) => (
                  <option key={sheet.id} value={sheet.name}>
                    {sheet.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-400 text-sm">No sheets found</span>
            )}

            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
