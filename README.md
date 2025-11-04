# 🏨 Hostel Fees Insight

A comprehensive hostel fee management system that provides real-time insights into payment statistics, room-wise analysis, and year-wise trends. Built with React, TypeScript, and Express.js, integrated with Google Sheets for data management.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://food-sigma-rosy.vercel.app)
[![Backend API](https://img.shields.io/badge/API-active-blue)](https://your-backend.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

- 📊 **Real-time Dashboard** - Live statistics on payment collection
- 🏠 **Room-wise Analysis** - Track payments by room/hostel block
- 📅 **Year-wise Trends** - Analyze payment patterns by academic year
- 📈 **Interactive Charts** - Visual representation using Recharts
- 🔄 **Monthly Sheets** - Switch between different months (Jan 2023 - Dec 2025)
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Secure API** - Google Sheets integration with service account

## 🚀 Live Demo

- **Frontend**: [https://food-sigma-rosy.vercel.app](https://food-sigma-rosy.vercel.app)
- **Backend API**: [https://your-backend.onrender.com](https://your-backend.onrender.com)

> ⚠️ **Note**: First load may take 30-60 seconds due to backend cold start on free tier hosting.

## 📸 Screenshots

![Dashboard Screenshot]()
*Main dashboard showing payment statistics*

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Fetch API
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Integration**: Google Sheets API (googleapis)
- **Authentication**: Google Service Account
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
hostel-fees-insight/
├── backend/                    # Express.js API server
│   ├── config/                # Configuration files
│   │   └── kbhfoodreport-*.json  # Google service account (gitignored)
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .gitignore
│
├── frontend/                   # React + TypeScript frontend
│   ├── public/                # Static assets
│   │   ├── favicon.ico
│   │   ├── hostel.png
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   │   ├── ConsolidationPanel.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── RoomWiseChart.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── YearRadiometer.tsx
│   │   │   └── ui/            # shadcn/ui components (50+ components)
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Index.tsx      # Main dashboard page
│   │   │   └── NotFound.tsx   # 404 page
│   │   │
│   │   ├── lib/               # Utilities
│   │   │   ├── api.ts         # API client
│   │   │   └── utils.ts       # Helper functions
│   │   │
│   │   ├── types/             # TypeScript types
│   │   │   └── hostel.ts
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── data/              # Mock data
│   │   │   └── mockData.ts
│   │   │
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   │
│   ├── components.json        # shadcn/ui config
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript config
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn or bun
- Google Cloud Project with Sheets API enabled
- Service account JSON key file

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hostel-fees-insight.git
cd hostel-fees-insight
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create config directory
mkdir config

# Add your Google service account JSON file
# Place it in: backend/config/kbhfoodreport-*.json

# Create .env file (optional)
touch .env

# Start the server
npm start
```

**Backend runs on**: `http://localhost:8002`

#### Environment Variables (Optional)
Create `backend/.env`:
```env
PORT=8002
GOOGLE_CREDENTIALS=<base64_encoded_json_or_raw_json>
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env

# Add backend API URL
echo "VITE_API_URL=http://localhost:8002" > .env

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

### 4. Google Sheets Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Download the JSON key file

4. **Share Google Sheet**
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (from JSON file)
   - Give "Viewer" access

5. **Update Spreadsheet ID**
   - Get your spreadsheet ID from the URL
   - Update in `backend/server.js`:
   ```javascript
   const SPREADSHEET_ID = "your-spreadsheet-id-here";
   ```

## 🚀 Deployment

### Deploy Backend to Render

1. Create account on [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variable:
   - **Key**: `GOOGLE_CREDENTIALS`
   - **Value**: Your service account JSON (as string or base64)
6. Deploy!

### Deploy Frontend to Vercel

1. Create account on [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com`
6. Deploy!

## 📚 API Documentation

### Base URL
```
http://localhost:8002
```

### Endpoints

#### `GET /`
Health check endpoint
```json
{
  "message": "KBH Food Report Backend Running ✅",
  "status": "healthy",
  "credentials_loaded": true
}
```

#### `GET /summary?sheet=OCTOBER 2025`
Get summary statistics for a specific month
```json
{
  "sheet": "OCTOBER 2025",
  "total_students": 150,
  "paid_count": 120,
  "unpaid_count": 30,
  "total_paid_amount": 450000,
  "pending_amount": 112500,
  "expected_total": 562500
}
```

#### `GET /roomwise?sheet=OCTOBER 2025`
Get room-wise payment analysis
```json
{
  "sheet": "OCTOBER 2025",
  "room_wise": {
    "A101": {
      "paid_count": 3,
      "unpaid_count": 1,
      "paid_amount": 11250,
      "pending_amount": 3750,
      "expected_amount": 15000
    }
  }
}
```

#### `GET /yearwise?sheet=OCTOBER 2025`
Get year-wise payment analysis
```json
{
  "sheet": "OCTOBER 2025",
  "year_wise": {
    "2023": {
      "paid_count": 40,
      "unpaid_count": 10,
      "collected_amount": 150000,
      "pending_amount": 37500,
      "expected_amount": 187500
    }
  }
}
```

#### `GET /sheets`
List all available sheets
```json
{
  "spreadsheet_id": "1xzJ_GRoB-EiEcULuUd9KslUhBet5XkCYZvQAtTey9Jc",
  "default_sheet": "NOVEMBER 2025",
  "available_sheets": [
    {"name": "JANUARY 2023", "id": 0},
    {"name": "FEBRUARY 2023", "id": 1}
  ],
  "valid_range": "JANUARY 2023 - DECEMBER 2025",
  "total_sheets": 36
}
```

## ⚙️ Configuration

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🐛 Known Issues

### Cold Start Delay (60 seconds)
The backend on Render's free tier spins down after 15 minutes of inactivity, causing the first request to take ~60 seconds.

**Solutions**:
1. Use [UptimeRobot](https://uptimerobot.com) to ping `/health` every 5 minutes
2. Upgrade to Render's paid tier ($7/month)
3. Switch to Railway or Fly.io

See [Issue #1](https://github.com/yourusername/hostel-fees-insight/issues/1) for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername]([https://github.com/UdayKumar9381/])
- LinkedIn: [Your Profile](https://linkedin.com/in/narapureddi-uday-kumar-523551262)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Recharts](https://recharts.org) for interactive charts
- [Google Sheets API](https://developers.google.com/sheets/api) for data integration
- [Render](https://render.com) & [Vercel](https://vercel.com) for hosting

## 📧 Support

For support, email your.email@example.com or open an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**

