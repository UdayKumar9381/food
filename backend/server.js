require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5173;
const SPREADSHEET_ID = "1xzJ_GRoB-EiEcULuUd9KslUhBet5XkCYZvQAtTey9Jc";

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://hostel-fees-insight.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Global variables
let sheetsAPI = null;
let credentials = null;

// Month names
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

// Generate valid sheets (JANUARY 2023 - DECEMBER 2025)
const VALID_SHEETS = [];
for (let year = 2023; year <= 2025; year++) {
  for (const month of MONTH_NAMES) {
    VALID_SHEETS.push(`${month} ${year}`);
  }
}

// Initialize Google Sheets API
async function initializeAuth() {
  try {
    console.log("🔐 Initializing Google Sheets authentication...");

    // Try environment variable first
    if (process.env.GOOGLE_CREDENTIALS) {
      console.log("🔍 Loading credentials from environment variable...");
      const credentialsJson = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      
      const auth = new google.auth.GoogleAuth({
        credentials: credentialsJson,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      credentials = credentialsJson;
      const authClient = await auth.getClient();
      sheetsAPI = google.sheets({ version: "v4", auth: authClient });
      console.log("✅ Loaded credentials from environment variable");
    } else {
      // Load from file
      console.log("🔍 Loading credentials from file...");
      const credentialsPath = path.join(__dirname, "config", "kbhfoodreport-ae688541f8a0.json");
      const keyFilePath = path.resolve(credentialsPath);
      
      if (!fs.existsSync(keyFilePath)) {
        throw new Error(`Credentials file not found at: ${keyFilePath}`);
      }

      const credentialsJson = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
      
      const auth = new google.auth.GoogleAuth({
        credentials: credentialsJson,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      credentials = credentialsJson;
      const authClient = await auth.getClient();
      sheetsAPI = google.sheets({ version: "v4", auth: authClient });
      console.log("✅ Loaded credentials from file (local)");
    }

    if (!credentials) {
      throw new Error("Failed to load credentials");
    }

    console.log(`📧 Service account: ${credentials.client_email}`);
    console.log("✅ Google Sheets API initialized successfully");

    return sheetsAPI;
  } catch (error) {
    console.error("❌ Failed to load credentials:", error.message);
    throw error;
  }
}

// Utility: Get current month sheet name
function getCurrentMonthSheet() {
  const now = new Date();
  const month = MONTH_NAMES[now.getMonth()];
  const year = now.getFullYear();
  return `${month} ${year}`;
}

// Utility: Resolve sheet name
function resolveSheetName(sheet) {
  const sheetName = (sheet || "").trim().toUpperCase();
  
  if (!sheetName) {
    return getCurrentMonthSheet();
  }

  if (!VALID_SHEETS.includes(sheetName)) {
    throw new Error(
      `Invalid sheet name '${sheet}'. Must be between JANUARY 2023 and DECEMBER 2025.`
    );
  }

  return sheetName;
}

// Utility: Get sheet data
async function getSheetData(sheetName) {
  try {
    if (!sheetsAPI) {
      throw new Error("Sheets API not initialized");
    }

    const result = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:M`,
    });

    const values = result.data.values || [];

    if (!values || values.length < 2) {
      throw new Error(`No data found in '${sheetName}'`);
    }

    const headers = values[0].map(h => h.trim().toUpperCase());
    const dataRows = values.slice(1);

    // Helper to get value from row
    const getVal = (row, keys, defaultVal = "") => {
      for (const key of keys) {
        const index = headers.indexOf(key);
        if (index !== -1 && row[index]) {
          return row[index].trim();
        }
      }
      return defaultVal;
    };

    // Process rows
    const cleaned = [];
    for (const row of dataRows) {
      const amountStr = getVal(row, ["AMOUNT"], "0");
      let amount = 0.0;
      try {
        amount = parseFloat(amountStr) || 0.0;
      } catch (e) {
        amount = 0.0;
      }

      const record = {
        ROOM: getVal(row, ["ROOM"]),
        PAID: getVal(row, ["PAID"]).toUpperCase(),
        AMOUNT: amount,
        YEAR: getVal(row, ["YEAR"]),
      };

      if (record.ROOM) {
        cleaned.push(record);
      }
    }

    console.log(`✅ Loaded ${cleaned.length} rows from ${sheetName}`);
    return cleaned;
  } catch (error) {
    console.error(`❌ Error in getSheetData(${sheetName}):`, error.message);
    throw error;
  }
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "KBH Food Report Backend Running ✅",
    status: "healthy",
    credentials_loaded: credentials !== null,
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    if (!sheetsAPI) {
      throw new Error("Sheets API not initialized");
    }
    res.json({
      status: "healthy",
      credentials: "valid",
      sheets_api: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

// List sheets
app.get("/sheets", async (req, res) => {
  try {
    if (!sheetsAPI) {
      throw new Error("Sheets API not initialized");
    }

    const spreadsheet = await sheetsAPI.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheets = spreadsheet.data.sheets || [];
    const availableSheets = sheets
      .map(s => ({
        name: s.properties.title,
        id: s.properties.sheetId,
      }))
      .filter(s => VALID_SHEETS.includes(s.name));

    const currentSheet = getCurrentMonthSheet();

    console.log(`📄 Available valid sheets: ${availableSheets.map(s => s.name)}`);
    console.log(`🎯 Default (current) sheet: ${currentSheet}`);

    res.json({
      spreadsheet_id: SPREADSHEET_ID,
      default_sheet: currentSheet,
      available_sheets: availableSheets,
      valid_range: "JANUARY 2023 - DECEMBER 2025",
      total_sheets: availableSheets.length,
    });
  } catch (error) {
    console.error("❌ Error in /sheets:", error.message);
    res.status(500).json({ error: `Metadata error: ${error.message}` });
  }
});

// Summary endpoint
app.get("/summary", async (req, res) => {
  try {
    const sheetName = resolveSheetName(req.query.sheet);
    const data = await getSheetData(sheetName);

    const totalStudents = data.length;
    const paid = data.filter(d => d.PAID === "PAID");
    const paidCount = paid.length;
    const unpaidCount = totalStudents - paidCount;
    const totalPaidAmount = paid.reduce((sum, d) => sum + d.AMOUNT, 0);
    const expectedTotal = data.reduce((sum, d) => sum + d.AMOUNT, 0);
    const pendingAmount = Math.max(expectedTotal - totalPaidAmount, 0);

    res.json({
      sheet: sheetName,
      total_students: totalStudents,
      paid_count: paidCount,
      unpaid_count: unpaidCount,
      total_paid_amount: totalPaidAmount,
      pending_amount: pendingAmount,
      expected_total: expectedTotal,
    });
  } catch (error) {
    console.error("❌ Summary error:", error.message);
    res.status(500).json({ error: `Summary error: ${error.message}` });
  }
});

// Roomwise endpoint
app.get("/roomwise", async (req, res) => {
  try {
    const sheetName = resolveSheetName(req.query.sheet);
    const data = await getSheetData(sheetName);

    const roomSummary = {};
    for (const row of data) {
      const room = row.ROOM;
      if (!room) continue;

      const paid = row.PAID === "PAID";
      const amount = row.AMOUNT;

      if (!roomSummary[room]) {
        roomSummary[room] = {
          paid_count: 0,
          unpaid_count: 0,
          paid_amount: 0.0,
          pending_amount: 0.0,
          expected_amount: 0.0,
        };
      }

      roomSummary[room].expected_amount += amount;
      if (paid) {
        roomSummary[room].paid_count += 1;
        roomSummary[room].paid_amount += amount;
      } else {
        roomSummary[room].unpaid_count += 1;
      }
    }

    for (const room in roomSummary) {
      const val = roomSummary[room];
      val.pending_amount = Math.max(val.expected_amount - val.paid_amount, 0);
    }

    res.json({
      sheet: sheetName,
      room_wise: roomSummary,
    });
  } catch (error) {
    console.error("❌ Roomwise error:", error.message);
    res.status(500).json({ error: `Roomwise error: ${error.message}` });
  }
});

// Yearwise endpoint
app.get("/yearwise", async (req, res) => {
  try {
    const sheetName = resolveSheetName(req.query.sheet);
    const data = await getSheetData(sheetName);

    const yearSummary = {};
    for (const row of data) {
      const year = row.YEAR;
      if (!year) continue;

      const paid = row.PAID === "PAID";
      const amount = row.AMOUNT;

      if (!yearSummary[year]) {
        yearSummary[year] = {
          paid_count: 0,
          unpaid_count: 0,
          collected_amount: 0.0,
          pending_amount: 0.0,
          expected_amount: 0.0,
        };
      }

      yearSummary[year].expected_amount += amount;
      if (paid) {
        yearSummary[year].paid_count += 1;
        yearSummary[year].collected_amount += amount;
      } else {
        yearSummary[year].unpaid_count += 1;
      }
    }

    for (const year in yearSummary) {
      const val = yearSummary[year];
      val.pending_amount = Math.max(val.expected_amount - val.collected_amount, 0);
    }

    res.json({
      sheet: sheetName,
      year_wise: yearSummary,
    });
  } catch (error) {
    console.error("❌ Yearwise error:", error.message);
    res.status(500).json({ error: `Yearwise error: ${error.message}` });
  }
});

// Debug: Columns
app.get("/debug/columns", async (req, res) => {
  try {
    const sheetName = resolveSheetName(req.query.sheet);
    
    const result = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:M1`,
    });

    const headers = result.data.values ? result.data.values[0] : [];
    res.json({
      sheet: sheetName,
      columns: headers,
      column_count: headers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug: Sample
app.get("/debug/sample", async (req, res) => {
  try {
    const sheetName = resolveSheetName(req.query.sheet);
    const data = await getSheetData(sheetName);

    const paidDist = {};
    for (const row of data) {
      const paidStatus = row.PAID;
      paidDist[paidStatus] = (paidDist[paidStatus] || 0) + 1;
    }

    res.json({
      sheet: sheetName,
      sample_rows: data.slice(0, 5),
      paid_distribution: paidDist,
      total_rows: data.length,
      columns: data.length > 0 ? Object.keys(data[0]) : [],
    });
  } catch (error) {
    console.error("❌ Debug sample error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      "/",
      "/health",
      "/sheets",
      "/summary",
      "/roomwise",
      "/yearwise",
      "/debug/columns",
      "/debug/sample",
    ],
  });
});

// Start server
(async () => {
  try {
    await initializeAuth();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

module.exports = app;