import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Calendar, Clock, Users, BookOpen, ChevronRight, ChevronLeft, Check, AlertCircle, Target, CalendarDays, ArrowLeft, ArrowRight, FileSpreadsheet, Lock, GripVertical, Coffee, Box, Gift } from 'lucide-react';
import * as XLSX from 'xlsx';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// RLM Calendar Data with EB/BTE windows identified
const RLM_EVENTS_DATA = {
  '2025-09': [
    { date: 1, title: 'First Community Meeting', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 4, title: 'First Day of Classes', category: 'academic', selectable: false },
    { date: 6, title: 'Open EB StarRez Report #1', category: 'eb-open', selectable: false, reportNum: 1 },
    { date: 7, title: 'Community Meeting #2', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 8, title: 'Community Connection #1 Due', category: 'connection', selectable: false },
    { date: 12, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 14, title: 'Open BTE StarRez Report #1', category: 'bte-open', selectable: false, reportNum: 1 },
    { date: 15, title: 'Roommate Agreements Due (trad)', category: 'admin', selectable: false },
    { date: 19, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 21, title: 'Close EB StarRez Report #1', category: 'eb-close', selectable: false, reportNum: 1 },
    { date: 22, title: 'Roommate Agreements Due (apt)', category: 'admin', selectable: false },
    { date: 26, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 28, title: 'Community Meeting #3', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 30, title: 'Truth & Reconciliation Day', category: 'holiday', selectable: false },
  ],
  '2025-10': [
    { date: 4, title: 'Head of the Trent Regatta', category: 'event', selectable: false },
    { date: 5, title: 'Close BTE StarRez Report #1', category: 'bte-close', selectable: false, reportNum: 1 },
    { date: 12, title: 'Community Connection #2 Due', category: 'connection', selectable: false },
    { date: 13, title: 'Thanksgiving (Closed)', category: 'holiday', selectable: false },
    { date: 17, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 19, title: 'Open EB StarRez Report #2', category: 'eb-open', selectable: false, reportNum: 2 },
    { date: 19, title: 'Open BTE StarRez Report #2', category: 'bte-open', selectable: false, reportNum: 2 },
    { date: 20, title: 'Reading Week Begins', category: 'break', selectable: false },
    { date: 23, title: 'Term Poster Turnover Due', category: 'admin', selectable: false },
    { date: 26, title: 'Community Meeting #4', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 27, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 31, title: 'Haunted Drumlin', category: 'event', selectable: true, defaultSelected: false, hours: 3 },
  ],
  '2025-11': [
    { date: 6, title: 'Close BTE StarRez Report #2', category: 'bte-close', selectable: false, reportNum: 2 },
    { date: 7, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 8, title: 'Indigenous Veterans Day', category: 'holiday', selectable: false },
    { date: 11, title: 'Remembrance Day', category: 'holiday', selectable: false },
    { date: 14, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 21, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 28, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 30, title: 'Community Meeting #5', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
  ],
  '2025-12': [
    { date: 3, title: 'Last Day of Classes', category: 'academic', selectable: false },
    { date: 3, title: 'Close EB StarRez Report #2', category: 'eb-close', selectable: false, reportNum: 2 },
    { date: 5, title: 'Exam Period Begins', category: 'academic', selectable: false },
    { date: 18, title: 'Exam Period Ends', category: 'academic', selectable: false },
    { date: 19, title: 'Room Checks', category: 'admin', selectable: true, defaultSelected: true, hours: 2 },
    { date: 20, title: 'Winter Break Begins', category: 'break', selectable: false },
  ],
  '2026-01': [
    { date: 4, title: 'Student Welcome Session', category: 'event', selectable: true, defaultSelected: true, hours: 2 },
    { date: 5, title: 'Winter Move In', category: 'event', selectable: true, defaultSelected: true, hours: 3 },
    { date: 5, title: 'Open EB StarRez Report #3', category: 'eb-open', selectable: false, reportNum: 3 },
    { date: 7, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 11, title: 'Community Meeting #6', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 12, title: 'Open BTE StarRez Report #3', category: 'bte-open', selectable: false, reportNum: 3 },
    { date: 16, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 19, title: 'Community Connection #3 Due', category: 'connection', selectable: false },
    { date: 23, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 26, title: 'Close EB StarRez Report #3', category: 'eb-close', selectable: false, reportNum: 3 },
    { date: 30, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
  ],
  '2026-02': [
    { date: 6, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 8, title: 'Community Meeting #7', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 9, title: 'Open EB StarRez Report #4', category: 'eb-open', selectable: false, reportNum: 4 },
    { date: 9, title: 'Close BTE StarRez Report #3', category: 'bte-close', selectable: false, reportNum: 3 },
    { date: 13, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 14, title: "Valentine's Day", category: 'holiday', selectable: false },
    { date: 16, title: 'Family Day (Closed)', category: 'holiday', selectable: false },
    { date: 16, title: 'Reading Week Begins', category: 'break', selectable: false },
    { date: 23, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 23, title: 'Open BTE StarRez Report #4', category: 'bte-open', selectable: false, reportNum: 4 },
    { date: 27, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
  ],
  '2026-03': [
    { date: 6, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 8, title: 'Community Meeting #8', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 9, title: 'Community Connection #4 Due', category: 'connection', selectable: false },
    { date: 13, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 20, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 27, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false, hours: 2 },
    { date: 29, title: 'Community Meeting #9', category: 'meeting', selectable: true, defaultSelected: true, hours: 0.5 },
    { date: 30, title: 'Close EB StarRez Report #4', category: 'eb-close', selectable: false, reportNum: 4 },
    { date: 30, title: 'Close BTE StarRez Report #4', category: 'bte-close', selectable: false, reportNum: 4 },
  ],
  '2026-04': [
    { date: 3, title: 'Good Friday (Closed)', category: 'holiday', selectable: false },
    { date: 7, title: 'Last Day of Classes', category: 'academic', selectable: false },
    { date: 10, title: 'Exam Period Begins', category: 'academic', selectable: false },
    { date: 23, title: 'Exam Period Ends', category: 'academic', selectable: false },
    { date: 30, title: 'Room Checks', category: 'admin', selectable: true, defaultSelected: true, hours: 2 },
    { date: 30, title: 'Residence Closed', category: 'event', selectable: false },
  ],
};

// Extract EB and BTE windows from RLM data
const getEBBTEWindows = () => {
  const ebWindows = [];
  const bteWindows = [];
  
  const allEvents = [];
  Object.entries(RLM_EVENTS_DATA).forEach(([monthKey, events]) => {
    const [year, month] = monthKey.split('-').map(Number);
    events.forEach(event => {
      allEvents.push({ ...event, year, month: month - 1, monthKey });
    });
  });
  
  // Find EB windows
  for (let i = 1; i <= 4; i++) {
    const open = allEvents.find(e => e.category === 'eb-open' && e.reportNum === i);
    const close = allEvents.find(e => e.category === 'eb-close' && e.reportNum === i);
    if (open && close) {
      ebWindows.push({
        num: i,
        openDate: new Date(open.year, open.month, open.date),
        closeDate: new Date(close.year, close.month, close.date),
        openStr: `${MONTHS[open.month]} ${open.date}, ${open.year}`,
        closeStr: `${MONTHS[close.month]} ${close.date}, ${close.year}`,
      });
    }
  }
  
  // Find BTE windows
  for (let i = 1; i <= 4; i++) {
    const open = allEvents.find(e => e.category === 'bte-open' && e.reportNum === i);
    const close = allEvents.find(e => e.category === 'bte-close' && e.reportNum === i);
    if (open && close) {
      bteWindows.push({
        num: i,
        openDate: new Date(open.year, open.month, open.date),
        closeDate: new Date(close.year, close.month, close.date),
        openStr: `${MONTHS[open.month]} ${open.date}, ${open.year}`,
        closeStr: `${MONTHS[close.month]} ${close.date}, ${close.year}`,
      });
    }
  }
  
  return { ebWindows, bteWindows };
};

const MEETING_TYPES = [
  { id: 'team', name: 'Team Meeting', frequency: 'Weekly', duration: 1, color: '#86c5b8' },
  { id: 'senior', name: 'Senior Don 1:1', frequency: 'Monthly', duration: 0.5, color: '#b8a9c9' },
  { id: 'rlc', name: 'RLC Meeting', frequency: 'Bi-weekly', duration: 0.5, color: '#e8c4a0' },
];

const BLOCK_COLORS = {
  class: { bg: '#a8c5e2', text: '#1e3a5f' },
  dod: { bg: '#f5d5a0', text: '#5d4e37' },
  fnh: { bg: '#e8b4c8', text: '#5c3d4a' },
  meeting: { bg: '#9dd5c8', text: '#2d4a44' },
  breakfast: { bg: '#f0e6d3', text: '#6b5a45' },
  lunch: { bg: '#d4e8d4', text: '#3d5c3d' },
  dinner: { bg: '#e8d4d4', text: '#5c3d3d' },
  eb: { bg: '#ffd699', text: '#664400' },
  bte: { bg: '#d4b8e8', text: '#4a2d5c' },
};

export default function DonScheduler() {
  const [step, setStep] = useState(1);
  
  // Class schedule
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '', day: 'Monday', startTime: '9', endTime: '10' });
  const [uploadStatus, setUploadStatus] = useState('');
  
  // DOD shifts
  const [dodShifts, setDodShifts] = useState([]);
  const [newDodDay, setNewDodDay] = useState('Monday');
  
  // Meetings
  const [meetings, setMeetings] = useState({ team: [], senior: [], rlc: [] });
  const [newMeeting, setNewMeeting] = useState({ type: 'team', day: 'Monday', time: '19:00' });
  
  // EB and BTE planned events
  const [ebEvents, setEbEvents] = useState([]);
  const [bteEvents, setBteEvents] = useState([]);
  const [newEB, setNewEB] = useState({ windowNum: 1, date: '', hours: 2 });
  const [newBTE, setNewBTE] = useState({ windowNum: 1, date: '', hours: 2 });
  
  // Community connections
  const [communitySize, setCommunitySize] = useState('');
  const [connectionDeadline, setConnectionDeadline] = useState('');
  
  // RLM Events selection
  const [selectedRLMEvents, setSelectedRLMEvents] = useState(() => {
    const initial = {};
    Object.entries(RLM_EVENTS_DATA).forEach(([monthKey, events]) => {
      events.forEach((event, idx) => {
        const eventId = `${monthKey}-${idx}`;
        initial[eventId] = event.defaultSelected || !event.selectable;
      });
    });
    return initial;
  });
  
  // View state
  const [selectedMonth, setSelectedMonth] = useState({ month: 8, year: 2025 });
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isDraggingClass, setIsDraggingClass] = useState(false);
  
  // Weekly meals
  const [weeklyMeals, setWeeklyMeals] = useState(() => {
    const defaultMeals = {};
    DAYS.forEach(day => {
      defaultMeals[day] = {
        breakfast: { start: 8, duration: 1 },
        lunch: { start: 12, duration: 1 },
        dinner: { start: 18, duration: 1 },
      };
    });
    return defaultMeals;
  });
  
  const [draggedMeal, setDraggedMeal] = useState(null);
  const classInputRef = useRef(null);
  
  const { ebWindows, bteWindows } = getEBBTEWindows();

  // Helper functions
  const parseTimeToHour = (timeStr) => {
    if (!timeStr) return null;
    const cleanTime = timeStr.toString().trim().toUpperCase();
    const match = cleanTime.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!match) return null;
    let hour = parseInt(match[1]);
    const period = match[3];
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const normalizeDay = (dayStr) => {
    if (!dayStr) return null;
    const day = dayStr.toString().trim().toLowerCase();
    const dayMap = {
      'monday': 'Monday', 'mon': 'Monday', 'm': 'Monday',
      'tuesday': 'Tuesday', 'tue': 'Tuesday', 'tu': 'Tuesday', 't': 'Tuesday',
      'wednesday': 'Wednesday', 'wed': 'Wednesday', 'w': 'Wednesday',
      'thursday': 'Thursday', 'thu': 'Thursday', 'th': 'Thursday', 'r': 'Thursday',
      'friday': 'Friday', 'fri': 'Friday', 'f': 'Friday',
      'saturday': 'Saturday', 'sat': 'Saturday', 's': 'Saturday',
      'sunday': 'Sunday', 'sun': 'Sunday', 'u': 'Sunday',
    };
    return dayMap[day] || null;
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        let headerRowIndex = 0;
        let dayCol = -1, startCol = -1, endCol = -1, courseCol = -1;
        
        for (let i = 0; i < Math.min(5, jsonData.length); i++) {
          const row = jsonData[i];
          if (!row) continue;
          for (let j = 0; j < row.length; j++) {
            const cell = (row[j] || '').toString().toLowerCase().trim();
            if (cell.includes('day')) dayCol = j;
            if (cell.includes('start')) startCol = j;
            if (cell.includes('end')) endCol = j;
            if (cell.includes('course') || cell.includes('class') || cell.includes('name')) courseCol = j;
          }
          if (dayCol >= 0 && startCol >= 0 && endCol >= 0) { headerRowIndex = i; break; }
        }
        
        if (dayCol < 0) { dayCol = 0; startCol = 1; endCol = 2; courseCol = 3; headerRowIndex = -1; }
        
        const parsedClasses = [];
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;
          const day = normalizeDay(row[dayCol]);
          const startTime = parseTimeToHour(row[startCol]);
          const endTime = parseTimeToHour(row[endCol]);
          const courseName = courseCol >= 0 ? (row[courseCol] || '').toString().trim() : `Class ${i}`;
          if (day && startTime !== null && endTime !== null && courseName) {
            parsedClasses.push({ id: Date.now() + i, name: courseName, day, startTime: startTime.toString(), endTime: endTime.toString() });
          }
        }
        
        if (parsedClasses.length > 0) {
          setClasses(prev => [...prev, ...parsedClasses]);
          setUploadStatus(`✓ Imported ${parsedClasses.length} classes`);
        } else {
          setUploadStatus('⚠ No classes found. Check file format.');
        }
      } catch (error) {
        setUploadStatus('⚠ Error reading file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClassFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) parseExcelFile(file);
    if (classInputRef.current) classInputRef.current.value = '';
  };

  const handleClassDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDraggingClass(false);
    const file = e.dataTransfer.files[0];
    if (file) parseExcelFile(file);
  };

  const addClass = () => {
    if (newClass.name && parseInt(newClass.startTime) < parseInt(newClass.endTime)) {
      setClasses([...classes, { ...newClass, id: Date.now() }]);
      setNewClass({ name: '', day: 'Monday', startTime: '9', endTime: '10' });
    }
  };

  const addMeeting = () => {
    const meeting = { id: Date.now(), day: newMeeting.day, time: newMeeting.time };
    setMeetings(prev => ({ ...prev, [newMeeting.type]: [...prev[newMeeting.type], meeting] }));
  };

  const addEBEvent = () => {
    if (newEB.date && newEB.hours > 0) {
      setEbEvents([...ebEvents, { ...newEB, id: Date.now() }]);
      setNewEB({ windowNum: newEB.windowNum, date: '', hours: 2 });
    }
  };

  const addBTEEvent = () => {
    if (newBTE.date && newBTE.hours > 0) {
      setBteEvents([...bteEvents, { ...newBTE, id: Date.now() }]);
      setNewBTE({ windowNum: newBTE.windowNum, date: '', hours: 2 });
    }
  };

  const toggleRLMEvent = (eventId) => {
    setSelectedRLMEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const getMonthEvents = (month, year) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const events = RLM_EVENTS_DATA[key] || [];
    return events.map((event, idx) => ({
      ...event,
      id: `${key}-${idx}`,
      selected: selectedRLMEvents[`${key}-${idx}`] ?? event.defaultSelected
    }));
  };

  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    let currentDate = new Date(firstDay);
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentDate.setDate(currentDate.getDate() + diff);
    
    while (currentDate <= lastDay || weeks.length < 1) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({ start: new Date(weekStart), end: new Date(weekEnd), weekNumber: weeks.length + 1 });
      currentDate.setDate(currentDate.getDate() + 7);
      if (weeks.length >= 6) break;
    }
    return weeks;
  };

  // Calculate community connections needed
  const getConnectionsInfo = () => {
    if (!communitySize || !connectionDeadline) return null;
    const size = parseInt(communitySize);
    const deadline = new Date(connectionDeadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
    const dodShiftsPerWeek = dodShifts.length;
    const totalDodShifts = Math.max(1, dodShiftsPerWeek * weeksLeft);
    const connectionsPerShift = Math.ceil(size / totalDodShifts);
    const connectionsPerWeek = Math.ceil(size / weeksLeft);
    
    return { total: size, daysLeft, weeksLeft, perWeek: connectionsPerWeek, perShift: connectionsPerShift, totalShifts: totalDodShifts };
  };

  // Calculate total don hours
  const calculateDonHours = () => {
    let hours = 0;
    
    // DOD (3h each per week)
    hours += dodShifts.length * 3;
    
    // Meetings
    Object.entries(meetings).forEach(([type, list]) => {
      const mt = MEETING_TYPES.find(m => m.id === type);
      hours += list.length * (mt?.duration || 1);
    });
    
    // EB events (total hours / weeks in term ≈ 16 weeks)
    const ebTotalHours = ebEvents.reduce((sum, e) => sum + e.hours, 0);
    hours += ebTotalHours / 16;
    
    // BTE events
    const bteTotalHours = bteEvents.reduce((sum, e) => sum + e.hours, 0);
    hours += bteTotalHours / 16;
    
    // FNH (averaged)
    const fnh = countSelectedByCategory('fnh');
    hours += (fnh * 2) / 16;
    
    return Math.round(hours * 10) / 10;
  };

  // Calculate hours
  const calculateWeeklyHours = () => {
    let classHours = 0;
    let donHours = calculateDonHours();
    let mealHours = 3;
    
    classes.forEach(cls => {
      classHours += parseInt(cls.endTime) - parseInt(cls.startTime);
    });
    
    return { classHours, donHours, mealHours: mealHours * 7, total: classHours + donHours + mealHours * 7 };
  };

  const calculateMonthlyHours = () => {
    const weekly = calculateWeeklyHours();
    return {
      classHours: weekly.classHours * 4,
      donHours: weekly.donHours * 4,
      mealHours: weekly.mealHours * 4,
      total: weekly.total * 4
    };
  };

  const getEventColor = (category) => ({
    meeting: '#9dd5c8', report: '#f5d5a0', fnh: '#e8b4c8', connection: '#c5b3d9',
    admin: '#b8d4e8', academic: '#a8c5e2', event: '#c8e6c9', holiday: '#f0b8b8', break: '#f5e6a3',
    'eb-open': '#ffd699', 'eb-close': '#ffd699', 'bte-open': '#d4b8e8', 'bte-close': '#d4b8e8',
  }[category] || '#888');

  const formatHour = (h) => h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : h === 0 ? '12 AM' : `${h} AM`;
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); const hour = h % 12 || 12; return `${hour}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
  const formatDate = (dateStr) => { if (!dateStr) return ''; const d = new Date(dateStr); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };

  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      if (newMonth < 0) { newMonth = 11; newYear--; }
      return { month: newMonth, year: newYear };
    });
    setSelectedWeek(null);
  };

  const handleMealDragStart = (day, mealType) => { setDraggedMeal({ day, mealType }); };
  const handleMealDrop = (day, hour) => {
    if (!draggedMeal) return;
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: { ...prev[day], [draggedMeal.mealType]: { ...prev[day][draggedMeal.mealType], start: hour } }
    }));
    setDraggedMeal(null);
  };

  const monthEvents = getMonthEvents(selectedMonth.month, selectedMonth.year);
  const weeksInMonth = getWeeksInMonth(selectedMonth.month, selectedMonth.year);
  const monthlyHours = calculateMonthlyHours();
  const weeklyHours = calculateWeeklyHours();
  const connectionsInfo = getConnectionsInfo();

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedMonth.year, selectedMonth.month, 1);
    const lastDay = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
    const days = [];
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    for (let i = 0; i < startDay; i++) days.push({ day: null, events: [], classes: [] });
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(selectedMonth.year, selectedMonth.month, d);
      const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayClasses = classes.filter(c => c.day === dayName);
      const dayEvents = monthEvents.filter(e => e.date === d && (e.selected || !e.selectable));
      
      // Check for EB/BTE events on this day
      const dateStr = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const ebOnDay = ebEvents.filter(e => e.date === dateStr);
      const bteOnDay = bteEvents.filter(e => e.date === dateStr);
      
      days.push({ day: d, events: dayEvents, classes: dayClasses, dayName, ebOnDay, bteOnDay });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const countSelectedByCategory = (category) => {
    return Object.entries(RLM_EVENTS_DATA).reduce((count, [monthKey, events]) => {
      return count + events.filter((e, idx) => e.category === category && selectedRLMEvents[`${monthKey}-${idx}`]).length;
    }, 0);
  };

  const getDayBlocks = (dayName) => {
    const blocks = [];
    
    classes.filter(c => c.day === dayName).forEach(cls => {
      blocks.push({ type: 'class', name: cls.name, start: parseInt(cls.startTime), end: parseInt(cls.endTime), locked: true });
    });
    
    if (dodShifts.includes(dayName)) {
      blocks.push({ type: 'dod', name: 'Don On Duty', start: 20, end: 23, locked: true });
    }
    
    Object.entries(meetings).forEach(([type, list]) => {
      list.filter(m => m.day === dayName).forEach(m => {
        const hour = parseInt(m.time.split(':')[0]);
        const mt = MEETING_TYPES.find(t => t.id === type);
        blocks.push({ type: 'meeting', name: mt?.name || 'Meeting', start: hour, end: hour + 1, locked: true });
      });
    });
    
    const meals = weeklyMeals[dayName];
    if (meals) {
      blocks.push({ type: 'breakfast', name: 'Breakfast', start: meals.breakfast.start, end: meals.breakfast.start + 1, locked: false });
      blocks.push({ type: 'lunch', name: 'Lunch', start: meals.lunch.start, end: meals.lunch.start + 1, locked: false });
      blocks.push({ type: 'dinner', name: 'Dinner', start: meals.dinner.start, end: meals.dinner.start + 1, locked: false });
    }
    
    return blocks;
  };

  // Get current/upcoming EB and BTE windows
  const getCurrentWindows = () => {
    const today = new Date();
    const currentEB = ebWindows.find(w => today >= w.openDate && today <= w.closeDate) || ebWindows.find(w => today < w.openDate);
    const currentBTE = bteWindows.find(w => today >= w.openDate && today <= w.closeDate) || bteWindows.find(w => today < w.openDate);
    return { currentEB, currentBTE };
  };

  const { currentEB, currentBTE } = getCurrentWindows();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1628 0%, #1a2744 50%, #0d1a2d 100%)', fontFamily: "'Outfit', sans-serif", color: '#e8ecf4', padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .glass-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; margin-bottom: 20px; }
        .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: none; padding: 14px 28px; border-radius: 12px; color: white; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
        .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 12px 24px; border-radius: 12px; color: white; font-weight: 500; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .btn-add { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
        .input-field { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: white; font-size: 15px; width: 100%; font-family: inherit; }
        .input-field:focus { outline: none; border-color: #3b82f6; }
        select.input-field option { background: #1a2744; color: white; }
        .tag { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 20px; margin: 4px; font-size: 13px; font-weight: 500; }
        .tag button { background: rgba(255,255,255,0.2); border: none; width: 20px; height: 20px; border-radius: 50%; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .tag.class { background: #a8c5e2; color: #2c3e50; }
        .tag.dod { background: #f5d5a0; color: #5d4e37; }
        .tag.meeting { background: #9dd5c8; color: #2d4a44; }
        .tag.eb { background: #ffd699; color: #664400; }
        .tag.bte { background: #d4b8e8; color: #4a2d5c; }
        .upload-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 16px; padding: 36px; text-align: center; cursor: pointer; transition: all 0.3s; }
        .upload-zone:hover, .upload-zone.dragging { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        .nav-buttons { display: flex; justify-content: space-between; margin-top: 24px; gap: 12px; flex-wrap: wrap; }
        .form-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
        h1 { font-family: 'Fraunces', serif; font-size: 38px; text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .subtitle { text-align: center; opacity: 0.5; margin-bottom: 28px; font-size: 15px; }
        .section-desc { opacity: 0.6; margin-bottom: 18px; font-size: 14px; }
        
        .step-tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; justify-content: center; }
        .step-tab { padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: inherit; font-weight: 500; font-size: 13px; color: rgba(255,255,255,0.6); transition: all 0.2s; }
        .step-tab.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-color: transparent; }
        .step-tab.completed { border-color: #34d399; color: #34d399; }
        
        .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .month-nav-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; }
        
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .calendar-header { text-align: center; font-weight: 600; font-size: 12px; padding: 10px 4px; color: rgba(255,255,255,0.5); }
        .calendar-day { min-height: 85px; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 5px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; overflow: hidden; }
        .calendar-day:hover { background: rgba(255,255,255,0.06); }
        .calendar-day.empty { background: transparent; cursor: default; }
        .calendar-day-number { font-weight: 600; font-size: 12px; margin-bottom: 3px; }
        .calendar-event { font-size: 8px; padding: 2px 4px; border-radius: 3px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
        
        .hours-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 8px; margin: 20px 0; }
        .hours-card { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
        .hours-value { font-size: 22px; font-weight: 700; }
        .hours-label { font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
        
        .week-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; }
        .week-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
        
        .event-select { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .event-select:hover { background: rgba(255,255,255,0.06); }
        .event-select.selected { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); }
        .event-checkbox { width: 20px; height: 20px; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .event-checkbox.checked { background: #3b82f6; border-color: #3b82f6; }
        
        .schedule-grid { display: grid; grid-template-columns: 50px repeat(7, 1fr); gap: 2px; font-size: 11px; }
        .schedule-header { padding: 8px 4px; text-align: center; font-weight: 600; font-size: 11px; background: rgba(255,255,255,0.05); border-radius: 6px; }
        .schedule-time { padding: 4px; text-align: right; font-size: 10px; opacity: 0.5; height: 40px; display: flex; align-items: flex-start; justify-content: flex-end; }
        .schedule-cell { height: 40px; background: rgba(255,255,255,0.02); border-radius: 4px; position: relative; }
        .schedule-cell:hover { background: rgba(255,255,255,0.05); }
        .schedule-block { position: absolute; left: 2px; right: 2px; border-radius: 4px; padding: 3px 5px; font-size: 10px; font-weight: 500; overflow: hidden; display: flex; align-items: center; gap: 4px; z-index: 1; }
        .schedule-block.locked { cursor: default; }
        .schedule-block.draggable { cursor: grab; }
        
        .window-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 18px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.08); }
        .window-card h4 { margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; font-size: 16px; }
        .window-dates { display: flex; gap: 20px; margin-bottom: 14px; font-size: 13px; }
        .window-dates span { opacity: 0.7; }
        .window-dates strong { color: #60a5fa; }
        
        .hidden-input { position: absolute; width: 1px; height: 1px; opacity: 0; }
      `}</style>

      <input type="file" ref={classInputRef} className="hidden-input" accept=".xlsx,.xls,.csv" onChange={handleClassFileSelect} />

      <h1>Don Schedule Manager</h1>
      <p className="subtitle">Plan your month • Track your hours • Balance your life</p>

      <div className="step-tabs">
        <button className={`step-tab ${step === 1 ? 'active' : classes.length > 0 ? 'completed' : ''}`} onClick={() => setStep(1)}>Classes</button>
        <button className={`step-tab ${step === 2 ? 'active' : dodShifts.length > 0 ? 'completed' : ''}`} onClick={() => setStep(2)}>DOD</button>
        <button className={`step-tab ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>Meetings</button>
        <button className={`step-tab ${step === 4 ? 'active' : ''}`} onClick={() => setStep(4)}>RLM Events</button>
        <button className={`step-tab ${step === 5 ? 'active' : ebEvents.length > 0 || bteEvents.length > 0 ? 'completed' : ''}`} onClick={() => setStep(5)}>EB & BTE</button>
        <button className={`step-tab ${step === 6 ? 'active' : ''}`} onClick={() => setStep(6)}>Connections</button>
        <button className={`step-tab ${step === 7 ? 'active' : ''}`} onClick={() => setStep(7)}>Schedule</button>
      </div>

      {/* Step 1: Classes */}
      {step === 1 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><BookOpen size={24} /> Class Schedule</h2>
          <p className="section-desc">Upload from Excel/CSV or add manually</p>
          
          <div className={`upload-zone ${isDraggingClass ? 'dragging' : ''}`} onClick={() => classInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDraggingClass(true); }} onDragLeave={() => setIsDraggingClass(false)} onDrop={handleClassDrop} style={{ marginBottom: 20 }}>
            <FileSpreadsheet size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>Upload Excel or CSV</div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>Day | Start Time | End Time | Course</div>
          </div>

          {uploadStatus && (
            <div style={{ padding: 14, background: uploadStatus.startsWith('✓') ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: 10, marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              {uploadStatus.startsWith('✓') ? <Check size={16} style={{ color: '#34d399' }} /> : <AlertCircle size={16} style={{ color: '#fbbf24' }} />}
              {uploadStatus}
            </div>
          )}
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Or Add Manually</div>
            <div className="form-row">
              <input className="input-field" placeholder="Class name" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} style={{ flex: 1 }} />
              <select className="input-field" value={newClass.day} onChange={e => setNewClass({ ...newClass, day: e.target.value })} style={{ width: 'auto' }}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <select className="input-field" value={newClass.startTime} onChange={e => setNewClass({ ...newClass, startTime: e.target.value })} style={{ width: 'auto' }}>
                {HOURS.slice(0,-1).map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
              </select>
              <span style={{ opacity: 0.5 }}>to</span>
              <select className="input-field" value={newClass.endTime} onChange={e => setNewClass({ ...newClass, endTime: e.target.value })} style={{ width: 'auto' }}>
                {HOURS.slice(1).map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
              </select>
              <button className="btn-add" onClick={addClass}><Plus size={18} /></button>
            </div>
          </div>
          
          {classes.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <span>Classes ({classes.length})</span>
                <button onClick={() => setClasses([])} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {classes.map(cls => (
                  <span key={cls.id} className="tag class">
                    {cls.name} • {cls.day.slice(0,3)} {formatHour(parseInt(cls.startTime))}-{formatHour(parseInt(cls.endTime))}
                    <button onClick={() => setClasses(classes.filter(c => c.id !== cls.id))}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="nav-buttons">
            <div></div>
            <button className="btn-primary" onClick={() => setStep(2)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 2: DOD */}
      {step === 2 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Clock size={24} /> DOD Shifts</h2>
          <p className="section-desc">Which nights do you have Don On Duty? (~3h each, 8-11pm)</p>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <select className="input-field" value={newDodDay} onChange={e => setNewDodDay(e.target.value)} style={{ flex: 1 }}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <button className="btn-add" onClick={() => { if (!dodShifts.includes(newDodDay)) setDodShifts([...dodShifts, newDodDay]); }}><Plus size={18} /> Add</button>
          </div>
          
          {dodShifts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {dodShifts.map(day => (
                <span key={day} className="tag dod">{day}<button onClick={() => setDodShifts(dodShifts.filter(d => d !== day))}>×</button></span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(245,213,160,0.1)', borderRadius: 12 }}>
            <Target size={18} style={{ color: '#f5d5a0' }} /> <strong>Weekly DOD: {dodShifts.length * 3}h</strong> ({dodShifts.length} shifts)
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Meetings */}
      {step === 3 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Users size={24} /> Meetings</h2>
          <p className="section-desc">Add your recurring meetings</p>
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 20 }}>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <select className="input-field" value={newMeeting.type} onChange={e => setNewMeeting({ ...newMeeting, type: e.target.value })} style={{ flex: 1 }}>
                {MEETING_TYPES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select className="input-field" value={newMeeting.day} onChange={e => setNewMeeting({ ...newMeeting, day: e.target.value })} style={{ width: 'auto' }}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="time" className="input-field" value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })} style={{ width: 110 }} />
              <button className="btn-add" onClick={addMeeting}><Plus size={18} /></button>
            </div>
          </div>

          {MEETING_TYPES.map(mt => (
            <div key={mt.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{mt.name} <span style={{ opacity: 0.5, fontWeight: 400 }}>({mt.frequency})</span></div>
              {meetings[mt.id].length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {meetings[mt.id].map(m => (
                    <span key={m.id} className="tag meeting" style={{ background: mt.color }}>
                      {m.day} @ {formatTime(m.time)}
                      <button onClick={() => setMeetings(prev => ({ ...prev, [mt.id]: prev[mt.id].filter(x => x.id !== m.id) }))}>×</button>
                    </span>
                  ))}
                </div>
              ) : <div style={{ fontSize: 13, opacity: 0.5 }}>None added</div>}
            </div>
          ))}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 4: RLM Events */}
      {step === 4 && (
        <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2><CalendarDays size={24} /> RLM Events</h2>
          <p className="section-desc">Select which FNH, meetings, and events you're assigned to</p>
          
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => navigateMonth(-1)}><ArrowLeft size={18} /></button>
            <h3 style={{ margin: 0 }}>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button className="month-nav-btn" onClick={() => navigateMonth(1)}><ArrowRight size={18} /></button>
          </div>

          {monthEvents.filter(e => e.selectable).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No selectable events this month</div>
          ) : (
            monthEvents.filter(e => e.selectable).map(event => (
              <div key={event.id} className={`event-select ${event.selected ? 'selected' : ''}`} onClick={() => toggleRLMEvent(event.id)}>
                <div className={`event-checkbox ${event.selected ? 'checked' : ''}`}>{event.selected && <Check size={14} />}</div>
                <div style={{ width: 50, fontWeight: 600, color: getEventColor(event.category) }}>{MONTHS[selectedMonth.month].slice(0,3)} {event.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{event.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{event.hours || 1}h</div>
                </div>
              </div>
            ))
          )}

          <div style={{ padding: 14, background: 'rgba(59,130,246,0.1)', borderRadius: 12, marginTop: 20 }}>
            <strong>Selected:</strong> {countSelectedByCategory('fnh')} FNH • {countSelectedByCategory('meeting')} Meetings • {countSelectedByCategory('event')} Events
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(3)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(5)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 5: EB & BTE */}
      {step === 5 && (
        <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2><Box size={24} /> EB & BTE Events</h2>
          <p className="section-desc">Plan when you'll do your Event-in-the-Box (EB) and Bring-to-Event (BTE)</p>
          
          {/* EB Section */}
          <div className="window-card" style={{ borderColor: 'rgba(255,214,153,0.3)' }}>
            <h4><Gift size={20} style={{ color: '#ffd699' }} /> Event-in-the-Box (EB)</h4>
            
            {ebWindows.map(window => (
              <div key={window.num} style={{ marginBottom: 16, padding: 14, background: 'rgba(255,214,153,0.1)', borderRadius: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>EB #{window.num}</div>
                <div className="window-dates">
                  <span>Opens: <strong>{window.openStr}</strong></span>
                  <span>Closes: <strong>{window.closeStr}</strong></span>
                </div>
                
                {ebEvents.filter(e => e.windowNum === window.num).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
                    {ebEvents.filter(e => e.windowNum === window.num).map(e => (
                      <span key={e.id} className="tag eb">
                        {formatDate(e.date)} • {e.hours}h
                        <button onClick={() => setEbEvents(ebEvents.filter(x => x.id !== e.id))}>×</button>
                      </span>
                    ))}
                  </div>
                ) : null}
                
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newEB.windowNum === window.num ? newEB.date : ''} 
                    onChange={e => setNewEB({ ...newEB, windowNum: window.num, date: e.target.value })}
                    min={window.openDate.toISOString().split('T')[0]}
                    max={window.closeDate.toISOString().split('T')[0]}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Hours" 
                    value={newEB.windowNum === window.num ? newEB.hours : 2}
                    onChange={e => setNewEB({ ...newEB, windowNum: window.num, hours: parseInt(e.target.value) || 0 })}
                    min="1" max="10"
                    style={{ width: 80 }}
                  />
                  <button className="btn-add" onClick={() => { setNewEB({ ...newEB, windowNum: window.num }); addEBEvent(); }}><Plus size={18} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* BTE Section */}
          <div className="window-card" style={{ borderColor: 'rgba(212,184,232,0.3)' }}>
            <h4><Gift size={20} style={{ color: '#d4b8e8' }} /> Bring-to-Event (BTE)</h4>
            
            {bteWindows.map(window => (
              <div key={window.num} style={{ marginBottom: 16, padding: 14, background: 'rgba(212,184,232,0.1)', borderRadius: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>BTE #{window.num}</div>
                <div className="window-dates">
                  <span>Opens: <strong>{window.openStr}</strong></span>
                  <span>Closes: <strong>{window.closeStr}</strong></span>
                </div>
                
                {bteEvents.filter(e => e.windowNum === window.num).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
                    {bteEvents.filter(e => e.windowNum === window.num).map(e => (
                      <span key={e.id} className="tag bte">
                        {formatDate(e.date)} • {e.hours}h
                        <button onClick={() => setBteEvents(bteEvents.filter(x => x.id !== e.id))}>×</button>
                      </span>
                    ))}
                  </div>
                ) : null}
                
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newBTE.windowNum === window.num ? newBTE.date : ''} 
                    onChange={e => setNewBTE({ ...newBTE, windowNum: window.num, date: e.target.value })}
                    min={window.openDate.toISOString().split('T')[0]}
                    max={window.closeDate.toISOString().split('T')[0]}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Hours" 
                    value={newBTE.windowNum === window.num ? newBTE.hours : 2}
                    onChange={e => setNewBTE({ ...newBTE, windowNum: window.num, hours: parseInt(e.target.value) || 0 })}
                    min="1" max="10"
                    style={{ width: 80 }}
                  />
                  <button className="btn-add" onClick={() => { setNewBTE({ ...newBTE, windowNum: window.num }); addBTEEvent(); }}><Plus size={18} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ padding: 16, background: 'rgba(59,130,246,0.1)', borderRadius: 12, marginTop: 10 }}>
            <strong>Total Hours from EB & BTE:</strong>
            <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
              <span style={{ color: '#ffd699' }}>EB: {ebEvents.reduce((sum, e) => sum + e.hours, 0)}h ({ebEvents.length} events)</span>
              <span style={{ color: '#d4b8e8' }}>BTE: {bteEvents.reduce((sum, e) => sum + e.hours, 0)}h ({bteEvents.length} events)</span>
            </div>
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(4)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(6)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 6: Community Connections */}
      {step === 6 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Users size={24} /> Community Connections</h2>
          <p className="section-desc">Track your 1:1 connections with residents - best done during DOD!</p>
          
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 6, display: 'block' }}>Community Size</label>
              <input className="input-field" type="number" placeholder="e.g., 40" value={communitySize} onChange={e => setCommunitySize(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 6, display: 'block' }}>Deadline</label>
              <input className="input-field" type="date" value={connectionDeadline} onChange={e => setConnectionDeadline(e.target.value)} />
            </div>
          </div>

          {connectionsInfo && (
            <div style={{ background: 'linear-gradient(135deg, rgba(197,179,217,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(197,179,217,0.3)', borderRadius: 14, padding: 20, marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Target size={24} style={{ color: '#c5b3d9' }} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{connectionsInfo.total} Connections</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>{connectionsInfo.daysLeft} days / {connectionsInfo.weeksLeft} weeks left</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#c5b3d9' }}>{connectionsInfo.perWeek}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>per week</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#f5d5a0' }}>{connectionsInfo.perShift}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>per DOD shift</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{connectionsInfo.totalShifts}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>total shifts</div>
                </div>
              </div>

              {dodShifts.length > 0 && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(245,213,160,0.15)', borderRadius: 8, fontSize: 13 }}>
                  <strong>💡 Tip:</strong> Do {connectionsInfo.perShift} connections each DOD shift ({dodShifts.join(', ')})!
                </div>
              )}
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(5)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(7)}>View Schedule <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 7: Schedule View */}
      {step === 7 && (
        <div className="glass-card" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2><Calendar size={24} /> My Schedule</h2>
            {selectedWeek !== null && (
              <button className="btn-secondary" onClick={() => setSelectedWeek(null)}><ArrowLeft size={16} /> Month</button>
            )}
          </div>

          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => { navigateMonth(-1); setSelectedWeek(null); }}><ArrowLeft size={18} /></button>
            <h3 style={{ margin: 0 }}>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button className="month-nav-btn" onClick={() => { navigateMonth(1); setSelectedWeek(null); }}><ArrowRight size={18} /></button>
          </div>

          {/* Hours Summary */}
          <div className="hours-summary">
            <div className="hours-card">
              <div className="hours-value" style={{ color: '#a8c5e2' }}>{selectedWeek === null ? monthlyHours.classHours : weeklyHours.classHours}h</div>
              <div className="hours-label">Classes</div>
            </div>
            <div className="hours-card">
              <div className="hours-value" style={{ color: '#f5d5a0' }}>{selectedWeek === null ? monthlyHours.donHours.toFixed(1) : weeklyHours.donHours.toFixed(1)}h</div>
              <div className="hours-label">Don Duties</div>
            </div>
            <div className="hours-card">
              <div className="hours-value" style={{ color: '#ffd699' }}>{ebEvents.reduce((s, e) => s + e.hours, 0)}h</div>
              <div className="hours-label">EB</div>
            </div>
            <div className="hours-card">
              <div className="hours-value" style={{ color: '#d4b8e8' }}>{bteEvents.reduce((s, e) => s + e.hours, 0)}h</div>
              <div className="hours-label">BTE</div>
            </div>
            <div className="hours-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}>
              <div className="hours-value" style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {(weeklyHours.donHours + ebEvents.reduce((s, e) => s + e.hours, 0) / 16 + bteEvents.reduce((s, e) => s + e.hours, 0) / 16).toFixed(1)}h
              </div>
              <div className="hours-label">Avg/Week</div>
            </div>
          </div>

          {connectionsInfo && dodShifts.length > 0 && (
            <div style={{ padding: 10, background: 'rgba(197,179,217,0.1)', borderRadius: 10, marginBottom: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} style={{ color: '#c5b3d9' }} />
              <span><strong>Connections:</strong> ~{connectionsInfo.perShift} during each DOD shift</span>
            </div>
          )}

          {selectedWeek === null ? (
            <>
              <div className="calendar-grid" style={{ marginBottom: 24 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {calendarDays.map((dayData, idx) => (
                  <div key={idx} className={`calendar-day ${!dayData.day ? 'empty' : ''}`}>
                    {dayData.day && (
                      <>
                        <div className="calendar-day-number">{dayData.day}</div>
                        {dayData.classes.slice(0, 1).map((cls, i) => (
                          <div key={i} className="calendar-event" style={{ background: BLOCK_COLORS.class.bg, color: BLOCK_COLORS.class.text }}>{cls.name}</div>
                        ))}
                        {dayData.dayName && dodShifts.includes(dayData.dayName) && (
                          <div className="calendar-event" style={{ background: BLOCK_COLORS.dod.bg, color: BLOCK_COLORS.dod.text }}>DOD</div>
                        )}
                        {dayData.ebOnDay?.map((e, i) => (
                          <div key={i} className="calendar-event" style={{ background: BLOCK_COLORS.eb.bg, color: BLOCK_COLORS.eb.text }}>EB {e.hours}h</div>
                        ))}
                        {dayData.bteOnDay?.map((e, i) => (
                          <div key={i} className="calendar-event" style={{ background: BLOCK_COLORS.bte.bg, color: BLOCK_COLORS.bte.text }}>BTE {e.hours}h</div>
                        ))}
                        {dayData.events.filter(e => e.category === 'fnh').slice(0, 1).map((event, i) => (
                          <div key={i} className="calendar-event" style={{ background: getEventColor(event.category), color: '#1a1a2e' }}>FNH</div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 16, fontSize: 18 }}>Week by Week</h3>
              {weeksInMonth.map((week, idx) => (
                <div key={idx} className="week-card" onClick={() => setSelectedWeek(idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Week {week.weekNumber}</div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>
                        {week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#60a5fa' }}>View →</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            (() => {
              const week = weeksInMonth[selectedWeek];
              return (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0 }}>Week {week.weekNumber}</h3>
                    <div style={{ opacity: 0.6, fontSize: 14 }}>
                      {week.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {week.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, fontSize: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={10} /> Locked</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GripVertical size={10} /> Drag</span>
                    {Object.entries(BLOCK_COLORS).slice(0, 5).map(([type, colors]) => (
                      <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: colors.bg }} />
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="schedule-grid">
                    <div className="schedule-header"></div>
                    {DAYS.map(day => <div key={day} className="schedule-header">{day.slice(0, 3)}</div>)}
                    
                    {HOURS.map(hour => (
                      <React.Fragment key={hour}>
                        <div className="schedule-time">{formatHour(hour)}</div>
                        {DAYS.map(day => {
                          const blocks = getDayBlocks(day);
                          const startingBlocks = blocks.filter(b => b.start === hour);
                          
                          return (
                            <div key={day} className="schedule-cell" onDragOver={(e) => e.preventDefault()} onDrop={() => handleMealDrop(day, hour)}>
                              {startingBlocks.map((block, i) => {
                                const height = (block.end - block.start) * 40 - 4;
                                const colors = BLOCK_COLORS[block.type] || { bg: '#888', text: '#fff' };
                                return (
                                  <div
                                    key={i}
                                    className={`schedule-block ${block.locked ? 'locked' : 'draggable'}`}
                                    style={{ top: 2, height, background: colors.bg, color: colors.text }}
                                    draggable={!block.locked}
                                    onDragStart={() => !block.locked && handleMealDragStart(day, block.type)}
                                  >
                                    {block.locked ? <Lock size={8} /> : <GripVertical size={8} />}
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>

                  {connectionsInfo && (
                    <div style={{ marginTop: 20, padding: 14, background: 'rgba(197,179,217,0.1)', borderRadius: 10, fontSize: 13 }}>
                      <strong>🎯 This Week:</strong> {connectionsInfo.perWeek} connections
                      {dodShifts.length > 0 && <span> ({connectionsInfo.perShift} per DOD on {dodShifts.join(', ')})</span>}
                    </div>
                  )}
                </>
              );
            })()
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(6)}><ChevronLeft size={20} /> Edit</button>
            <button className="btn-secondary" onClick={() => setStep(1)}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}
