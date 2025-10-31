// API Response Types
export interface SummaryStats {
  sheet: string;
  total_students: number;
  paid_count: number;
  unpaid_count: number;
  total_paid_amount: number;
  pending_amount: number;
  expected_total: number;
}

export interface RoomStats {
  paid_count: number;
  unpaid_count: number;
  paid_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface RoomWiseStats {
  sheet: string;
  room_wise: {
    [room: string]: RoomStats;
  };
}

export interface YearStats {
  paid_count: number;
  unpaid_count: number;
  collected_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface YearWiseStats {
  sheet: string;
  year_wise: {
    [year: string]: YearStats;
  };
}

export interface SheetInfo {
  name: string;
  id: number;
}

export interface AvailableSheets {
  spreadsheet_id: string;
  default_sheet: string;
  available_sheets: SheetInfo[];
  total_sheets: number;
}

// Component Props Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export interface DashboardData {
  summary: SummaryStats | null;
  roomwise: RoomWiseStats | null;
  yearwise: YearWiseStats | null;
  loading: boolean;
  error: string | null;
  currentSheet: string;
}