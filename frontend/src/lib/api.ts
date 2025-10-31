import axios from "axios";

/* ============ Configuration ============ */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============ Types ============ */
export interface SummaryData {
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

export interface RoomWiseData {
  sheet: string;
  room_wise: Record<string, RoomStats>;
}

export interface YearStats {
  paid_count: number;
  unpaid_count: number;
  collected_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface YearWiseData {
  sheet: string;
  year_wise: Record<string, YearStats>;
}

export interface SheetsListData {
  spreadsheet_id: string;
  default_sheet: string;
  available_sheets: { id: number; name: string }[];
  valid_range: string;
  total_sheets: number;
}

/* ============ API Functions ============ */
export const api = {
  async getSummary(sheet?: string): Promise<SummaryData> {
    const res = await apiClient.get(`/summary${sheet ? `?sheet=${sheet}` : ""}`);
    return res.data;
  },

  async getRoomwise(sheet?: string): Promise<RoomWiseData> {
    const res = await apiClient.get(`/roomwise${sheet ? `?sheet=${sheet}` : ""}`);
    return res.data;
  },

  async getYearwise(sheet?: string): Promise<YearWiseData> {
    const res = await apiClient.get(`/yearwise${sheet ? `?sheet=${sheet}` : ""}`);
    return res.data;
  },

  async getSheets(): Promise<SheetsListData> {
    const res = await apiClient.get("/sheets");
    return res.data;
  },

  async getDebugSample(sheet?: string) {
    const res = await apiClient.get(`/debug/sample${sheet ? `?sheet=${sheet}` : ""}`);
    return res.data;
  },
};
