import React, { useState, useRef, useMemo } from 'react';
import { Upload, Plus, X, Calendar, Clock, Users, BookOpen, ChevronRight, ChevronLeft, Check, AlertCircle, Target, CalendarDays, ArrowLeft, ArrowRight, FileSpreadsheet, Lock, GripVertical, Package, Star, Folder, Trash2, Lightbulb, LayoutGrid, List, Coffee, Dumbbell, Brain, Heart, Sparkles } from 'lucide-react';
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
  { id: 'team', name: 'Team Meeting', frequency: 'Weekly', duration: 1, color: '#34d399' },
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
  social: { bg: '#ffb3ba', text: '#5c2d33' },
  study: { bg: '#bae1ff', text: '#2d4a5c' },
  personal: { bg: '#baffc9', text: '#2d5c3d' },
  exercise: { bg: '#ffdfba', text: '#5c4a2d' },
};

// FEATURE 3: Draggable block types for scheduling
const DRAGGABLE_BLOCK_TYPES = [
  { id: 'dod-extra', name: 'Extra DOD', color: BLOCK_COLORS.dod, defaultHours: 3 },
  { id: 'social', name: 'Social', color: BLOCK_COLORS.social, defaultHours: 2 },
  { id: 'study', name: 'Study', color: BLOCK_COLORS.study, defaultHours: 2 },
  { id: 'personal', name: 'Personal', color: BLOCK_COLORS.personal, defaultHours: 1 },
  { id: 'exercise', name: 'Exercise', color: BLOCK_COLORS.exercise, defaultHours: 1 },
];

// Helper to generate month key
const getMonthKey = (month, year) => `${year}-${String(month + 1).padStart(2, '0')}`;

export default function DonScheduler() {
  const [step, setStep] = useState(1);
  
  // Class schedule
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '', day: 'Monday', startTime: '9', endTime: '10' });
  const [uploadStatus, setUploadStatus] = useState('');
  
  // DOD shifts (weekly recurring - kept for schedule view)
  const [dodShifts, setDodShifts] = useState([]);
  const [newDodDay, setNewDodDay] = useState('Monday');
  
  // FEATURE 2: DOD Monthly Hours - Flexible monthly hour tracking
  const [dodMonthlyHours, setDodMonthlyHours] = useState({});
  const [selectedDodMonth, setSelectedDodMonth] = useState({ month: 8, year: 2025 });
  const [newDodEntry, setNewDodEntry] = useState({ date: '', startTime: '20:00', endTime: '23:00', notes: '' });
  
  // Meetings
  const [meetings, setMeetings] = useState({ team: [], senior: [], rlc: [] });
  const [newMeeting, setNewMeeting] = useState({ type: 'team', day: 'Monday', time: '19:00' });
  
  // EB and BTE planned events
  const [ebEvents, setEbEvents] = useState([]);
  const [bteEvents, setBteEvents] = useState([]);
  const [newEB, setNewEB] = useState({ windowNum: 1, date: '', hours: 2 });
  const [newBTE, setNewBTE] = useState({ windowNum: 1, date: '', hours: 2 });
  
  // FEATURE 1: Community Connections - Monthly RLM-aligned tracking
  const [communityConnections, setCommunityConnections] = useState({});
  const [selectedConnectionMonth, setSelectedConnectionMonth] = useState({ month: 8, year: 2025 });
  const [newConnection, setNewConnection] = useState({ startDate: '', dueDate: '', communitySize: '' });
  
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
  
  // FEATURE 5: View state - Monthly/Weekly toggle with persistence
  const [selectedMonth, setSelectedMonth] = useState({ month: 8, year: 2025 });
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [isDraggingClass, setIsDraggingClass] = useState(false);
  
  // FEATURE 3: Scheduled blocks (drag-and-drop additions)
  const [scheduledBlocks, setScheduledBlocks] = useState({}); // { "2025-09-15": [{ id, type, hours, startHour }] }
  const [draggedBlockType, setDraggedBlockType] = useState(null);
  
  // FEATURE 4: Smart recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
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

  const normalizeDay = (day) => {
    const dayMap = {
      'M': 'Monday', 'Mo': 'Monday', 'Mon': 'Monday',
      'T': 'Tuesday', 'Tu': 'Tuesday', 'Tue': 'Tuesday', 'Tues': 'Tuesday',
      'W': 'Wednesday', 'We': 'Wednesday', 'Wed': 'Wednesday',
      'R': 'Thursday', 'Th': 'Thursday', 'Thu': 'Thursday', 'Thur': 'Thursday', 'Thurs': 'Thursday',
      'F': 'Friday', 'Fr': 'Friday', 'Fri': 'Friday',
      'S': 'Saturday', 'Sa': 'Saturday', 'Sat': 'Saturday',
      'Su': 'Sunday', 'Sun': 'Sunday',
    };
    const clean = day?.toString().trim();
    return dayMap[clean] || DAYS.find(d => d.toLowerCase().startsWith(clean?.toLowerCase())) || null;
  };

  const formatTime = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const formatTimeRange = (startTime, endTime) => {
    const formatT = (t) => {
      const [h, m] = t.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const hour = h % 12 || 12;
      return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
    };
    return `${formatT(startTime)} - ${formatT(endTime)}`;
  };

  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    let current = new Date(firstDay);
    current.setDate(current.getDate() - current.getDay() + 1);
    
    while (current <= lastDay || weeks.length < 1) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({ start: weekStart, end: weekEnd });
      current.setDate(current.getDate() + 7);
      if (weeks.length > 6) break;
    }
    return weeks;
  };

  // DOD Monthly Hours Functions (FEATURE 2)
  const currentDodMonthKey = getMonthKey(selectedDodMonth.month, selectedDodMonth.year);
  
  const addDodEntry = () => {
    if (!newDodEntry.date || !newDodEntry.startTime || !newDodEntry.endTime) return;
    
    const [startH, startM] = newDodEntry.startTime.split(':').map(Number);
    const [endH, endM] = newDodEntry.endTime.split(':').map(Number);
    let hours = (endH + endM/60) - (startH + startM/60);
    if (hours < 0) hours += 24;
    
    const entry = {
      id: Date.now(),
      date: newDodEntry.date,
      startTime: newDodEntry.startTime,
      endTime: newDodEntry.endTime,
      hours: Math.round(hours * 100) / 100,
      notes: newDodEntry.notes || ''
    };
    
    const entryMonth = newDodEntry.date.substring(0, 7);
    setDodMonthlyHours(prev => ({
      ...prev,
      [entryMonth]: [...(prev[entryMonth] || []), entry]
    }));
    setNewDodEntry({ date: '', startTime: '20:00', endTime: '23:00', notes: '' });
  };

  const removeDodEntry = (monthKey, entryId) => {
    setDodMonthlyHours(prev => ({
      ...prev,
      [monthKey]: (prev[monthKey] || []).filter(e => e.id !== entryId)
    }));
  };

  const getDodMonthTotal = (monthKey) => {
    const entries = dodMonthlyHours[monthKey] || [];
    return entries.reduce((sum, e) => sum + e.hours, 0);
  };

  // Community Connections Functions (FEATURE 1)
  const currentConnectionMonthKey = getMonthKey(selectedConnectionMonth.month, selectedConnectionMonth.year);

  const saveConnectionMonth = () => {
    if (newConnection.startDate && newConnection.dueDate && newConnection.communitySize) {
      setCommunityConnections(prev => ({
        ...prev,
        [currentConnectionMonthKey]: {
          startDate: newConnection.startDate,
          dueDate: newConnection.dueDate,
          communitySize: parseInt(newConnection.communitySize),
          createdAt: Date.now()
        }
      }));
    }
  };

  const deleteConnectionMonth = (monthKey) => {
    setCommunityConnections(prev => {
      const updated = { ...prev };
      delete updated[monthKey];
      return updated;
    });
  };

  const getConnectionData = (monthKey) => {
    return communityConnections[monthKey];
  };

  // Calculate connection metrics for a month
  const getConnectionMetrics = (monthKey) => {
    const data = communityConnections[monthKey];
    if (!data) return null;
    
    const { communitySize, startDate, dueDate } = data;
    const start = new Date(startDate);
    const deadline = new Date(dueDate);
    const today = new Date();
    
    const totalDays = Math.ceil((deadline - start) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
    const weeksLeft = Math.max(1, Math.ceil(daysRemaining / 7));
    const totalDodShifts = dodShifts.length * weeksLeft;
    
    const connectionsPerShift = totalDodShifts > 0 ? Math.ceil(communitySize / totalDodShifts) : communitySize;
    const connectionsPerWeek = Math.ceil(communitySize / weeksLeft);
    
    return {
      total: communitySize,
      perWeek: connectionsPerWeek,
      perShift: connectionsPerShift,
      daysRemaining,
      weeksLeft,
      startDate,
      dueDate
    };
  };

  // FEATURE 3: Drag-and-Drop Block Functions
  const handleBlockDragStart = (blockType) => {
    setDraggedBlockType(blockType);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlockType(null);
  };

  const handleBlockDrop = (dateStr, hour) => {
    if (!draggedBlockType) return;
    
    const blockConfig = DRAGGABLE_BLOCK_TYPES.find(b => b.id === draggedBlockType);
    if (!blockConfig) return;

    const newBlock = {
      id: Date.now(),
      type: draggedBlockType,
      name: blockConfig.name,
      color: blockConfig.color,
      hours: blockConfig.defaultHours,
      startHour: hour
    };

    setScheduledBlocks(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newBlock]
    }));
    
    setDraggedBlockType(null);
  };

  const removeScheduledBlock = (dateStr, blockId) => {
    setScheduledBlocks(prev => ({
      ...prev,
      [dateStr]: (prev[dateStr] || []).filter(b => b.id !== blockId)
    }));
  };

  // FEATURE 4: Smart Time Distribution
  const generateRecommendations = () => {
    const monthKey = getMonthKey(selectedMonth.month, selectedMonth.year);
    const weeks = getWeeksInMonth(selectedMonth.month, selectedMonth.year);
    const newRecs = [];
    
    // Analyze current schedule
    const existingBlocksByDay = {};
    weeks.forEach(week => {
      for (let d = 0; d < 7; d++) {
        const date = new Date(week.start);
        date.setDate(date.getDate() + d);
        if (date.getMonth() === selectedMonth.month) {
          const dateStr = date.toISOString().split('T')[0];
          const dayName = DAYS[d];
          const blocks = scheduledBlocks[dateStr] || [];
          const hasClass = classes.some(c => c.day === dayName);
          const hasDod = dodShifts.includes(dayName);
          existingBlocksByDay[dateStr] = { blocks, hasClass, hasDod, dayName, date };
        }
      }
    });

    // Find light days (fewer commitments)
    const lightDays = Object.entries(existingBlocksByDay)
      .filter(([_, info]) => !info.hasClass && !info.hasDod && info.blocks.length < 2)
      .sort((a, b) => a[1].blocks.length - b[1].blocks.length)
      .slice(0, 5);

    // Recommend study time spread across the week
    const studyDays = lightDays.filter((_, i) => i % 2 === 0).slice(0, 3);
    studyDays.forEach(([dateStr, info]) => {
      newRecs.push({
        id: Date.now() + Math.random(),
        type: 'study',
        dateStr,
        dayName: info.dayName,
        message: `Add 2h Study Time on ${info.dayName} ${info.date.getDate()}`,
        hours: 2,
        startHour: 14
      });
    });

    // Recommend social time
    const socialDays = lightDays.filter((_, i) => i % 2 === 1).slice(0, 2);
    socialDays.forEach(([dateStr, info]) => {
      newRecs.push({
        id: Date.now() + Math.random(),
        type: 'social',
        dateStr,
        dayName: info.dayName,
        message: `Add Social Time on ${info.dayName} ${info.date.getDate()}`,
        hours: 2,
        startHour: 19
      });
    });

    // Recommend exercise on non-DOD days
    const exerciseDays = Object.entries(existingBlocksByDay)
      .filter(([_, info]) => !info.hasDod && !info.blocks.some(b => b.type === 'exercise'))
      .slice(0, 3);
    exerciseDays.forEach(([dateStr, info]) => {
      newRecs.push({
        id: Date.now() + Math.random(),
        type: 'exercise',
        dateStr,
        dayName: info.dayName,
        message: `Add Exercise on ${info.dayName} ${info.date.getDate()}`,
        hours: 1,
        startHour: 7
      });
    });

    // Recommend personal time on weekends
    const weekendDays = Object.entries(existingBlocksByDay)
      .filter(([_, info]) => info.dayName === 'Saturday' || info.dayName === 'Sunday')
      .slice(0, 2);
    weekendDays.forEach(([dateStr, info]) => {
      if (!info.blocks.some(b => b.type === 'personal')) {
        newRecs.push({
          id: Date.now() + Math.random(),
          type: 'personal',
          dateStr,
          dayName: info.dayName,
          message: `Add Personal Time on ${info.dayName} ${info.date.getDate()}`,
          hours: 2,
          startHour: 10
        });
      }
    });

    setRecommendations(newRecs.slice(0, 8));
    setShowRecommendations(true);
  };

  const applyRecommendation = (rec) => {
    const blockConfig = DRAGGABLE_BLOCK_TYPES.find(b => b.id === rec.type);
    if (!blockConfig) return;

    const newBlock = {
      id: Date.now(),
      type: rec.type,
      name: blockConfig.name,
      color: blockConfig.color,
      hours: rec.hours,
      startHour: rec.startHour
    };

    setScheduledBlocks(prev => ({
      ...prev,
      [rec.dateStr]: [...(prev[rec.dateStr] || []), newBlock]
    }));

    setRecommendations(prev => prev.filter(r => r.id !== rec.id));
  };

  const applyAllRecommendations = () => {
    recommendations.forEach(rec => {
      const blockConfig = DRAGGABLE_BLOCK_TYPES.find(b => b.id === rec.type);
      if (!blockConfig) return;

      const newBlock = {
        id: Date.now() + Math.random(),
        type: rec.type,
        name: blockConfig.name,
        color: blockConfig.color,
        hours: rec.hours,
        startHour: rec.startHour
      };

      setScheduledBlocks(prev => ({
        ...prev,
        [rec.dateStr]: [...(prev[rec.dateStr] || []), newBlock]
      }));
    });

    setRecommendations([]);
    setShowRecommendations(false);
  };

  // Navigation helpers (FEATURE 5)
  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      if (newMonth < 0) { newMonth = 11; newYear--; }
      return { month: newMonth, year: newYear };
    });
  };

  const navigateDodMonth = (direction) => {
    setSelectedDodMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      if (newMonth < 0) { newMonth = 11; newYear--; }
      return { month: newMonth, year: newYear };
    });
  };

  const navigateConnectionMonth = (direction) => {
    setSelectedConnectionMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      if (newMonth < 0) { newMonth = 11; newYear--; }
      const newMonthKey = getMonthKey(newMonth, newYear);
      const existing = communityConnections[newMonthKey];
      if (existing) {
        setNewConnection({
          startDate: existing.startDate,
          dueDate: existing.dueDate,
          communitySize: existing.communitySize.toString()
        });
      } else {
        setNewConnection({ startDate: '', dueDate: '', communitySize: '' });
      }
      return { month: newMonth, year: newYear };
    });
  };

  // Get saved months for DOD hours
  const getSavedDodMonths = () => {
    return Object.keys(dodMonthlyHours).filter(key => dodMonthlyHours[key].length > 0).sort();
  };

  // Get saved months for connections
  const getSavedConnectionMonths = () => {
    return Object.keys(communityConnections).sort();
  };

  // Excel/CSV parsing - handles multiple formats
  const parseExcelFile = (file) => {
    setUploadStatus('Processing...');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        const parsed = [];
        
        // Detect format by looking for header row
        let startRow = 0;
        let format = 'unknown';
        
        for (let i = 0; i < Math.min(json.length, 5); i++) {
          const row = json[i];
          if (!row || row.length < 2) continue;
          
          const firstCell = row[0]?.toString().toLowerCase().trim();
          const secondCell = row[1]?.toString().toLowerCase().trim();
          
          // Format 1: Day, Start Time, End Time, Course (user's format)
          if (firstCell === 'day' && (secondCell === 'start time' || secondCell === 'start')) {
            startRow = i + 1;
            format = 'day-first';
            break;
          }
          // Format 2: Name/Course, Day, Start, End (original format)
          if ((firstCell === 'name' || firstCell === 'course' || firstCell === 'class') && 
              (secondCell === 'day' || secondCell === 'days')) {
            startRow = i + 1;
            format = 'name-first';
            break;
          }
        }
        
        // If no header found, try to auto-detect from first data row
        if (format === 'unknown') {
          startRow = 1; // Skip first row (might be a title)
          // Check if first column looks like a day
          const firstDataRow = json[startRow];
          if (firstDataRow && firstDataRow[0]) {
            const firstVal = firstDataRow[0].toString().trim();
            if (normalizeDay(firstVal)) {
              format = 'day-first';
            } else {
              format = 'name-first';
            }
          }
        }
        
        json.slice(startRow).forEach(row => {
          if (!row || row.length < 3) return;
          
          // Skip empty rows or rows with just whitespace/quotes
          const hasContent = row.some(cell => cell && cell.toString().trim().length > 1);
          if (!hasContent) return;
          
          let name, dayStr, startStr, endStr;
          
          if (format === 'day-first') {
            // Day, Start Time, End Time, Course
            dayStr = row[0]?.toString().trim();
            startStr = row[1]?.toString();
            endStr = row[2]?.toString();
            name = row[3]?.toString().trim();
          } else {
            // Name, Day, Start, End
            name = row[0]?.toString().trim();
            dayStr = row[1]?.toString().trim();
            startStr = row[2]?.toString();
            endStr = row[3]?.toString();
          }
          
          const day = normalizeDay(dayStr);
          const startTime = parseTimeToHour(startStr);
          const endTime = parseTimeToHour(endStr);
          
          if (name && day && startTime !== null && endTime !== null) {
            parsed.push({ name, day, startTime, endTime });
          }
        });
        
        if (parsed.length > 0) {
          setClasses(prev => [...prev, ...parsed]);
          setUploadStatus(`Added ${parsed.length} classes`);
        } else {
          setUploadStatus('No valid classes found. Check format: Day, Start Time, End Time, Course');
        }
      } catch (err) {
        setUploadStatus('Error reading file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClassDrop = (e) => {
    e.preventDefault();
    setIsDraggingClass(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      parseExcelFile(file);
    }
  };

  // Meal drag handlers
  const handleMealDragStart = (day, mealType) => {
    setDraggedMeal({ day, mealType });
  };

  const handleMealDrop = (day, hour) => {
    if (draggedMeal) {
      setWeeklyMeals(prev => ({
        ...prev,
        [draggedMeal.day]: {
          ...prev[draggedMeal.day],
          [draggedMeal.mealType]: { ...prev[draggedMeal.day][draggedMeal.mealType], start: hour }
        }
      }));
      setDraggedMeal(null);
    }
  };

  // Get blocks that appear in a specific week (for weekly view)
  const getBlocksForWeek = (weekStart) => {
    const blocks = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];
      const dayBlocks = scheduledBlocks[dateStr] || [];
      dayBlocks.forEach(block => {
        blocks.push({ ...block, dayIndex: d, date });
      });
    }
    return blocks;
  };

  // Calculate schedule data for month view
  const getMonthlyCalendarData = () => {
    const monthKey = getMonthKey(selectedMonth.month, selectedMonth.year);
    const firstDay = new Date(selectedMonth.year, selectedMonth.month, 1);
    const lastDay = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    for (let i = 0; i < startPad; i++) {
      days.push({ date: null, events: [] });
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(selectedMonth.year, selectedMonth.month, d);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = DAYS[(date.getDay() + 6) % 7];
      const events = [];
      
      // Classes
      classes.filter(c => c.day === dayName).forEach(c => {
        events.push({ type: 'class', name: c.name, time: formatTime(c.startTime) });
      });
      
      // DOD shifts (weekly)
      if (dodShifts.includes(dayName)) {
        events.push({ type: 'dod', name: 'DOD Shift', time: '8PM-11PM' });
      }
      
      // DOD monthly entries
      const dodEntries = (dodMonthlyHours[monthKey] || []).filter(e => e.date === dateStr);
      dodEntries.forEach(e => {
        events.push({ type: 'dod', name: `DOD (${e.hours}h)`, time: formatTimeRange(e.startTime, e.endTime) });
      });
      
      // Meetings
      Object.entries(meetings).forEach(([type, slots]) => {
        slots.filter(s => s.day === dayName).forEach(() => {
          events.push({ type: 'meeting', name: MEETING_TYPES.find(m => m.id === type)?.name || type });
        });
      });
      
      // RLM Events
      const rlmEvents = RLM_EVENTS_DATA[monthKey] || [];
      rlmEvents.filter(e => e.date === d).forEach(e => {
        const eventId = `${monthKey}-${rlmEvents.indexOf(e)}`;
        if (selectedRLMEvents[eventId] || !e.selectable) {
          events.push({ type: e.category, name: e.title });
        }
      });
      
      // EB/BTE events
      ebEvents.filter(e => e.date === dateStr).forEach(e => {
        events.push({ type: 'eb', name: `EB #${e.windowNum}`, time: `${e.hours}h` });
      });
      bteEvents.filter(e => e.date === dateStr).forEach(e => {
        events.push({ type: 'bte', name: `BTE #${e.windowNum}`, time: `${e.hours}h` });
      });
      
      // Scheduled blocks (drag-and-drop)
      const dayBlocks = scheduledBlocks[dateStr] || [];
      dayBlocks.forEach(block => {
        events.push({ 
          type: block.type, 
          name: block.name, 
          time: `${block.hours}h`,
          blockId: block.id,
          dateStr
        });
      });
      
      days.push({ date: d, dayName, dateStr, events });
    }
    
    return days;
  };

  // Calculate hour totals
  const calculateHourTotals = () => {
    const monthKey = getMonthKey(selectedMonth.month, selectedMonth.year);
    const weeksInMonth = getWeeksInMonth(selectedMonth.month, selectedMonth.year).length;
    
    let classHours = 0;
    classes.forEach(c => {
      classHours += (c.endTime - c.startTime) * weeksInMonth;
    });
    
    const dodWeeklyHours = dodShifts.length * 3 * weeksInMonth;
    const dodMonthTotal = getDodMonthTotal(monthKey);
    
    let meetingHours = 0;
    Object.entries(meetings).forEach(([type, slots]) => {
      const meeting = MEETING_TYPES.find(m => m.id === type);
      meetingHours += slots.length * (meeting?.duration || 1) * weeksInMonth;
    });
    
    let rlmHours = 0;
    const rlmEvents = RLM_EVENTS_DATA[monthKey] || [];
    rlmEvents.forEach((event, idx) => {
      const eventId = `${monthKey}-${idx}`;
      if (selectedRLMEvents[eventId] && event.hours) {
        rlmHours += event.hours;
      }
    });
    
    let ebHours = ebEvents.reduce((sum, e) => sum + e.hours, 0);
    let bteHours = bteEvents.reduce((sum, e) => sum + e.hours, 0);
    
    // Calculate scheduled block hours
    let scheduledHours = { social: 0, study: 0, personal: 0, exercise: 0, 'dod-extra': 0 };
    Object.values(scheduledBlocks).forEach(blocks => {
      blocks.forEach(block => {
        if (scheduledHours[block.type] !== undefined) {
          scheduledHours[block.type] += block.hours;
        }
      });
    });
    
    return {
      classes: classHours,
      dodWeekly: dodWeeklyHours,
      dodMonthly: dodMonthTotal,
      meetings: meetingHours,
      rlm: rlmHours,
      eb: ebHours,
      bte: bteHours,
      scheduled: scheduledHours,
      total: classHours + dodWeeklyHours + dodMonthTotal + meetingHours + rlmHours + ebHours + bteHours + 
             Object.values(scheduledHours).reduce((a, b) => a + b, 0)
    };
  };

  const hourTotals = calculateHourTotals();
  const weeks = getWeeksInMonth(selectedMonth.month, selectedMonth.year);

  // Styles - Original aesthetic
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', sans-serif; min-height: 100vh; color: #e8ecf4; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    
    h1 { font-family: 'Fraunces', serif; font-size: 38px; text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
    .subtitle { text-align: center; opacity: 0.5; margin-bottom: 28px; font-size: 15px; }
    
    .step-tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; justify-content: center; }
    .step-tab { padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: inherit; font-weight: 500; font-size: 13px; color: rgba(255,255,255,0.6); transition: all 0.2s; }
    .step-tab:hover { background: rgba(255,255,255,0.08); }
    .step-tab.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-color: transparent; }
    .step-tab.completed { border-color: #34d399; color: #34d399; }
    
    .card { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; margin-bottom: 20px; }
    .card h2 { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 22px; color: #e8ecf4; }
    
    .form-row { display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
    .form-group input, .form-group select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: white; font-size: 15px; font-family: inherit; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #3b82f6; }
    .form-group select option { background: #1a2744; color: white; }
    
    .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: none; padding: 14px 28px; border-radius: 12px; color: white; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
    .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 12px 24px; border-radius: 12px; color: white; font-weight: 500; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    .btn-add { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-add:hover { background: rgba(16,185,129,0.25); }
    .btn-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-danger:hover { background: rgba(239,68,68,0.25); }
    
    .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
    .tag { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 20px; margin: 4px; font-size: 13px; font-weight: 500; }
    .tag button { background: rgba(255,255,255,0.2); border: none; width: 20px; height: 20px; border-radius: 50%; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    
    .upload-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 16px; padding: 36px; text-align: center; cursor: pointer; transition: all 0.3s; }
    .upload-zone:hover, .upload-zone.dragging { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
    
    .day-toggle { display: flex; flex-wrap: wrap; gap: 8px; }
    .day-btn { padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .day-btn:hover { background: rgba(255,255,255,0.08); }
    .day-btn.selected { background: rgba(245, 213, 160, 0.2); border-color: #f5d5a0; color: #f5d5a0; }
    
    .nav-buttons { display: flex; justify-content: space-between; margin-top: 24px; gap: 12px; flex-wrap: wrap; }
    
    .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .month-nav h3 { font-size: 1.3rem; }
    .month-nav button { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; }
    .month-nav button:hover { background: rgba(255,255,255,0.1); }
    
    .view-toggle { display: flex; gap: 8px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px; }
    .view-toggle button { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.6); cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit; }
    .view-toggle button.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; }
    
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
    .calendar-header { text-align: center; font-weight: 600; font-size: 12px; padding: 10px 4px; color: rgba(255,255,255,0.5); }
    .calendar-day { min-height: 85px; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 5px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; overflow: hidden; }
    .calendar-day:hover { background: rgba(255,255,255,0.06); }
    .calendar-day.drop-target { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
    .calendar-day .date { font-weight: 600; font-size: 12px; margin-bottom: 3px; color: #e8ecf4; }
    .calendar-day .event { font-size: 8px; padding: 2px 4px; border-radius: 3px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; position: relative; }
    .calendar-day .event.removable { cursor: pointer; }
    .calendar-day .event.removable:hover { opacity: 0.8; }
    .calendar-day .event .remove-btn { position: absolute; right: 2px; top: 50%; transform: translateY(-50%); display: none; background: rgba(0,0,0,0.3); border-radius: 50%; width: 14px; height: 14px; line-height: 14px; text-align: center; font-size: 10px; }
    .calendar-day .event.removable:hover .remove-btn { display: block; }
    .calendar-day.empty { background: transparent; min-height: auto; cursor: default; }
    
    .block-palette { display: flex; gap: 10px; flex-wrap: wrap; padding: 15px; background: rgba(255,255,255,0.04); border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.06); }
    .block-palette-item { padding: 10px 16px; border-radius: 10px; cursor: grab; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; transition: all 0.2s; }
    .block-palette-item:hover { transform: scale(1.05); }
    .block-palette-item:active { cursor: grabbing; }
    .block-palette-label { margin-right: auto; font-weight: 500; color: rgba(255,255,255,0.5); }
    
    .recommendations-panel { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
    .recommendations-panel h3 { display: flex; align-items: center; gap: 8px; color: #fbbf24; margin-bottom: 15px; }
    .recommendation-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.04); border-radius: 10px; margin-bottom: 8px; }
    .recommendation-item .rec-text { display: flex; align-items: center; gap: 10px; }
    .recommendation-item button { padding: 8px 14px; border-radius: 8px; border: none; background: rgba(16,185,129,0.15); color: #34d399; cursor: pointer; font-weight: 500; }
    .recommendation-item button:hover { background: rgba(16,185,129,0.25); }
    .rec-actions { display: flex; gap: 10px; margin-top: 15px; }
    
    .weekly-grid { display: grid; grid-template-columns: 50px repeat(7, 1fr); gap: 2px; font-size: 11px; }
    .weekly-header { padding: 8px 4px; text-align: center; font-weight: 600; font-size: 11px; background: rgba(255,255,255,0.05); border-radius: 6px; }
    .weekly-time { padding: 4px; text-align: right; font-size: 10px; opacity: 0.5; height: 40px; display: flex; align-items: flex-start; justify-content: flex-end; }
    .weekly-cell { height: 40px; background: rgba(255,255,255,0.02); border-radius: 4px; position: relative; border: 1px solid transparent; }
    .weekly-cell:hover { background: rgba(255,255,255,0.05); }
    .weekly-cell.drop-target { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
    .weekly-block { position: absolute; left: 2px; right: 2px; border-radius: 4px; padding: 3px 5px; font-size: 10px; font-weight: 500; overflow: hidden; display: flex; align-items: center; gap: 4px; z-index: 1; }
    
    .schedule-block { padding: 6px 10px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 4px; }
    .schedule-block.draggable { cursor: grab; }
    .schedule-block.locked { cursor: default; }
    
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 8px; margin-bottom: 20px; }
    .summary-item { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
    .summary-item .label { font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .summary-item .value { font-size: 22px; font-weight: 700; }
    
    .month-folder { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
    .month-folder:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
    .month-folder.active { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
    .month-folder-info { flex: 1; }
    .month-folder-info h4 { margin-bottom: 4px; }
    .month-folder-info p { font-size: 0.85rem; opacity: 0.6; }
    
    .dod-entry { display: flex; align-items: center; gap: 15px; padding: 14px; background: rgba(255,255,255,0.04); border-radius: 10px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.06); }
    .dod-entry-info { flex: 1; }
    .dod-entry-info .date { font-weight: 600; }
    .dod-entry-info .time { font-size: 0.85rem; opacity: 0.6; }
    .dod-entry-info .notes { font-size: 0.8rem; opacity: 0.5; font-style: italic; }
    .dod-entry .hours { font-size: 1.2rem; font-weight: 700; color: #f5d5a0; }
    
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-top: 15px; }
    .metric-card { background: rgba(255,255,255,0.05); padding: 14px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
    .metric-card .value { font-size: 1.5rem; font-weight: 700; color: #60a5fa; }
    .metric-card .label { font-size: 0.75rem; opacity: 0.6; }
    
    .rlm-event-grid { display: grid; gap: 8px; max-height: 400px; overflow-y: auto; }
    .rlm-event { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
    .rlm-event:hover { background: rgba(255,255,255,0.06); }
    .rlm-event.selected { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); }
    .rlm-event input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    .rlm-event .event-info { flex: 1; }
    .rlm-event .event-date { font-weight: 600; font-size: 0.9rem; }
    .rlm-event .event-title { font-size: 0.85rem; opacity: 0.6; }
    .rlm-event .event-hours { font-size: 0.8rem; color: #60a5fa; }
    .rlm-event.disabled { opacity: 0.6; }
    
    .folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
    
    .window-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 18px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.08); }
    .window-card h4 { margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; font-size: 16px; }
  `;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1628 0%, #1a2744 50%, #0d1a2d 100%)', fontFamily: "'Outfit', sans-serif", color: '#e8ecf4', padding: 20 }}>
      <style>{styles}</style>
      
      <h1>Don Schedule Manager</h1>
      <p className="subtitle">Plan your month • Track your hours • Balance your life</p>

      {/* Step Navigation */}
      <div className="step-tabs">
        <button className={`step-tab ${step === 1 ? 'active' : classes.length > 0 ? 'completed' : ''}`} onClick={() => setStep(1)}>Classes</button>
        <button className={`step-tab ${step === 2 ? 'active' : dodShifts.length > 0 ? 'completed' : ''}`} onClick={() => setStep(2)}>DOD</button>
        <button className={`step-tab ${step === 'dod-monthly' ? 'active' : Object.keys(dodMonthlyHours).length > 0 ? 'completed' : ''}`} onClick={() => setStep('dod-monthly')}>DOD Hours</button>
        <button className={`step-tab ${step === 3 ? 'active' : Object.values(meetings).some(m => m.length > 0) ? 'completed' : ''}`} onClick={() => setStep(3)}>Meetings</button>
        <button className={`step-tab ${step === 4 ? 'active' : ''}`} onClick={() => setStep(4)}>RLM Events</button>
        <button className={`step-tab ${step === 5 ? 'active' : ebEvents.length > 0 || bteEvents.length > 0 ? 'completed' : ''}`} onClick={() => setStep(5)}>EB & BTE</button>
        <button className={`step-tab ${step === 'connections' ? 'active' : Object.keys(communityConnections).length > 0 ? 'completed' : ''}`} onClick={() => setStep('connections')}>Connections</button>
        <button className={`step-tab ${step === 7 ? 'active' : ''}`} onClick={() => setStep(7)}>Schedule</button>
      </div>

      {/* Step 1: Classes */}
      {step === 1 && (
        <div className="card">
          <h2><BookOpen size={24} /> Class Schedule</h2>
          
          <div className={`upload-zone ${isDraggingClass ? 'dragging' : ''}`} onClick={() => classInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDraggingClass(true); }} onDragLeave={() => setIsDraggingClass(false)} onDrop={handleClassDrop} style={{ marginBottom: 20 }}>
            <Upload size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
            <p>Drop Excel/CSV file or click to upload</p>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 5 }}>Format: Day, Start Time, End Time, Course</p>
            <input ref={classInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && parseExcelFile(e.target.files[0])} />
          </div>
          {uploadStatus && <p style={{ marginBottom: 15, color: '#34d399' }}>{uploadStatus}</p>}
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 15, fontSize: '1rem' }}>Or add manually:</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Class Name</label>
                <input type="text" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} placeholder="e.g., PSYCH 101" />
              </div>
              <div className="form-group">
                <label>Day</label>
                <select value={newClass.day} onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Start</label>
                <select value={newClass.startTime} onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}>
                  {HOURS.map(h => <option key={h} value={h}>{formatTime(h)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>End</label>
                <select value={newClass.endTime} onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}>
                  {HOURS.map(h => <option key={h} value={h}>{formatTime(h)}</option>)}
                </select>
              </div>
              <button className="btn-add" onClick={() => { if (newClass.name) { setClasses([...classes, { ...newClass, startTime: parseInt(newClass.startTime), endTime: parseInt(newClass.endTime) }]); setNewClass({ name: '', day: 'Monday', startTime: '9', endTime: '10' }); } }}><Plus size={18} /> Add</button>
            </div>
          </div>
          
          {classes.length > 0 && (
            <div className="tag-list">
              {classes.map((c, i) => (
                <div key={i} className="tag" style={{ background: BLOCK_COLORS.class.bg, color: BLOCK_COLORS.class.text }}>
                  {c.name} - {c.day} {formatTime(c.startTime)}-{formatTime(c.endTime)}
                  <button onClick={() => setClasses(classes.filter((_, idx) => idx !== i))}><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-primary" onClick={() => setStep(2)}>Next: DOD Shifts <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 2: DOD Weekly Shifts */}
      {step === 2 && (
        <div className="card">
          <h2><Clock size={24} /> DOD Weekly Shifts</h2>
          <p style={{ marginBottom: 20, color: '#9ca3af' }}>Select your regular weekly DOD days (8PM-11PM)</p>
          
          <div className="day-toggle">
            {DAYS.map(day => (
              <button key={day} className={`day-btn ${dodShifts.includes(day) ? 'selected' : ''}`} onClick={() => setDodShifts(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
          
          {dodShifts.length > 0 && (
            <p style={{ marginTop: 15, color: '#f5d5a0' }}>
              Weekly DOD: {dodShifts.length * 3} hours ({dodShifts.length} shifts × 3h)
            </p>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep('dod-monthly')}>Next: DOD Hours <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* FEATURE 2: DOD Monthly Hours */}
      {step === 'dod-monthly' && (
        <div className="card">
          <h2><Clock size={24} /> DOD Monthly Hours</h2>
          <p style={{ marginBottom: 20, color: '#9ca3af' }}>Track your actual DOD hours for each month (flexible dates & times)</p>
          
          {/* Month Navigation */}
          <div className="month-nav">
            <button onClick={() => navigateDodMonth(-1)}><ArrowLeft size={20} /></button>
            <h3>{MONTHS[selectedDodMonth.month]} {selectedDodMonth.year}</h3>
            <button onClick={() => navigateDodMonth(1)}><ArrowRight size={20} /></button>
          </div>
          
          {/* Add Entry Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h4 style={{ marginBottom: 15 }}>Add DOD Shift</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={newDodEntry.date} onChange={(e) => setNewDodEntry({ ...newDodEntry, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" value={newDodEntry.startTime} onChange={(e) => setNewDodEntry({ ...newDodEntry, startTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" value={newDodEntry.endTime} onChange={(e) => setNewDodEntry({ ...newDodEntry, endTime: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Notes (optional)</label>
                <input type="text" value={newDodEntry.notes} onChange={(e) => setNewDodEntry({ ...newDodEntry, notes: e.target.value })} placeholder="e.g., Covered for Alex" />
              </div>
              <button className="btn-add" onClick={addDodEntry}><Plus size={18} /> Add</button>
            </div>
          </div>
          
          {/* Entries List */}
          <div>
            <h4 style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
              {MONTHS[selectedDodMonth.month]} Shifts ({(dodMonthlyHours[currentDodMonthKey] || []).length})
            </h4>
            
            {(dodMonthlyHours[currentDodMonthKey] || []).length === 0 ? (
              <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No shifts recorded for this month</p>
            ) : (
              <>
                {(dodMonthlyHours[currentDodMonthKey] || []).map(entry => (
                  <div key={entry.id} className="dod-entry">
                    <div className="dod-entry-info">
                      <div className="date">{new Date(entry.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="time">{formatTimeRange(entry.startTime, entry.endTime)}</div>
                      {entry.notes && <div className="notes">{entry.notes}</div>}
                    </div>
                    <div className="hours">{entry.hours}h</div>
                    <button className="btn-danger" onClick={() => removeDodEntry(currentDodMonthKey, entry.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <div style={{ marginTop: 20, padding: 15, background: 'rgba(245, 213, 160, 0.1)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Month Total:</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#f5d5a0' }}>{getDodMonthTotal(currentDodMonthKey).toFixed(1)}h</span>
                </div>
              </>
            )}
          </div>
          
          {/* All Months Overview */}
          {getSavedDodMonths().length > 0 && (
            <div style={{ marginTop: 30 }}>
              <h4 style={{ marginBottom: 15 }}>All Recorded Months</h4>
              <div className="folder-grid">
                {getSavedDodMonths().map(monthKey => {
                  const [year, month] = monthKey.split('-').map(Number);
                  const total = getDodMonthTotal(monthKey);
                  return (
                    <div key={monthKey} className={`month-folder ${monthKey === currentDodMonthKey ? 'active' : ''}`} onClick={() => setSelectedDodMonth({ month: month - 1, year })}>
                      <Folder size={24} />
                      <div className="month-folder-info">
                        <h4>{MONTHS[month - 1]} {year}</h4>
                        <p>{total.toFixed(1)} hours</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Next: Meetings <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Meetings */}
      {step === 3 && (
        <div className="card">
          <h2><Users size={24} /> Regular Meetings</h2>
          
          {MEETING_TYPES.map(meeting => (
            <div key={meeting.id} style={{ marginBottom: 25, padding: 15, background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1rem' }}>{meeting.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{meeting.frequency} • {meeting.duration}h</span>
                </div>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: meeting.color }}></div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Day</label>
                  <select value={newMeeting.type === meeting.id ? newMeeting.day : 'Monday'} onChange={(e) => setNewMeeting({ type: meeting.id, day: e.target.value, time: newMeeting.time })}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={newMeeting.type === meeting.id ? newMeeting.time : '19:00'} onChange={(e) => setNewMeeting({ type: meeting.id, day: newMeeting.day, time: e.target.value })} />
                </div>
                <button className="btn-add" onClick={() => { setMeetings(prev => ({ ...prev, [meeting.id]: [...prev[meeting.id], { day: newMeeting.day, time: newMeeting.time }] })); }}>
                  <Plus size={18} /> Add
                </button>
              </div>
              
              {meetings[meeting.id].length > 0 && (
                <div className="tag-list">
                  {meetings[meeting.id].map((m, i) => (
                    <div key={i} className="tag" style={{ background: meeting.color, color: '#1a1a2e' }}>
                      {m.day} @ {m.time}
                      <button onClick={() => setMeetings(prev => ({ ...prev, [meeting.id]: prev[meeting.id].filter((_, idx) => idx !== i) }))}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep('dod-monthly')}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Next: RLM Events <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 4: RLM Events */}
      {step === 4 && (
        <div className="card">
          <h2><Calendar size={24} /> RLM Calendar Events</h2>
          <p style={{ marginBottom: 20, color: '#9ca3af' }}>Select optional events you'll attend (required events auto-selected)</p>
          
          <div className="month-nav">
            <button onClick={() => setSelectedMonth(prev => ({ ...prev, month: prev.month === 0 ? 11 : prev.month - 1, year: prev.month === 0 ? prev.year - 1 : prev.year }))}><ArrowLeft size={20} /></button>
            <h3>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button onClick={() => setSelectedMonth(prev => ({ ...prev, month: prev.month === 11 ? 0 : prev.month + 1, year: prev.month === 11 ? prev.year + 1 : prev.year }))}><ArrowRight size={20} /></button>
          </div>
          
          <div className="rlm-event-grid">
            {(RLM_EVENTS_DATA[getMonthKey(selectedMonth.month, selectedMonth.year)] || []).map((event, idx) => {
              const eventId = `${getMonthKey(selectedMonth.month, selectedMonth.year)}-${idx}`;
              return (
                <div key={eventId} className={`rlm-event ${!event.selectable ? 'disabled' : ''}`}>
                  <input type="checkbox" checked={selectedRLMEvents[eventId] || false} disabled={!event.selectable} onChange={(e) => setSelectedRLMEvents(prev => ({ ...prev, [eventId]: e.target.checked }))} />
                  <div className="event-info">
                    <div className="event-date">{MONTHS[selectedMonth.month]} {event.date}</div>
                    <div className="event-title">{event.title}</div>
                    {event.hours && <div className="event-hours">{event.hours}h</div>}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(3)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(5)}>Next: EB & BTE <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 5: EB & BTE */}
      {step === 5 && (
        <div className="card">
          <h2><Target size={24} /> EB & BTE Events</h2>
          <p style={{ marginBottom: 20, color: '#9ca3af' }}>Plan your Educational Bulletin and Behind the Ears events</p>
          
          {/* EB Events */}
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ marginBottom: 15, color: BLOCK_COLORS.eb.bg }}>Educational Bulletins</h3>
            {ebWindows.map(window => (
              <div key={window.num} style={{ padding: 15, background: 'rgba(255,214,153,0.1)', borderRadius: 10, marginBottom: 15 }}>
                <div style={{ marginBottom: 10 }}>
                  <strong>EB #{window.num}</strong>
                  <span style={{ marginLeft: 10, fontSize: '0.85rem', color: '#9ca3af' }}>{window.openStr} - {window.closeStr}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={newEB.windowNum === window.num ? newEB.date : ''} onChange={(e) => setNewEB({ windowNum: window.num, date: e.target.value, hours: 2 })} min={window.openDate.toISOString().split('T')[0]} max={window.closeDate.toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Hours</label>
                    <input type="number" value={newEB.windowNum === window.num ? newEB.hours : 2} onChange={(e) => setNewEB({ ...newEB, hours: parseFloat(e.target.value) })} min="0.5" max="4" step="0.5" style={{ width: 80 }} />
                  </div>
                  <button className="btn-add" onClick={() => { if (newEB.date && newEB.windowNum === window.num) { setEbEvents(prev => [...prev, { ...newEB }]); setNewEB({ windowNum: 1, date: '', hours: 2 }); } }}>
                    <Plus size={18} /> Add
                  </button>
                </div>
                {ebEvents.filter(e => e.windowNum === window.num).map((event, i) => (
                  <div key={i} className="tag" style={{ background: BLOCK_COLORS.eb.bg, color: BLOCK_COLORS.eb.text, marginTop: 10 }}>
                    {new Date(event.date + 'T00:00').toLocaleDateString()} - {event.hours}h
                    <button onClick={() => setEbEvents(prev => prev.filter((_, idx) => idx !== i))}><X size={14} /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* BTE Events */}
          <div>
            <h3 style={{ marginBottom: 15, color: BLOCK_COLORS.bte.bg }}>Behind the Ears</h3>
            {bteWindows.map(window => (
              <div key={window.num} style={{ padding: 15, background: 'rgba(212,184,232,0.1)', borderRadius: 10, marginBottom: 15 }}>
                <div style={{ marginBottom: 10 }}>
                  <strong>BTE #{window.num}</strong>
                  <span style={{ marginLeft: 10, fontSize: '0.85rem', color: '#9ca3af' }}>{window.openStr} - {window.closeStr}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={newBTE.windowNum === window.num ? newBTE.date : ''} onChange={(e) => setNewBTE({ windowNum: window.num, date: e.target.value, hours: 2 })} min={window.openDate.toISOString().split('T')[0]} max={window.closeDate.toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Hours</label>
                    <input type="number" value={newBTE.windowNum === window.num ? newBTE.hours : 2} onChange={(e) => setNewBTE({ ...newBTE, hours: parseFloat(e.target.value) })} min="0.5" max="4" step="0.5" style={{ width: 80 }} />
                  </div>
                  <button className="btn-add" onClick={() => { if (newBTE.date && newBTE.windowNum === window.num) { setBteEvents(prev => [...prev, { ...newBTE }]); setNewBTE({ windowNum: 1, date: '', hours: 2 }); } }}>
                    <Plus size={18} /> Add
                  </button>
                </div>
                {bteEvents.filter(e => e.windowNum === window.num).map((event, i) => (
                  <div key={i} className="tag" style={{ background: BLOCK_COLORS.bte.bg, color: BLOCK_COLORS.bte.text, marginTop: 10 }}>
                    {new Date(event.date + 'T00:00').toLocaleDateString()} - {event.hours}h
                    <button onClick={() => setBteEvents(prev => prev.filter((_, idx) => idx !== i))}><X size={14} /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(4)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep('connections')}>Next: Connections <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* FEATURE 1: Community Connections (RLM) */}
      {step === 'connections' && (
        <div className="card">
          <h2><Users size={24} /> Community Connections (RLM)</h2>
          <p style={{ marginBottom: 20, color: '#9ca3af' }}>Track your community connections by month with start/due dates</p>
          
          {/* Month Navigation */}
          <div className="month-nav">
            <button onClick={() => navigateConnectionMonth(-1)}><ArrowLeft size={20} /></button>
            <h3>{MONTHS[selectedConnectionMonth.month]} {selectedConnectionMonth.year}</h3>
            <button onClick={() => navigateConnectionMonth(1)}><ArrowRight size={20} /></button>
          </div>
          
          {/* Connection Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h4 style={{ marginBottom: 15 }}>{communityConnections[currentConnectionMonthKey] ? 'Update' : 'Set'} Connection Goal</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={newConnection.startDate} onChange={(e) => setNewConnection({ ...newConnection, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={newConnection.dueDate} onChange={(e) => setNewConnection({ ...newConnection, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Community Size (# people)</label>
                <input type="number" value={newConnection.communitySize} onChange={(e) => setNewConnection({ ...newConnection, communitySize: e.target.value })} placeholder="e.g., 40" min="1" />
              </div>
              <button className="btn-add" onClick={saveConnectionMonth}>
                <Check size={18} /> {communityConnections[currentConnectionMonthKey] ? 'Update' : 'Save'}
              </button>
              {communityConnections[currentConnectionMonthKey] && (
                <button className="btn-danger" onClick={() => deleteConnectionMonth(currentConnectionMonthKey)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Connection Metrics */}
          {communityConnections[currentConnectionMonthKey] && (() => {
            const metrics = getConnectionMetrics(currentConnectionMonthKey);
            if (!metrics) return null;
            return (
              <div style={{ background: 'rgba(134, 197, 184, 0.1)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
                <h4 style={{ marginBottom: 15, color: '#34d399' }}>Connection Targets</h4>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="value">{metrics.total}</div>
                    <div className="label">Total People</div>
                  </div>
                  <div className="metric-card">
                    <div className="value">{metrics.perWeek}</div>
                    <div className="label">Per Week</div>
                  </div>
                  <div className="metric-card">
                    <div className="value">{metrics.perShift}</div>
                    <div className="label">Per DOD Shift</div>
                  </div>
                  <div className="metric-card">
                    <div className="value">{metrics.daysRemaining}</div>
                    <div className="label">Days Left</div>
                  </div>
                </div>
                <p style={{ marginTop: 15, fontSize: '0.85rem', color: '#9ca3af' }}>
                  Period: {new Date(metrics.startDate).toLocaleDateString()} → {new Date(metrics.dueDate).toLocaleDateString()}
                </p>
              </div>
            );
          })()}
          
          {/* All Saved Connection Months */}
          {getSavedConnectionMonths().length > 0 && (
            <div style={{ marginTop: 30 }}>
              <h4 style={{ marginBottom: 15 }}>All Connection Periods</h4>
              <div className="folder-grid">
                {getSavedConnectionMonths().map(monthKey => {
                  const [year, month] = monthKey.split('-').map(Number);
                  const data = communityConnections[monthKey];
                  return (
                    <div key={monthKey} className={`month-folder ${monthKey === currentConnectionMonthKey ? 'active' : ''}`} onClick={() => { setSelectedConnectionMonth({ month: month - 1, year }); setNewConnection({ startDate: data.startDate, dueDate: data.dueDate, communitySize: data.communitySize.toString() }); }}>
                      <Folder size={24} />
                      <div className="month-folder-info">
                        <h4>{MONTHS[month - 1]} {year}</h4>
                        <p>{data.communitySize} people • Due: {new Date(data.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(5)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(7)}>Generate Schedule <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 7: Schedule View (FEATURES 3, 4, 5) */}
      {step === 7 && (
        <div className="card">
          <h2><CalendarDays size={24} /> Your Schedule</h2>
          
          {/* Hour Summary */}
          <div className="summary-grid">
            <div className="summary-item">
              <div className="label">Classes</div>
              <div className="value" style={{ color: BLOCK_COLORS.class.bg }}>{hourTotals.classes}h</div>
            </div>
            <div className="summary-item">
              <div className="label">Don Hours</div>
              <div className="value" style={{ color: BLOCK_COLORS.dod.bg }}>{hourTotals.dodWeekly + hourTotals.dodMonthly + hourTotals.rlm}h</div>
            </div>
            {viewMode === 'week' && (
              <div className="summary-item">
                <div className="label">DOD (Weekly)</div>
                <div className="value" style={{ color: '#f5d5a0' }}>{hourTotals.dodWeekly}h</div>
              </div>
            )}
            {viewMode === 'month' && (
              <div className="summary-item">
                <div className="label">DOD (Month)</div>
                <div className="value" style={{ color: '#f5d5a0' }}>{hourTotals.dodMonthly}h</div>
              </div>
            )}
            <div className="summary-item">
              <div className="label">Meetings</div>
              <div className="value" style={{ color: BLOCK_COLORS.meeting.bg }}>{hourTotals.meetings}h</div>
            </div>
            <div className="summary-item">
              <div className="label">Scheduled</div>
              <div className="value" style={{ color: '#34d399' }}>{Object.values(hourTotals.scheduled).reduce((a, b) => a + b, 0)}h</div>
            </div>
            <div className="summary-item" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <div className="label">Total</div>
              <div className="value">{hourTotals.total}h</div>
            </div>
          </div>
          
          {/* FEATURE 3: Block Palette for Drag-and-Drop */}
          <div className="block-palette">
            <span className="block-palette-label">Drag blocks to calendar:</span>
            {DRAGGABLE_BLOCK_TYPES.map(block => (
              <div key={block.id} className="block-palette-item" style={{ background: block.color.bg, color: block.color.text }} draggable onDragStart={() => handleBlockDragStart(block.id)} onDragEnd={handleBlockDragEnd}>
                <span>{block.name}</span>
                <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>{block.defaultHours}h</span>
              </div>
            ))}
          </div>
          
          {/* FEATURE 4: Smart Recommendations */}
          <div style={{ marginBottom: 20 }}>
            <button className="btn-secondary" onClick={generateRecommendations} style={{ marginRight: 10 }}>
              <Lightbulb size={18} /> Get Smart Recommendations
            </button>
          </div>
          
          {showRecommendations && recommendations.length > 0 && (
            <div className="recommendations-panel">
              <h3><Sparkles size={20} /> Recommended Time Blocks</h3>
              <p style={{ marginBottom: 15, fontSize: '0.9rem', color: '#9ca3af' }}>These suggestions help distribute your time evenly throughout the month.</p>
              {recommendations.map(rec => {
                const blockConfig = DRAGGABLE_BLOCK_TYPES.find(b => b.id === rec.type);
                return (
                  <div key={rec.id} className="recommendation-item">
                    <div className="rec-text">
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: blockConfig?.color.bg, display: 'inline-block' }}></span>
                      <span>{rec.message}</span>
                    </div>
                    <button onClick={() => applyRecommendation(rec)}>Apply</button>
                  </div>
                );
              })}
              <div className="rec-actions">
                <button className="btn-primary" onClick={applyAllRecommendations}>Apply All</button>
                <button className="btn-secondary" onClick={() => setShowRecommendations(false)}>Dismiss</button>
              </div>
            </div>
          )}
          
          {/* FEATURE 5: Month Navigation & View Toggle */}
          <div className="month-nav" style={{ marginBottom: 0 }}>
            <button onClick={() => navigateMonth(-1)}><ArrowLeft size={20} /></button>
            <h3>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button onClick={() => navigateMonth(1)}><ArrowRight size={20} /></button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div className="view-toggle">
              <button className={viewMode === 'month' ? 'active' : ''} onClick={() => setViewMode('month')}>
                <LayoutGrid size={16} /> Month
              </button>
              <button className={viewMode === 'week' ? 'active' : ''} onClick={() => { setViewMode('week'); if (!selectedWeek) setSelectedWeek(weeks[0]); }}>
                <List size={16} /> Week
              </button>
            </div>
          </div>
          
          {/* Monthly View */}
          {viewMode === 'month' && (
            <div className="calendar-grid">
              {DAYS.map(day => (
                <div key={day} className="calendar-header">{day.slice(0, 3)}</div>
              ))}
              {getMonthlyCalendarData().map((day, i) => (
                <div key={i} className={`calendar-day ${day.date === null ? 'empty' : ''} ${draggedBlockType ? 'drop-target' : ''}`} onDragOver={(e) => { e.preventDefault(); }} onDrop={() => day.dateStr && handleBlockDrop(day.dateStr, 12)}>
                  {day.date && (
                    <>
                      <div className="date">{day.date}</div>
                      {day.events.slice(0, 4).map((event, j) => (
                        <div key={j} className={`event ${event.blockId ? 'removable' : ''}`} style={{ background: BLOCK_COLORS[event.type]?.bg || '#666', color: BLOCK_COLORS[event.type]?.text || '#fff' }} onClick={() => event.blockId && removeScheduledBlock(event.dateStr, event.blockId)}>
                          {event.name}
                          {event.blockId && <span className="remove-btn">×</span>}
                        </div>
                      ))}
                      {day.events.length > 4 && (
                        <div className="event" style={{ background: 'rgba(255,255,255,0.1)', color: '#9ca3af' }}>+{day.events.length - 4} more</div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Weekly View */}
          {viewMode === 'week' && selectedWeek && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                {weeks.map((week, i) => (
                  <button key={i} className={`btn-secondary ${selectedWeek === week ? 'active' : ''}`} style={selectedWeek === week ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderColor: 'transparent' } : {}} onClick={() => setSelectedWeek(week)}>
                    Week {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="weekly-grid">
                <div className="weekly-header"></div>
                {DAYS.map((day, i) => {
                  const date = new Date(selectedWeek.start);
                  date.setDate(date.getDate() + i);
                  return (
                    <div key={day} className="weekly-header">
                      {day.slice(0, 3)} {date.getDate()}
                    </div>
                  );
                })}
                
                {HOURS.map(hour => (
                  <React.Fragment key={hour}>
                    <div className="weekly-time">{formatTime(hour)}</div>
                    {DAYS.map((day, dayIdx) => {
                      const date = new Date(selectedWeek.start);
                      date.setDate(date.getDate() + dayIdx);
                      const dateStr = date.toISOString().split('T')[0];
                      
                      // Get blocks for this cell
                      const blocks = [];
                      
                      // Classes
                      classes.filter(c => c.day === day && c.startTime === hour).forEach(c => {
                        blocks.push({ type: 'class', name: c.name, duration: c.endTime - c.startTime, locked: true });
                      });
                      
                      // DOD
                      if (dodShifts.includes(day) && hour === 20) {
                        blocks.push({ type: 'dod', name: 'DOD', duration: 3, locked: true });
                      }
                      
                      // Meetings
                      Object.entries(meetings).forEach(([type, slots]) => {
                        slots.filter(s => s.day === day && parseInt(s.time.split(':')[0]) === hour).forEach(() => {
                          const meeting = MEETING_TYPES.find(m => m.id === type);
                          blocks.push({ type: 'meeting', name: meeting?.name || type, duration: meeting?.duration || 1, locked: true });
                        });
                      });
                      
                      // Scheduled blocks (drag-and-drop)
                      const dayBlocks = scheduledBlocks[dateStr] || [];
                      dayBlocks.filter(b => b.startHour === hour).forEach(b => {
                        blocks.push({ type: b.type, name: b.name, duration: b.hours, locked: false, blockId: b.id, dateStr });
                      });
                      
                      // Meals
                      const meals = weeklyMeals[day];
                      if (meals) {
                        if (meals.breakfast.start === hour) blocks.push({ type: 'breakfast', name: 'Breakfast', duration: 1, locked: false });
                        if (meals.lunch.start === hour) blocks.push({ type: 'lunch', name: 'Lunch', duration: 1, locked: false });
                        if (meals.dinner.start === hour) blocks.push({ type: 'dinner', name: 'Dinner', duration: 1, locked: false });
                      }
                      
                      return (
                        <div key={`${day}-${hour}`} className={`weekly-cell ${draggedBlockType ? 'drop-target' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={() => handleBlockDrop(dateStr, hour)}>
                          {blocks.map((block, bi) => (
                            <div key={bi} className={`weekly-block ${block.locked ? 'locked' : 'draggable'}`} style={{ background: BLOCK_COLORS[block.type]?.bg || '#666', color: BLOCK_COLORS[block.type]?.text || '#fff', height: `${block.duration * 35 - 4}px` }} onClick={() => block.blockId && removeScheduledBlock(block.dateStr, block.blockId)}>
                              {block.name}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          
          {/* Connection Info */}
          {(() => {
            const monthKey = getMonthKey(selectedMonth.month, selectedMonth.year);
            const metrics = getConnectionMetrics(monthKey);
            if (!metrics) return null;
            return (
              <div style={{ marginTop: 20, padding: 15, background: 'rgba(134, 197, 184, 0.1)', borderRadius: 10 }}>
                <h4 style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={18} /> Connection Target This Month
                </h4>
                <p>{metrics.total} people • {metrics.perWeek}/week • {metrics.perShift}/DOD shift • {metrics.daysRemaining} days remaining</p>
              </div>
            );
          })()}
          
          <div className="nav-buttons">
            <button className="btn-add" onClick={() => setStep('connections')}><ChevronLeft size={20} /> Edit</button>
            <button className="btn-danger" onClick={() => setStep(1)}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}
