import React, { useState, useRef, useMemo } from 'react';
import { Upload, Plus, X, Calendar, Clock, Users, BookOpen, Image, ChevronRight, ChevronLeft, GripVertical, Lock, PartyPopper, UserCheck, Trash2, MessageCircle, Eye, Check, AlertCircle, Target, TrendingUp, CalendarDays, ArrowLeft, ArrowRight, Layers, FileText } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// RLM Calendar Data extracted from the PDF
const RLM_EVENTS = {
  '2025-08': [
    { date: 31, type: 'major', title: 'Move In Day', category: 'event' },
  ],
  '2025-09': [
    { date: 1, type: 'deadline', title: 'First Community Meeting', category: 'meeting' },
    { date: 4, type: 'academic', title: 'First Day of Classes', category: 'academic' },
    { date: 6, type: 'deadline', title: 'Open EB StarRez Report #1', category: 'report' },
    { date: 7, type: 'deadline', title: 'Community Meeting #2', category: 'meeting' },
    { date: 8, type: 'deadline', title: 'StarRez Community Connection #1 Due', category: 'connection' },
    { date: 12, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 14, type: 'deadline', title: 'Open BTE StarRez Report #1', category: 'report' },
    { date: 15, type: 'deadline', title: 'Roommate Agreements Due (trad)', category: 'admin' },
    { date: 19, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 21, type: 'deadline', title: 'Close EB StarRez Report #1', category: 'report' },
    { date: 22, type: 'deadline', title: 'Roommate Agreements Due (apt)', category: 'admin' },
    { date: 26, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 28, type: 'deadline', title: 'Community Meeting #3', category: 'meeting' },
    { date: 30, type: 'holiday', title: 'National Day of Truth & Reconciliation', category: 'holiday' },
  ],
  '2025-10': [
    { date: 4, type: 'event', title: 'Head of the Trent Regatta', category: 'event' },
    { date: 5, type: 'deadline', title: 'Close BTE StarRez Report #1', category: 'report' },
    { date: 12, type: 'deadline', title: 'StarRez Community Connection #2', category: 'connection' },
    { date: 13, type: 'holiday', title: 'Thanksgiving (Closed)', category: 'holiday' },
    { date: 17, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 19, type: 'deadline', title: 'Open EB StarRez Report #2', category: 'report' },
    { date: 19, type: 'deadline', title: 'Open BTE StarRez Report #2', category: 'report' },
    { date: 20, type: 'break', title: 'Reading Week Begins', category: 'break' },
    { date: 23, type: 'deadline', title: 'Term Poster Turnover Due', category: 'admin' },
    { date: 26, type: 'deadline', title: 'Community Meeting #4', category: 'meeting' },
    { date: 27, type: 'academic', title: 'Classes Resume', category: 'academic' },
    { date: 31, type: 'event', title: 'Haunted Drumlin', category: 'event' },
  ],
  '2025-11': [
    { date: 6, type: 'deadline', title: 'Close BTE StarRez Report #2', category: 'report' },
    { date: 7, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 8, type: 'holiday', title: 'Indigenous Veterans Day', category: 'holiday' },
    { date: 11, type: 'holiday', title: 'Remembrance Day', category: 'holiday' },
    { date: 14, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 21, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 28, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 30, type: 'deadline', title: 'Community Meeting #5', category: 'meeting' },
  ],
  '2025-12': [
    { date: 3, type: 'academic', title: 'Last Day of Classes', category: 'academic' },
    { date: 3, type: 'deadline', title: 'Close BTE StarRez Report #2', category: 'report' },
    { date: 5, type: 'academic', title: 'Exam Period Begins', category: 'academic' },
    { date: 18, type: 'academic', title: 'Exam Period Ends', category: 'academic' },
    { date: 19, type: 'deadline', title: 'Room Checks (Winter Move Out)', category: 'admin' },
    { date: 20, type: 'break', title: 'Winter Break Begins', category: 'break' },
  ],
  '2026-01': [
    { date: 3, type: 'deadline', title: 'Term 3 Poster Turnover', category: 'admin' },
    { date: 4, type: 'major', title: 'Student Welcome Session', category: 'event' },
    { date: 5, type: 'major', title: 'Winter Move In', category: 'event' },
    { date: 5, type: 'deadline', title: 'Open EB StarRez Report #3', category: 'report' },
    { date: 7, type: 'academic', title: 'Classes Resume', category: 'academic' },
    { date: 11, type: 'deadline', title: 'Community Meeting #6', category: 'meeting' },
    { date: 12, type: 'deadline', title: 'Open BTE StarRez Report #3', category: 'report' },
    { date: 16, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 18, type: 'deadline', title: 'Roommate Agreements Due (trad)', category: 'admin' },
    { date: 19, type: 'deadline', title: 'StarRez Community Connection #3', category: 'connection' },
    { date: 23, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 25, type: 'deadline', title: 'Roommate Agreements Due (apt)', category: 'admin' },
    { date: 26, type: 'deadline', title: 'Close EB StarRez Report #3', category: 'report' },
    { date: 30, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
  ],
  '2026-02': [
    { date: 6, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 8, type: 'deadline', title: 'Community Meeting #7', category: 'meeting' },
    { date: 9, type: 'deadline', title: 'Open EB StarRez Report #4', category: 'report' },
    { date: 9, type: 'deadline', title: 'Close BTE StarRez Report #3', category: 'report' },
    { date: 13, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 14, type: 'holiday', title: "Valentine's Day", category: 'holiday' },
    { date: 16, type: 'holiday', title: 'Family Day (Closed)', category: 'holiday' },
    { date: 16, type: 'break', title: 'Reading Week Begins', category: 'break' },
    { date: 19, type: 'deadline', title: 'Term Poster Turnover Due', category: 'admin' },
    { date: 23, type: 'academic', title: 'Classes Resume', category: 'academic' },
    { date: 23, type: 'deadline', title: 'Open BTE StarRez Report #4', category: 'report' },
    { date: 27, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
  ],
  '2026-03': [
    { date: 6, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 8, type: 'deadline', title: 'Community Meeting #8', category: 'meeting' },
    { date: 8, type: 'holiday', title: "International Women's Day", category: 'holiday' },
    { date: 9, type: 'deadline', title: 'StarRez Community Connection #4', category: 'connection' },
    { date: 13, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 17, type: 'holiday', title: "St. Patrick's Day", category: 'holiday' },
    { date: 20, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 27, type: 'event', title: 'Friday Night Hangout', category: 'fnh' },
    { date: 29, type: 'deadline', title: 'Community Meeting #9', category: 'meeting' },
    { date: 30, type: 'deadline', title: 'Close EB StarRez Report #4', category: 'report' },
    { date: 30, type: 'deadline', title: 'Close BTE StarRez Report #3', category: 'report' },
    { date: 31, type: 'holiday', title: 'International Trans Day of Visibility', category: 'holiday' },
  ],
  '2026-04': [
    { date: 3, type: 'holiday', title: 'Good Friday (Closed)', category: 'holiday' },
    { date: 7, type: 'academic', title: 'Last Day of Classes', category: 'academic' },
    { date: 10, type: 'academic', title: 'Exam Period Begins', category: 'academic' },
    { date: 23, type: 'academic', title: 'Exam Period Ends', category: 'academic' },
    { date: 30, type: 'deadline', title: 'Room Checks (Summer Move Out)', category: 'admin' },
    { date: 30, type: 'major', title: 'Residence Closed', category: 'event' },
  ],
};

// Term Learning Outcomes
const TERM_OUTCOMES = {
  1: {
    name: 'Term 1',
    months: ['September', 'October'],
    outcomes: [
      { area: 'Personal Development', outcome: 'Students will be able to identify what affects their wellbeing.' },
      { area: 'Community Engagement', outcome: 'Students will be able to identify which communities they belong to.' },
      { area: 'Academic Exploration', outcome: 'Students will be able to identify skills and supports that contribute to meeting their personal and academic goals.' },
      { area: 'DEDI', outcome: 'Students will understand how their personal values, attitudes, beliefs, and bias impact a lens of Equity, Diversity, Inclusion.' },
    ]
  },
  2: {
    name: 'Term 2',
    months: ['November', 'December'],
    outcomes: [
      { area: 'Personal Development', outcome: 'Students will understand strategies that positively affect their wellbeing.' },
      { area: 'Community Engagement', outcome: 'Students will understand and be able to describe what they gain from being a member of community.' },
      { area: 'Academic Exploration', outcome: 'Students will be able to adapt their living environment to be conducive to academic success.' },
      { area: 'DEDI', outcome: 'Students will understand how EDII concepts apply to Trent\'s residence spaces and globally.' },
    ]
  },
  3: {
    name: 'Term 3',
    months: ['January', 'February'],
    outcomes: [
      { area: 'Personal Development', outcome: 'Students will develop skills for independent living.' },
      { area: 'Community Engagement', outcome: 'Students will understand that communities have diverse backgrounds and perspectives.' },
      { area: 'Academic Exploration', outcome: 'Students will feel confident in exploring their individual learning style and how to apply it.' },
      { area: 'DEDI', outcome: 'Students will understand which campus partners and services provide support with a focus on DEDI.' },
    ]
  },
  4: {
    name: 'Term 4',
    months: ['March', 'April'],
    outcomes: [
      { area: 'Personal Development', outcome: 'Students will understand what elements are needed for their optimal living environment.' },
      { area: 'Community Engagement', outcome: 'Students will be able to identify resources in multiple dimensions of community.' },
      { area: 'Academic Exploration', outcome: 'Students will be able to articulate their rights and responsibilities as a student.' },
      { area: 'DEDI', outcome: 'Students will be able to engage in conversations with individuals who have differing values in a respectful manner.' },
    ]
  }
};

const BLOCK_TYPES = [
  { type: 'meal', name: 'Meal', locked: false },
  { type: 'study', name: 'Study', locked: false },
  { type: 'personal', name: 'Personal', locked: false },
  { type: 'social', name: 'Social', locked: false },
];

const MEETING_TYPES = [
  { id: 'team', name: 'Team Meeting', frequency: 'Weekly', duration: '1 hour', color: '#86c5b8' },
  { id: 'senior', name: 'Senior Don 1:1', frequency: 'Monthly', duration: '30 min', color: '#b8a9c9' },
  { id: 'rlc', name: 'RLC Meeting', frequency: 'Bi-weekly', duration: '30 min', color: '#e8c4a0' },
  { id: 'community', name: 'Community Meeting', frequency: 'As scheduled', duration: '30 min', color: '#d4a5a5' },
];

// Don duty target hours per week
const DON_WEEKLY_HOURS_TARGET = 15;

export default function DonScheduler() {
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '', day: 'Monday', startTime: '9', endTime: '10' });
  const [classImages, setClassImages] = useState([]);
  const [rlmImage, setRlmImage] = useState(null);
  const [dodShifts, setDodShifts] = useState([]);
  const [newDodDay, setNewDodDay] = useState('Monday');
  const [fridayHangouts, setFridayHangouts] = useState([]);
  const [newFNH, setNewFNH] = useState({ date: '', startTime: '19:00', endTime: '21:00' });
  const [meetings, setMeetings] = useState({ team: [], senior: [], rlc: [], community: [] });
  const [newMeeting, setNewMeeting] = useState({ type: 'team', day: 'Monday', time: '19:00' });
  
  const [communitySize, setCommunitySize] = useState('');
  const [connectionStartDate, setConnectionStartDate] = useState('');
  const [connectionDueDate, setConnectionDueDate] = useState('');
  
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [showImageModal, setShowImageModal] = useState(null);
  const [editMode, setEditMode] = useState('drag');
  const [showAddModal, setShowAddModal] = useState(null);
  const [isDraggingClass, setIsDraggingClass] = useState(false);
  const [isDraggingRLM, setIsDraggingRLM] = useState(false);

  // Monthly planner state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'schedule'

  const classInputRef = useRef(null);
  const rlmInputRef = useRef(null);

  // Get events for selected month
  const getMonthEvents = (month, year) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    return RLM_EVENTS[key] || [];
  };

  // Get weeks in a month
  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    
    let currentDate = new Date(firstDay);
    // Adjust to start of week (Monday)
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentDate.setDate(currentDate.getDate() + diff);
    
    while (currentDate <= lastDay || weeks.length < 1) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        start: new Date(weekStart),
        end: new Date(weekEnd),
        weekNumber: weeks.length + 1
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
      if (weeks.length >= 6) break;
    }
    
    return weeks;
  };

  // Calculate don duty hours for the week
  const calculateWeeklyDonHours = () => {
    let hours = 0;
    
    // DOD shifts: ~3 hours each (8pm-11pm weekdays or 8pm-1am weekends)
    hours += dodShifts.length * 3;
    
    // FNH hours (variable)
    hours += fridayHangouts.reduce((sum, fnh) => sum + (fnh.hours || 2), 0) / 4; // Averaged per week
    
    // Meetings (1 hour team meeting weekly, others average)
    const meetingHours = meetings.team.length * 1 + 
                        meetings.senior.length * 0.5 / 4 + // monthly
                        meetings.rlc.length * 0.5 / 2 + // bi-weekly
                        meetings.community.length * 0.5;
    hours += meetingHours;
    
    // Connection conversations (estimate 15 min each)
    const connectionStats = calculateConnections();
    hours += (connectionStats.perWeek * 0.25);
    
    return Math.round(hours * 10) / 10;
  };

  // Get current term based on month
  const getCurrentTerm = (month) => {
    const monthName = MONTHS[month];
    for (const [termNum, termData] of Object.entries(TERM_OUTCOMES)) {
      if (termData.months.includes(monthName)) {
        return { num: parseInt(termNum), ...termData };
      }
    }
    return null;
  };

  const handleClassFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setClassImages(prev => [...prev, { data: e.target.result, name: file.name }]);
        reader.readAsDataURL(file);
      }
    });
    if (classInputRef.current) classInputRef.current.value = '';
  };

  const handleRLMFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setRlmImage(e.target.result);
      reader.readAsDataURL(file);
    }
    if (rlmInputRef.current) rlmInputRef.current.value = '';
  };

  const handleClassDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingClass(true); };
  const handleClassDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingClass(false); };
  const handleClassDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDraggingClass(false);
    Array.from(e.dataTransfer.files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setClassImages(prev => [...prev, { data: e.target.result, name: file.name }]);
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRLMDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingRLM(true); };
  const handleRLMDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingRLM(false); };
  const handleRLMDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDraggingRLM(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setRlmImage(e.target.result);
      reader.readAsDataURL(file);
    }
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
    setNewMeeting({ type: 'team', day: 'Monday', time: '19:00' });
  };

  const removeMeeting = (type, id) => {
    setMeetings(prev => ({ ...prev, [type]: prev[type].filter(m => m.id !== id) }));
  };

  const calculateFNHHours = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return Math.max(0, ((endH * 60 + endM) - (startH * 60 + startM)) / 60).toFixed(1);
  };

  const addFNH = () => {
    if (newFNH.date && newFNH.startTime && newFNH.endTime) {
      setFridayHangouts([...fridayHangouts, { ...newFNH, id: Date.now(), hours: parseFloat(calculateFNHHours(newFNH.startTime, newFNH.endTime)) }]);
      setNewFNH({ date: '', startTime: '19:00', endTime: '21:00' });
    }
  };

  const calculateConnections = () => {
    const size = parseInt(communitySize) || 0;
    if (!connectionStartDate || !connectionDueDate || size === 0) {
      return { total: size, totalDays: 0, perDay: 0, perWeek: 0, perDODShift: 0 };
    }
    const start = new Date(connectionStartDate);
    const due = new Date(connectionDueDate);
    const totalDays = Math.max(1, Math.ceil((due - start) / (24 * 60 * 60 * 1000)));
    const totalWeeks = Math.max(1, totalDays / 7);
    const perDay = Math.ceil(size / totalDays);
    const perWeek = Math.ceil(size / totalWeeks);
    const dodShiftCount = dodShifts.length || 1;
    const totalDODShifts = Math.ceil(totalWeeks) * dodShiftCount;
    const perDODShift = Math.ceil(size / Math.max(1, totalDODShifts));
    
    return { total: size, totalDays, perDay, perWeek, perDODShift };
  };

  const generateSchedule = () => {
    const schedule = {};
    DAYS.forEach(day => { schedule[day] = HOURS.map(hour => ({ hour, block: null })); });

    classes.forEach(cls => {
      const daySchedule = schedule[cls.day];
      if (daySchedule) {
        for (let h = parseInt(cls.startTime); h < parseInt(cls.endTime); h++) {
          const slot = daySchedule.find(d => d.hour === h);
          if (slot && !slot.block) slot.block = { type: 'class', name: cls.name, locked: true };
        }
      }
    });

    dodShifts.forEach(day => {
      for (let h = 20; h <= 22; h++) {
        const slot = schedule[day]?.find(d => d.hour === h);
        if (slot && !slot.block) slot.block = { type: 'dod', name: 'DOD', locked: true };
      }
    });

    const connectionStats = calculateConnections();
    if (connectionStats.perDODShift > 0) {
      dodShifts.forEach(day => {
        const slot = schedule[day]?.find(d => d.hour === 19);
        if (slot && !slot.block) {
          slot.block = { type: 'connection', name: `${connectionStats.perDODShift} Connects`, locked: true };
        }
      });
    }

    fridayHangouts.forEach(fnh => {
      const startH = parseInt(fnh.startTime.split(':')[0]);
      const endH = parseInt(fnh.endTime.split(':')[0]);
      for (let h = startH; h < endH; h++) {
        const slot = schedule['Friday']?.find(d => d.hour === h);
        if (slot && !slot.block) slot.block = { type: 'hangout', name: 'FNH', locked: true };
      }
    });

    Object.entries(meetings).forEach(([type, meetingList]) => {
      meetingList.forEach(meeting => {
        const hour = parseInt(meeting.time.split(':')[0]);
        const slot = schedule[meeting.day]?.find(d => d.hour === hour);
        if (slot && !slot.block) {
          slot.block = { 
            type: 'meeting', 
            name: type === 'team' ? 'Team' : type === 'senior' ? 'SD 1:1' : type === 'rlc' ? 'RLC' : 'Comm',
            locked: true
          };
        }
      });
    });

    [{ name: 'Breakfast', start: 8, end: 9 }, { name: 'Lunch', start: 12, end: 13 }, { name: 'Dinner', start: 18, end: 19 }].forEach(meal => {
      DAYS.forEach(day => {
        for (let h = meal.start; h < meal.end; h++) {
          const slot = schedule[day].find(d => d.hour === h);
          if (slot && !slot.block) slot.block = { type: 'meal', name: meal.name, locked: false };
        }
      });
    });

    let classHours = 0;
    DAYS.forEach(day => {
      schedule[day].forEach(slot => {
        if (slot.block?.type === 'class') classHours++;
      });
    });

    const targetStudyHours = Math.max(0, 20 - classHours);
    let studyAdded = 0;
    const studyTimes = [9, 10, 11, 14, 15, 16];
    
    for (const day of DAYS) {
      if (studyAdded >= targetStudyHours) break;
      for (const h of studyTimes) {
        if (studyAdded >= targetStudyHours) break;
        const slot = schedule[day].find(d => d.hour === h);
        if (slot && !slot.block) {
          slot.block = { type: 'study', name: 'Study', locked: false };
          studyAdded++;
        }
      }
    }

    let personalAdded = 0;
    const personalTimes = [17, 21, 22];
    
    for (const day of DAYS) {
      if (personalAdded >= 5) break;
      for (const h of personalTimes) {
        if (personalAdded >= 5) break;
        const slot = schedule[day].find(d => d.hour === h);
        if (slot && !slot.block) {
          slot.block = { type: 'personal', name: 'Personal', locked: false };
          personalAdded++;
        }
      }
    }

    let socialAdded = 0;
    for (const day of DAYS) {
      if (socialAdded >= 5) break;
      for (let h = 19; h <= 22; h++) {
        if (socialAdded >= 5) break;
        const slot = schedule[day].find(d => d.hour === h);
        if (slot && !slot.block) {
          slot.block = { type: 'social', name: 'Social', locked: false };
          socialAdded++;
        }
      }
    }

    setGeneratedSchedule(schedule);
    setStep(8);
  };

  const handleBlockDrop = (targetDay, targetHour) => {
    if (!draggedBlock || !generatedSchedule) return;
    const targetSlot = generatedSchedule[targetDay].find(d => d.hour === targetHour);
    if (!targetSlot || targetSlot.block?.locked) return;
    const newSchedule = { ...generatedSchedule };
    const sourceSlot = newSchedule[draggedBlock.day].find(d => d.hour === draggedBlock.hour);
    const temp = sourceSlot.block;
    sourceSlot.block = targetSlot.block;
    targetSlot.block = temp;
    setGeneratedSchedule(newSchedule);
    setDraggedBlock(null);
  };

  const handleCellClick = (day, hour) => {
    if (!generatedSchedule) return;
    const slot = generatedSchedule[day].find(d => d.hour === hour);
    if (editMode === 'delete' && slot?.block && !slot.block.locked) {
      const newSchedule = { ...generatedSchedule };
      newSchedule[day].find(d => d.hour === hour).block = null;
      setGeneratedSchedule(newSchedule);
    } else if (editMode === 'add' && !slot?.block) {
      setShowAddModal({ day, hour });
    }
  };

  const addBlockToSchedule = (day, hour, type) => {
    if (!generatedSchedule) return;
    const newSchedule = { ...generatedSchedule };
    const slot = newSchedule[day].find(d => d.hour === hour);
    if (slot && !slot.block) {
      const names = { meal: 'Meal', study: 'Study', personal: 'Personal', social: 'Social' };
      slot.block = { type, name: names[type], locked: false };
      setGeneratedSchedule(newSchedule);
    }
    setShowAddModal(null);
  };

  const calculateCategoryHours = () => {
    if (!generatedSchedule) return {};
    const hours = { class: 0, dod: 0, hangout: 0, meeting: 0, connection: 0, meal: 0, study: 0, personal: 0, social: 0 };
    DAYS.forEach(day => {
      generatedSchedule[day].forEach(slot => {
        if (slot.block) hours[slot.block.type] = (hours[slot.block.type] || 0) + 1;
      });
    });
    return hours;
  };

  const categoryHours = calculateCategoryHours();
  const connectionStats = calculateConnections();
  const totalFNHHours = fridayHangouts.reduce((sum, f) => sum + (f.hours || 0), 0);
  const weeklyDonHours = calculateWeeklyDonHours();
  const donHoursStatus = weeklyDonHours >= DON_WEEKLY_HOURS_TARGET ? 'good' : weeklyDonHours >= DON_WEEKLY_HOURS_TARGET - 3 ? 'warning' : 'low';

  // Pastel color scheme
  const getBlockStyle = (type) => ({
    class: { background: '#a8c5e2', color: '#2c3e50' },
    dod: { background: '#f5d5a0', color: '#5d4e37' },
    hangout: { background: '#e8b4c8', color: '#4a3540' },
    meeting: { background: '#9dd5c8', color: '#2d4a44' },
    connection: { background: '#c5b3d9', color: '#3d3250' },
    meal: { background: '#f0b8b8', color: '#4a3535' },
    personal: { background: '#b8d4e8', color: '#2d4050' },
    study: { background: '#f5e6a3', color: '#4a4530' },
    social: { background: '#c8e6c9', color: '#2d4a2d' }
  }[type] || {});

  const getEventColor = (category) => ({
    meeting: '#9dd5c8',
    report: '#f5d5a0',
    fnh: '#e8b4c8',
    connection: '#c5b3d9',
    admin: '#b8d4e8',
    academic: '#a8c5e2',
    event: '#c8e6c9',
    holiday: '#f0b8b8',
    break: '#f5e6a3',
    major: '#667eea'
  }[category] || '#888');

  const formatHour = (h) => h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
  const formatDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); const hour = h % 12 || 12; return `${hour}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

  const monthEvents = getMonthEvents(selectedMonth.month, selectedMonth.year);
  const weeksInMonth = getWeeksInMonth(selectedMonth.month, selectedMonth.year);
  const currentTerm = getCurrentTerm(selectedMonth.month);

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

  // Generate calendar days for the month
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedMonth.year, selectedMonth.month, 1);
    const lastDay = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
    const days = [];
    
    // Adjust for Monday start
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    // Add empty cells for days before the first
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, events: [] });
    }
    
    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dayEvents = monthEvents.filter(e => e.date === d);
      days.push({ day: d, events: dayEvents });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1628 0%, #1a2744 50%, #0d1a2d 100%)', fontFamily: "'Outfit', sans-serif", color: '#e8ecf4', padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .glass-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; margin-bottom: 20px; }
        .step-indicator { display: flex; gap: 6px; margin-bottom: 30px; justify-content: center; flex-wrap: wrap; }
        .step-dot { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
        .step-dot.active { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); box-shadow: 0 8px 32px rgba(59,130,246,0.3); transform: scale(1.05); }
        .step-dot.completed { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: #0a1628; }
        .step-dot.inactive { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
        .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: none; padding: 14px 28px; border-radius: 12px; color: white; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
        .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 12px 24px; border-radius: 12px; color: white; font-weight: 500; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .btn-add { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .btn-add:hover { background: rgba(16,185,129,0.25); }
        .input-field { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: white; font-size: 15px; width: 100%; font-family: inherit; transition: all 0.2s; }
        .input-field:focus { outline: none; border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        select.input-field option { background: #1a2744; color: white; }
        .tag { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 20px; margin: 4px; font-size: 13px; font-weight: 500; }
        .tag button { background: rgba(255,255,255,0.2); border: none; width: 20px; height: 20px; border-radius: 50%; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .tag.class { background: #a8c5e2; color: #2c3e50; }
        .tag.dod { background: #f5d5a0; color: #5d4e37; }
        .tag.meeting { background: #9dd5c8; color: #2d4a44; }
        .tag.fnh { background: #e8b4c8; color: #4a3540; }
        .upload-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 16px; padding: 36px; text-align: center; cursor: pointer; transition: all 0.3s; }
        .upload-zone:hover, .upload-zone.dragging { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        .stat-card { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1)); border-radius: 14px; padding: 18px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
        .stat-number { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
        .schedule-grid { display: grid; grid-template-columns: 50px repeat(7, 1fr); gap: 2px; font-size: 10px; }
        .schedule-header { background: rgba(59,130,246,0.2); padding: 10px 4px; text-align: center; font-weight: 600; border-radius: 6px; font-size: 11px; }
        .schedule-time { background: rgba(255,255,255,0.03); padding: 6px 2px; text-align: center; font-size: 9px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
        .schedule-cell { min-height: 36px; border-radius: 4px; padding: 2px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 600; font-size: 8px; position: relative; cursor: pointer; transition: all 0.2s; }
        .schedule-cell.draggable { cursor: grab; }
        .schedule-cell.draggable:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .schedule-cell.drag-over { outline: 2px dashed #3b82f6; }
        .schedule-cell.delete-mode:hover { outline: 2px solid #ef4444; }
        .schedule-cell.add-mode:hover { outline: 2px solid #10b981; }
        .legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; justify-content: center; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; padding: 5px 10px; background: rgba(255,255,255,0.04); border-radius: 6px; }
        .legend-color { width: 12px; height: 12px; border-radius: 3px; }
        .legend-hours { opacity: 0.6; font-size: 10px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: rgba(26,39,68,0.98); border-radius: 20px; padding: 28px; max-width: 500px; width: 100%; border: 1px solid rgba(255,255,255,0.1); }
        h1 { font-family: 'Fraunces', serif; font-size: 38px; text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1px; }
        h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .subtitle { text-align: center; opacity: 0.5; margin-bottom: 28px; font-size: 15px; font-weight: 400; }
        .section-desc { opacity: 0.6; margin-bottom: 18px; font-size: 14px; }
        .nav-buttons { display: flex; justify-content: space-between; margin-top: 24px; }
        .form-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
        .edit-toolbar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .edit-btn { padding: 8px 14px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; font-family: inherit; font-weight: 600; font-size: 12px; display: flex; align-items: center; gap: 5px; transition: all 0.2s; }
        .edit-btn.active { transform: scale(1.02); }
        .edit-btn.drag { background: rgba(59,130,246,0.15); color: #60a5fa; border-color: rgba(59,130,246,0.3); }
        .edit-btn.drag.active { background: rgba(59,130,246,0.3); border-color: #60a5fa; }
        .edit-btn.delete { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }
        .edit-btn.delete.active { background: rgba(239,68,68,0.3); border-color: #f87171; }
        .edit-btn.add { background: rgba(16,185,129,0.15); color: #34d399; border-color: rgba(16,185,129,0.3); }
        .edit-btn.add.active { background: rgba(16,185,129,0.3); border-color: #34d399; }
        .add-block-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
        .add-block-btn { padding: 14px; border-radius: 10px; border: none; cursor: pointer; font-family: inherit; font-weight: 600; font-size: 13px; transition: all 0.2s; }
        .add-block-btn:hover { transform: scale(1.02); }
        .image-preview { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
        .image-preview img { width: 72px; height: 54px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1); }
        .hidden-input { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
        .meeting-type-card { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 14px; margin-bottom: 12px; border-left: 3px solid; }
        .meeting-type-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .meeting-type-name { font-weight: 600; font-size: 15px; }
        .meeting-type-freq { font-size: 11px; opacity: 0.6; }
        .meeting-type-duration { font-size: 10px; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 8px; margin-left: 8px; }
        .highlight-box { background: linear-gradient(135deg, rgba(197,179,217,0.15), rgba(168,197,226,0.15)); border: 1px solid rgba(197,179,217,0.25); border-radius: 14px; padding: 18px; margin-top: 18px; }
        .highlight-box h3 { color: #c5b3d9; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; font-size: 16px; }
        
        /* Monthly Calendar Styles */
        .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .month-nav h2 { margin: 0; }
        .month-nav-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; transition: all 0.2s; }
        .month-nav-btn:hover { background: rgba(255,255,255,0.12); }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .calendar-header { text-align: center; font-weight: 600; font-size: 12px; padding: 10px 4px; color: rgba(255,255,255,0.5); }
        .calendar-day { min-height: 90px; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .calendar-day:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
        .calendar-day.empty { background: transparent; cursor: default; }
        .calendar-day.today { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        .calendar-day-number { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .calendar-event { font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
        .calendar-event-more { font-size: 9px; opacity: 0.6; margin-top: 2px; }
        
        /* Week View Styles */
        .week-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; }
        .week-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .week-card.selected { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        .week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .week-title { font-weight: 600; font-size: 15px; }
        .week-dates { font-size: 12px; opacity: 0.6; }
        .week-events { display: flex; flex-wrap: wrap; gap: 4px; }
        .week-event-tag { font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 500; }
        
        /* Don Hours Tracker */
        .hours-tracker { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1)); border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); }
        .hours-tracker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .hours-tracker-title { font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px; }
        .hours-progress { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .hours-progress-bar { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .hours-progress-bar.good { background: linear-gradient(90deg, #10b981, #34d399); }
        .hours-progress-bar.warning { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .hours-progress-bar.low { background: linear-gradient(90deg, #ef4444, #f87171); }
        .hours-breakdown { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 14px; }
        .hours-item { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 10px; text-align: center; }
        .hours-item-value { font-size: 18px; font-weight: 700; }
        .hours-item-label { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Term Info */
        .term-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
        .term-outcomes { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; margin-top: 16px; }
        .term-outcome-item { display: flex; gap: 12px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .term-outcome-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .term-outcome-area { font-size: 11px; font-weight: 600; color: #60a5fa; white-space: nowrap; min-width: 100px; }
        .term-outcome-text { font-size: 12px; opacity: 0.8; }
        
        /* View Toggle */
        .view-toggle { display: flex; gap: 4px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px; }
        .view-toggle-btn { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.6); font-family: inherit; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .view-toggle-btn.active { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .view-toggle-btn:hover:not(.active) { color: white; }
      `}</style>

      <input type="file" ref={classInputRef} className="hidden-input" accept="image/*" onChange={handleClassFileSelect} />
      <input type="file" ref={rlmInputRef} className="hidden-input" accept="image/*" onChange={handleRLMFileSelect} />

      <h1>Don Schedule Manager</h1>
      <p className="subtitle">Plan your month • Track your hours • Balance your life</p>

      <div className="step-indicator">
        {[1,2,3,4,5,6,7,8].map(s => (
          <div key={s} className={`step-dot ${step === s ? 'active' : step > s ? 'completed' : 'inactive'}`} onClick={() => s <= step && setStep(s)}>
            {step > s ? '✓' : s}
          </div>
        ))}
      </div>

      {/* Step 1: Monthly Planner */}
      {step === 1 && (
        <div className="glass-card" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2><CalendarDays size={24} /> Monthly Planner</h2>
            <div className="view-toggle">
              <button className={`view-toggle-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>
                <Calendar size={16} /> Month
              </button>
              <button className={`view-toggle-btn ${viewMode === 'week' ? 'active' : ''}`} onClick={() => setViewMode('week')}>
                <Layers size={16} /> Weeks
              </button>
            </div>
          </div>

          {/* Don Hours Tracker */}
          <div className="hours-tracker">
            <div className="hours-tracker-header">
              <div className="hours-tracker-title">
                <Target size={18} /> Weekly Don Hours Target
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                <span style={{ color: donHoursStatus === 'good' ? '#34d399' : donHoursStatus === 'warning' ? '#fbbf24' : '#f87171' }}>
                  {weeklyDonHours}h
                </span>
                <span style={{ opacity: 0.5, fontSize: 14 }}> / {DON_WEEKLY_HOURS_TARGET}h</span>
              </div>
            </div>
            <div className="hours-progress">
              <div 
                className={`hours-progress-bar ${donHoursStatus}`}
                style={{ width: `${Math.min(100, (weeklyDonHours / DON_WEEKLY_HOURS_TARGET) * 100)}%` }}
              />
            </div>
            <div className="hours-breakdown">
              <div className="hours-item">
                <div className="hours-item-value" style={{ color: '#f5d5a0' }}>{dodShifts.length * 3}h</div>
                <div className="hours-item-label">DOD Shifts</div>
              </div>
              <div className="hours-item">
                <div className="hours-item-value" style={{ color: '#e8b4c8' }}>{(totalFNHHours / 4).toFixed(1)}h</div>
                <div className="hours-item-label">FNH (avg/wk)</div>
              </div>
              <div className="hours-item">
                <div className="hours-item-value" style={{ color: '#9dd5c8' }}>{(meetings.team.length + meetings.rlc.length * 0.5 + meetings.senior.length * 0.25 + meetings.community.length).toFixed(1)}h</div>
                <div className="hours-item-label">Meetings</div>
              </div>
              <div className="hours-item">
                <div className="hours-item-value" style={{ color: '#c5b3d9' }}>{(connectionStats.perWeek * 0.25).toFixed(1)}h</div>
                <div className="hours-item-label">Connections</div>
              </div>
            </div>
            {donHoursStatus === 'low' && (
              <div style={{ marginTop: 14, padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} style={{ color: '#f87171' }} />
                <span>Add more DOD shifts or activities to meet your {DON_WEEKLY_HOURS_TARGET}h/week target.</span>
              </div>
            )}
          </div>

          {/* Month Navigation */}
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => navigateMonth(-1)}>
              <ArrowLeft size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: 4 }}>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h2>
              {currentTerm && (
                <span className="term-badge">{currentTerm.name}</span>
              )}
            </div>
            <button className="month-nav-btn" onClick={() => navigateMonth(1)}>
              <ArrowRight size={18} />
            </button>
          </div>

          {viewMode === 'month' && (
            <>
              {/* Calendar Grid */}
              <div className="calendar-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {calendarDays.map((dayData, idx) => {
                  const today = new Date();
                  const isToday = dayData.day && today.getDate() === dayData.day && 
                                  today.getMonth() === selectedMonth.month && 
                                  today.getFullYear() === selectedMonth.year;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`calendar-day ${!dayData.day ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                    >
                      {dayData.day && (
                        <>
                          <div className="calendar-day-number">{dayData.day}</div>
                          {dayData.events.slice(0, 2).map((event, i) => (
                            <div 
                              key={i} 
                              className="calendar-event"
                              style={{ background: getEventColor(event.category), color: '#1a1a2e' }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayData.events.length > 2 && (
                            <div className="calendar-event-more">+{dayData.events.length - 2} more</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Event Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                {[
                  { cat: 'meeting', label: 'Meetings' },
                  { cat: 'report', label: 'Reports' },
                  { cat: 'fnh', label: 'FNH' },
                  { cat: 'connection', label: 'Connections' },
                  { cat: 'academic', label: 'Academic' },
                  { cat: 'admin', label: 'Admin' },
                  { cat: 'holiday', label: 'Holiday' },
                ].map(item => (
                  <div key={item.cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: getEventColor(item.cat) }} />
                    <span style={{ opacity: 0.7 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === 'week' && (
            <div>
              <p className="section-desc">Click a week to see its snapshot with all RLM deadlines and tasks.</p>
              {weeksInMonth.map((week, idx) => {
                const weekEvents = monthEvents.filter(e => {
                  const eventDate = new Date(selectedMonth.year, selectedMonth.month, e.date);
                  return eventDate >= week.start && eventDate <= week.end;
                });
                
                return (
                  <div 
                    key={idx} 
                    className={`week-card ${selectedWeek === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedWeek(selectedWeek === idx ? null : idx)}
                  >
                    <div className="week-header">
                      <div className="week-title">Week {week.weekNumber}</div>
                      <div className="week-dates">
                        {week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="week-events">
                      {weekEvents.length === 0 ? (
                        <span style={{ opacity: 0.5, fontSize: 12 }}>No RLM events this week</span>
                      ) : (
                        weekEvents.map((event, i) => (
                          <span 
                            key={i} 
                            className="week-event-tag"
                            style={{ background: getEventColor(event.category), color: '#1a1a2e' }}
                          >
                            {event.title}
                          </span>
                        ))
                      )}
                    </div>
                    
                    {selectedWeek === idx && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Week {week.weekNumber} Snapshot</div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
                          <div className="stat-card">
                            <div className="stat-number">{weeklyDonHours}h</div>
                            <div className="stat-label">Don Hours</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-number">{connectionStats.perWeek}</div>
                            <div className="stat-label">Connections</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-number">{dodShifts.length}</div>
                            <div className="stat-label">DOD Shifts</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-number">{weekEvents.length}</div>
                            <div className="stat-label">RLM Tasks</div>
                          </div>
                        </div>

                        {weekEvents.length > 0 && (
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14 }}>
                            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Tasks & Deadlines</div>
                            {weekEvents.map((event, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: getEventColor(event.category), flexShrink: 0 }} />
                                <div style={{ fontSize: 12 }}>
                                  <span style={{ fontWeight: 500 }}>{event.date}</span>
                                  <span style={{ opacity: 0.6 }}> — {event.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Term Learning Outcomes */}
          {currentTerm && (
            <div className="term-outcomes">
              <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} style={{ color: '#60a5fa' }} />
                {currentTerm.name} Learning Outcomes
              </div>
              {currentTerm.outcomes.map((outcome, idx) => (
                <div key={idx} className="term-outcome-item">
                  <div className="term-outcome-area">{outcome.area}</div>
                  <div className="term-outcome-text">{outcome.outcome}</div>
                </div>
              ))}
            </div>
          )}

          <div className="nav-buttons">
            <div></div>
            <button className="btn-primary" onClick={() => setStep(2)}>
              Set Up Schedule <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Class Schedule */}
      {step === 2 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><BookOpen size={24} /> Class Schedule</h2>
          <p className="section-desc">Add your classes manually, or upload a screenshot for reference</p>
          
          <div className={`upload-zone ${isDraggingClass ? 'dragging' : ''}`} onClick={() => classInputRef.current?.click()} onDragOver={handleClassDragOver} onDragEnter={handleClassDragOver} onDragLeave={handleClassDragLeave} onDrop={handleClassDrop} style={{ marginBottom: 20 }}>
            <Image size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>Upload schedule image for reference</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>(Optional - add classes manually below)</div>
          </div>
          
          {classImages.length > 0 && <div className="image-preview">{classImages.map((img, idx) => <img key={idx} src={img.data} alt="Schedule" onClick={() => setShowImageModal(img.data)} />)}</div>}
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 18, marginTop: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Add Class</div>
            <div className="form-row">
              <input className="input-field" placeholder="Class name (e.g., SOCI-2110H)" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} style={{ flex: 1 }} />
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
              <button className="btn-add" onClick={addClass}><Plus size={18} /> Add</button>
            </div>
          </div>
          
          {classes.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Your Classes ({classes.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {classes.map(cls => (
                  <span key={cls.id} className="tag class">
                    {cls.name} • {cls.day} • {formatHour(parseInt(cls.startTime))}-{formatHour(parseInt(cls.endTime))}
                    <button onClick={() => setClasses(classes.filter(c => c.id !== cls.id))}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 3: RLM Calendar */}
      {step === 3 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Calendar size={24} /> RLM Calendar</h2>
          <p className="section-desc">Upload your RLM calendar photo for quick reference</p>
          
          <div className={`upload-zone ${isDraggingRLM ? 'dragging' : ''}`} onClick={() => rlmInputRef.current?.click()} onDragOver={handleRLMDragOver} onDragEnter={handleRLMDragOver} onDragLeave={handleRLMDragLeave} onDrop={handleRLMDrop}>
            <Image size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>{rlmImage ? 'Replace image' : 'Upload RLM calendar image'}</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>Click to upload or drag & drop</div>
          </div>
          
          {rlmImage && (
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <img src={rlmImage} alt="RLM Calendar" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 12, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)' }} onClick={() => setShowImageModal(rlmImage)} />
              <p style={{ marginTop: 10, fontSize: 12, opacity: 0.5 }}>Click to enlarge</p>
            </div>
          )}
          
          <div style={{ marginTop: 20, padding: 16, background: 'rgba(59,130,246,0.1)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Check size={16} style={{ color: '#60a5fa' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>RLM Calendar Pre-loaded</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>
              We've already loaded all key dates from the 2025-26 Residence Learning Model including community meetings, StarRez reports, FNH dates, and more. Check the Monthly Planner to see them!
            </p>
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 4: DOD Shifts */}
      {step === 4 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Clock size={24} /> Don On Duty (DOD) Shifts</h2>
          <p className="section-desc">Which nights do you have DOD this week? (8pm-11pm or later)</p>
          
          {/* Hours Impact Preview */}
          <div style={{ padding: 16, background: 'rgba(245,213,160,0.1)', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(245,213,160,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={16} style={{ color: '#f5d5a0' }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>DOD Hours: {dodShifts.length * 3}h/week</span>
              </div>
              <span style={{ fontSize: 12, opacity: 0.6 }}>~3 hours per shift</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <select className="input-field" value={newDodDay} onChange={e => setNewDodDay(e.target.value)} style={{ flex: 1, minWidth: 150 }}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <button className="btn-add" onClick={() => { if (!dodShifts.includes(newDodDay)) setDodShifts([...dodShifts, newDodDay]); }}><Plus size={18} /> Add Shift</button>
          </div>
          
          {dodShifts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {dodShifts.map(day => (
                <span key={day} className="tag dod">
                  {day}
                  <button onClick={() => setDodShifts(dodShifts.filter(d => d !== day))}>×</button>
                </span>
              ))}
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(3)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(5)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 5: Friday Night Hangouts */}
      {step === 5 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><PartyPopper size={24} /> Friday Night Hangouts</h2>
          <p className="section-desc">Add your FNH shifts with start/end times</p>
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 18 }}>
            <div className="form-row">
              <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Date</label><input type="date" className="input-field" value={newFNH.date} onChange={e => setNewFNH({ ...newFNH, date: e.target.value })} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Start</label><input type="time" className="input-field" value={newFNH.startTime} onChange={e => setNewFNH({ ...newFNH, startTime: e.target.value })} style={{ width: 120 }} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>End</label><input type="time" className="input-field" value={newFNH.endTime} onChange={e => setNewFNH({ ...newFNH, endTime: e.target.value })} style={{ width: 120 }} /></div>
            </div>
            <div className="form-row" style={{ marginTop: 14, marginBottom: 0 }}>
              <div style={{ flex: 1, opacity: 0.7, fontSize: 13 }}>Duration: <strong>{calculateFNHHours(newFNH.startTime, newFNH.endTime)}h</strong></div>
              <button className="btn-add" onClick={addFNH} disabled={!newFNH.date}><Plus size={18} /> Add</button>
            </div>
          </div>
          
          {fridayHangouts.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>Hangouts:</span>
                <span style={{ opacity: 0.6 }}>Total: {totalFNHHours}h</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {fridayHangouts.map(fnh => (
                  <span key={fnh.id} className="tag fnh">
                    {formatDate(fnh.date)} • {formatTime(fnh.startTime)}-{formatTime(fnh.endTime)} ({fnh.hours}h)
                    <button onClick={() => setFridayHangouts(fridayHangouts.filter(f => f.id !== fnh.id))}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(4)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(6)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 6: Meetings */}
      {step === 6 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><UserCheck size={24} /> Meetings</h2>
          <p className="section-desc">Add your recurring meetings</p>
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 22 }}>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <select className="input-field" value={newMeeting.type} onChange={e => setNewMeeting({ ...newMeeting, type: e.target.value })} style={{ flex: 1 }}>
                {MEETING_TYPES.map(m => <option key={m.id} value={m.id}>{m.name} ({m.frequency}) - {m.duration}</option>)}
              </select>
              <select className="input-field" value={newMeeting.day} onChange={e => setNewMeeting({ ...newMeeting, day: e.target.value })} style={{ width: 'auto' }}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="time" className="input-field" value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })} style={{ width: 120 }} />
              <button className="btn-add" onClick={addMeeting}><Plus size={18} /> Add</button>
            </div>
          </div>

          {MEETING_TYPES.map(meetingType => (
            <div key={meetingType.id} className="meeting-type-card" style={{ borderLeftColor: meetingType.color }}>
              <div className="meeting-type-header">
                <div>
                  <span className="meeting-type-name">{meetingType.name}</span>
                  <span className="meeting-type-duration">{meetingType.duration}</span>
                  <span className="meeting-type-freq" style={{ marginLeft: 10 }}>{meetingType.frequency}</span>
                </div>
                <span style={{ fontSize: 13, opacity: 0.6 }}>{meetings[meetingType.id].length} scheduled</span>
              </div>
              {meetings[meetingType.id].length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {meetings[meetingType.id].map(m => (
                    <span key={m.id} className="tag meeting" style={{ background: meetingType.color, margin: 0 }}>
                      {m.day} @ {formatTime(m.time)}
                      <button onClick={() => removeMeeting(meetingType.id, m.id)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(5)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(7)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 7: Community Connections */}
      {step === 7 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><MessageCircle size={24} /> Community Connections</h2>
          <p className="section-desc">Plan your community connection conversations</p>
          
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 22 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Community Size</label>
              <input className="input-field" type="number" placeholder="# of residents" value={communitySize} onChange={e => setCommunitySize(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Start Date</label>
              <input className="input-field" type="date" value={connectionStartDate} onChange={e => setConnectionStartDate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Due Date</label>
              <input className="input-field" type="date" value={connectionDueDate} onChange={e => setConnectionDueDate(e.target.value)} />
            </div>
          </div>

          {communitySize && connectionStartDate && connectionDueDate && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 18 }}>
                <div className="stat-card">
                  <div className="stat-number">{connectionStats.total}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{connectionStats.totalDays}</div>
                  <div className="stat-label">Days</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{connectionStats.perDay}</div>
                  <div className="stat-label">Per Day</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{connectionStats.perWeek}</div>
                  <div className="stat-label">Per Week</div>
                </div>
              </div>

              {dodShifts.length > 0 && (
                <div className="highlight-box">
                  <h3><Users size={18} /> Connections During DOD</h3>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    With <strong>{dodShifts.length} DOD shift{dodShifts.length > 1 ? 's' : ''}</strong> per week, 
                    aim for <strong style={{ color: '#c5b3d9', fontSize: 16 }}>{connectionStats.perDODShift} connections</strong> per shift.
                  </p>
                  <p style={{ margin: '10px 0 0', fontSize: 12, opacity: 0.6 }}>
                    Connection blocks will be added to your schedule at 7 PM before each DOD shift.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(6)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={generateSchedule}>Generate Schedule <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 8: Generated Schedule */}
      {step === 8 && generatedSchedule && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <h2><Calendar size={24} /> Your Weekly Schedule</h2>
            
            {/* Don Hours Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Target size={16} style={{ color: '#60a5fa' }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Don Hours:</span>
                <span style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: donHoursStatus === 'good' ? '#34d399' : donHoursStatus === 'warning' ? '#fbbf24' : '#f87171' 
                }}>
                  {(categoryHours.dod || 0) + (categoryHours.hangout || 0) + (categoryHours.meeting || 0) + (categoryHours.connection || 0)}h
                </span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>/ {DON_WEEKLY_HOURS_TARGET}h</span>
              </div>
            </div>
          </div>
          
          <div className="edit-toolbar">
            <button className={`edit-btn drag ${editMode === 'drag' ? 'active' : ''}`} onClick={() => setEditMode('drag')}><GripVertical size={14} /> Move</button>
            <button className={`edit-btn delete ${editMode === 'delete' ? 'active' : ''}`} onClick={() => setEditMode('delete')}><Trash2 size={14} /> Delete</button>
            <button className={`edit-btn add ${editMode === 'add' ? 'active' : ''}`} onClick={() => setEditMode('add')}><Plus size={14} /> Add</button>
            <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: 11 }}>
              {editMode === 'drag' && '🔒 = locked • Drag unlocked blocks'}
              {editMode === 'delete' && 'Click unlocked blocks to remove'}
              {editMode === 'add' && 'Click empty slots to add blocks'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div className="schedule-grid" style={{ minWidth: 620 }}>
              <div className="schedule-header"></div>
              {DAYS.map(d => <div key={d} className="schedule-header">{d.slice(0,3)}</div>)}
              {HOURS.map(hour => (
                <React.Fragment key={hour}>
                  <div className="schedule-time">{formatHour(hour)}</div>
                  {DAYS.map(day => {
                    const slot = generatedSchedule[day].find(h => h.hour === hour);
                    const block = slot?.block;
                    const draggable = editMode === 'drag' && block && !block.locked;
                    const cellClass = `schedule-cell ${draggable ? 'draggable' : ''} ${editMode === 'delete' && block && !block.locked ? 'delete-mode' : ''} ${editMode === 'add' && !block ? 'add-mode' : ''}`;
                    return (
                      <div key={`${day}-${hour}`} className={cellClass} style={block ? getBlockStyle(block.type) : { background: 'rgba(255,255,255,0.02)' }} draggable={draggable} onDragStart={() => draggable && setDraggedBlock({ day, hour, block })} onDragEnd={() => setDraggedBlock(null)} onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }} onDragLeave={e => e.currentTarget.classList.remove('drag-over')} onDrop={e => { e.currentTarget.classList.remove('drag-over'); handleBlockDrop(day, hour); }} onClick={() => handleCellClick(day, hour)}>
                        {block?.name || ''}{block?.locked && <Lock size={7} style={{ position: 'absolute', top: 2, right: 2, opacity: 0.5 }} />}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="legend">
            {[
              { type: 'class', label: 'Classes', locked: true },
              { type: 'dod', label: 'DOD', locked: true },
              { type: 'connection', label: 'Connections', locked: true },
              { type: 'hangout', label: 'FNH', locked: true },
              { type: 'meeting', label: 'Meetings', locked: true },
              { type: 'meal', label: 'Meals', locked: false },
              { type: 'study', label: 'Study', locked: false },
              { type: 'personal', label: 'Personal', locked: false },
              { type: 'social', label: 'Social', locked: false }
            ].map(item => (
              <div key={item.type} className="legend-item">
                <div className="legend-color" style={getBlockStyle(item.type)}></div>
                <span>{item.label} {item.locked && '🔒'}</span>
                <span className="legend-hours">{categoryHours[item.type] || 0}h</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, padding: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#a8c5e2' }}>{(categoryHours.class || 0) + (categoryHours.study || 0)}h</div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>Class + Study</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f5d5a0' }}>{(categoryHours.dod || 0) + (categoryHours.hangout || 0) + (categoryHours.meeting || 0) + (categoryHours.connection || 0)}h</div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>Don Duties</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#c8e6c9' }}>{(categoryHours.personal || 0) + (categoryHours.social || 0)}h</div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>Personal + Social</div>
            </div>
          </div>

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(7)}><ChevronLeft size={20} /> Edit</button>
            <button className="btn-secondary" onClick={() => setStep(1)}><Calendar size={18} /> Monthly View</button>
            <button className="btn-secondary" onClick={() => { setStep(1); setGeneratedSchedule(null); }}>Start Over</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 4, fontSize: 18 }}>Add Block</h3>
            <p style={{ opacity: 0.6, marginBottom: 14, fontSize: 13 }}>{showAddModal.day} at {formatHour(showAddModal.hour)}</p>
            <div className="add-block-grid">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} className="add-block-btn" style={getBlockStyle(bt.type)} onClick={() => addBlockToSchedule(showAddModal.day, showAddModal.hour, bt.type)}>{bt.name}</button>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }} onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      {showImageModal && typeof showImageModal === 'string' && (
        <div className="modal-overlay" onClick={() => setShowImageModal(null)}>
          <img src={showImageModal} alt="Full" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}
