import { StudentRecord, YearSummary, RoomWiseData, OverallSummary } from "@/types/hostel";

// Mock student data
export const mockStudentData: StudentRecord[] = Array.from({ length: 831 }, (_, i) => {
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "DP 2nd Year", "DP 3rd Year"];
  const year = years[Math.floor(i / 139)]; // Distribute across years
  const isPaid = Math.random() > 0.2; // 80% payment rate
  
  return {
    sno: i + 1,
    fc: `FC${1000 + i}`,
    room: `${Math.floor(Math.random() * 5) + 1}${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
    rollNo: `21A${String(1000 + i).slice(-4)}`,
    name: `Student ${i + 1}`,
    phoneNo: `98${String(10000000 + i).slice(-8)}`,
    refNo: isPaid ? `REF${String(10000 + i).slice(-5)}` : "",
    date: isPaid ? new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString() : "",
    paid: isPaid,
    amount: isPaid ? 2750 : 0,
    remarks: isPaid ? "Paid" : "Pending",
    block: `Block ${String.fromCharCode(65 + Math.floor(i / 166))}`,
    year,
  };
});

// Calculate year summaries
export const calculateYearSummaries = (): YearSummary[] => {
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "DP 2nd Year", "DP 3rd Year"];
  
  return years.map(year => {
    const yearData = mockStudentData.filter(s => s.year === year);
    const paid = yearData.filter(s => s.paid).length;
    const total = yearData.length;
    const amountCollected = yearData.reduce((sum, s) => sum + s.amount, 0);
    
    return {
      year,
      total,
      paid,
      unpaid: total - paid,
      amountCollected,
      percentagePaid: total > 0 ? (paid / total) * 100 : 0,
    };
  });
};

// Calculate overall summary
export const calculateOverallSummary = (): OverallSummary => {
  const total = mockStudentData.length;
  const paid = mockStudentData.filter(s => s.paid).length;
  const totalCollected = mockStudentData.reduce((sum, s) => sum + s.amount, 0);
  const pendingAmount = (total - paid) * 2750;
  
  return {
    totalStudents: total,
    paidStudents: paid,
    unpaidStudents: total - paid,
    totalCollected,
    pendingAmount,
    percentagePaid: (paid / total) * 100,
  };
};

// Calculate room-wise data for a specific year
export const calculateRoomWiseData = (year: string): RoomWiseData[] => {
  const yearData = mockStudentData.filter(s => s.year === year);
  const roomMap = new Map<string, RoomWiseData>();
  
  yearData.forEach(student => {
    if (!roomMap.has(student.room)) {
      roomMap.set(student.room, {
        room: student.room,
        paidCount: 0,
        unpaidCount: 0,
        amountCollected: 0,
      });
    }
    
    const roomData = roomMap.get(student.room)!;
    if (student.paid) {
      roomData.paidCount++;
      roomData.amountCollected += student.amount;
    } else {
      roomData.unpaidCount++;
    }
  });
  
  return Array.from(roomMap.values()).sort((a, b) => a.room.localeCompare(b.room));
};
