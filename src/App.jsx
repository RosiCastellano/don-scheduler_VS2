import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Calendar, Clock, Users, BookOpen, ChevronRight, ChevronLeft, GripVertical, Lock, PartyPopper, UserCheck, Trash2, MessageCircle, Check, AlertCircle, Target, CalendarDays, ArrowLeft, ArrowRight, Layers, FileText, FileSpreadsheet, Table, Eye, CheckSquare, Square } from 'lucide-react';
import * as XLSX from 'xlsx';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// RLM Calendar Data - Now with selectable flag
const RLM_EVENTS_DATA = {
  '2025-09': [
    { date: 1, title: 'First Community Meeting', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 4, title: 'First Day of Classes', category: 'academic', selectable: false },
    { date: 6, title: 'Open EB StarRez Report #1', category: 'report', selectable: false },
    { date: 7, title: 'Community Meeting #2', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 8, title: 'StarRez Community Connection #1 Due', category: 'connection', selectable: false },
    { date: 12, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 14, title: 'Open BTE StarRez Report #1', category: 'report', selectable: false },
    { date: 15, title: 'Roommate Agreements Due (trad)', category: 'admin', selectable: false },
    { date: 19, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 21, title: 'Close EB StarRez Report #1', category: 'report', selectable: false },
    { date: 22, title: 'Roommate Agreements Due (apt)', category: 'admin', selectable: false },
    { date: 26, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 28, title: 'Community Meeting #3', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 30, title: 'National Day of Truth & Reconciliation', category: 'holiday', selectable: false },
  ],
  '2025-10': [
    { date: 4, title: 'Head of the Trent Regatta', category: 'event', selectable: false },
    { date: 5, title: 'Close BTE StarRez Report #1', category: 'report', selectable: false },
    { date: 12, title: 'StarRez Community Connection #2', category: 'connection', selectable: false },
    { date: 13, title: 'Thanksgiving (Closed)', category: 'holiday', selectable: false },
    { date: 17, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 19, title: 'Open EB StarRez Report #2', category: 'report', selectable: false },
    { date: 19, title: 'Open BTE StarRez Report #2', category: 'report', selectable: false },
    { date: 20, title: 'Reading Week Begins', category: 'break', selectable: false },
    { date: 23, title: 'Term Poster Turnover Due', category: 'admin', selectable: false },
    { date: 26, title: 'Community Meeting #4', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 27, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 31, title: 'Haunted Drumlin', category: 'event', selectable: true, defaultSelected: false },
  ],
  '2025-11': [
    { date: 6, title: 'Close BTE StarRez Report #2', category: 'report', selectable: false },
    { date: 7, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 8, title: 'Indigenous Veterans Day', category: 'holiday', selectable: false },
    { date: 11, title: 'Remembrance Day', category: 'holiday', selectable: false },
    { date: 14, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 21, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 28, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 30, title: 'Community Meeting #5', category: 'meeting', selectable: true, defaultSelected: true },
  ],
  '2025-12': [
    { date: 3, title: 'Last Day of Classes', category: 'academic', selectable: false },
    { date: 3, title: 'Close BTE StarRez Report #2', category: 'report', selectable: false },
    { date: 5, title: 'Exam Period Begins', category: 'academic', selectable: false },
    { date: 18, title: 'Exam Period Ends', category: 'academic', selectable: false },
    { date: 19, title: 'Room Checks (Winter Move Out)', category: 'admin', selectable: true, defaultSelected: true },
    { date: 20, title: 'Winter Break Begins', category: 'break', selectable: false },
  ],
  '2026-01': [
    { date: 3, title: 'Term 3 Poster Turnover', category: 'admin', selectable: false },
    { date: 4, title: 'Student Welcome Session', category: 'event', selectable: true, defaultSelected: true },
    { date: 5, title: 'Winter Move In', category: 'event', selectable: true, defaultSelected: true },
    { date: 5, title: 'Open EB StarRez Report #3', category: 'report', selectable: false },
    { date: 7, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 11, title: 'Community Meeting #6', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 12, title: 'Open BTE StarRez Report #3', category: 'report', selectable: false },
    { date: 16, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 18, title: 'Roommate Agreements Due (trad)', category: 'admin', selectable: false },
    { date: 19, title: 'StarRez Community Connection #3', category: 'connection', selectable: false },
    { date: 23, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 25, title: 'Roommate Agreements Due (apt)', category: 'admin', selectable: false },
    { date: 26, title: 'Close EB StarRez Report #3', category: 'report', selectable: false },
    { date: 30, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
  ],
  '2026-02': [
    { date: 6, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 8, title: 'Community Meeting #7', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 9, title: 'Open EB StarRez Report #4', category: 'report', selectable: false },
    { date: 9, title: 'Close BTE StarRez Report #3', category: 'report', selectable: false },
    { date: 13, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 14, title: "Valentine's Day", category: 'holiday', selectable: false },
    { date: 16, title: 'Family Day (Closed)', category: 'holiday', selectable: false },
    { date: 16, title: 'Reading Week Begins', category: 'break', selectable: false },
    { date: 19, title: 'Term Poster Turnover Due', category: 'admin', selectable: false },
    { date: 23, title: 'Classes Resume', category: 'academic', selectable: false },
    { date: 23, title: 'Open BTE StarRez Report #4', category: 'report', selectable: false },
    { date: 27, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
  ],
  '2026-03': [
    { date: 6, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 8, title: 'Community Meeting #8', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 8, title: "International Women's Day", category: 'holiday', selectable: false },
    { date: 9, title: 'StarRez Community Connection #4', category: 'connection', selectable: false },
    { date: 13, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 17, title: "St. Patrick's Day", category: 'holiday', selectable: false },
    { date: 20, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 27, title: 'Friday Night Hangout', category: 'fnh', selectable: true, defaultSelected: false },
    { date: 29, title: 'Community Meeting #9', category: 'meeting', selectable: true, defaultSelected: true },
    { date: 30, title: 'Close EB StarRez Report #4', category: 'report', selectable: false },
    { date: 30, title: 'Close BTE StarRez Report #3', category: 'report', selectable: false },
    { date: 31, title: 'International Trans Day of Visibility', category: 'holiday', selectable: false },
  ],
  '2026-04': [
    { date: 3, title: 'Good Friday (Closed)', category: 'holiday', selectable: false },
    { date: 7, title: 'Last Day of Classes', category: 'academic', selectable: false },
    { date: 10, title: 'Exam Period Begins', category: 'academic', selectable: false },
    { date: 23, title: 'Exam Period Ends', category: 'academic', selectable: false },
    { date: 30, title: 'Room Checks (Summer Move Out)', category: 'admin', selectable: true, defaultSelected: true },
    { date: 30, title: 'Residence Closed', category: 'event', selectable: false },
  ],
};

const MEETING_TYPES = [
  { id: 'team', name: 'Team Meeting', frequency: 'Weekly', duration: 1, color: '#86c5b8' },
  { id: 'senior', name: 'Senior Don 1:1', frequency: 'Monthly', duration: 0.5, color: '#b8a9c9' },
  { id: 'rlc', name: 'RLC Meeting', frequency: 'Bi-weekly', duration: 0.5, color: '#e8c4a0' },
];

const DON_WEEKLY_HOURS_TARGET = 15;

export default function DonScheduler() {
  const [step, setStep] = useState(1);
  
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '', day: 'Monday', startTime: '9', endTime: '10' });
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [dodShifts, setDodShifts] = useState([]);
  const [newDodDay, setNewDodDay] = useState('Monday');
  
  const [meetings, setMeetings] = useState({ team: [], senior: [], rlc: [] });
  const [newMeeting, setNewMeeting] = useState({ type: 'team', day: 'Monday', time: '19:00' });
  
  const [communitySize, setCommunitySize] = useState('');
  
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
  
  const [selectedMonth, setSelectedMonth] = useState({ month: 8, year: 2025 });
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isDraggingClass, setIsDraggingClass] = useState(false);

  const classInputRef = useRef(null);

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
          if (dayCol >= 0 && startCol >= 0 && endCol >= 0) {
            headerRowIndex = i;
            break;
          }
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

  const calculateWeeklyHours = (weekStart, weekEnd) => {
    let classHours = 0;
    let donHours = 0;
    let personalHours = 14;
    let socialHours = 7;
    
    classes.forEach(cls => {
      const duration = parseInt(cls.endTime) - parseInt(cls.startTime);
      classHours += duration;
    });
    
    donHours += dodShifts.length * 3;
    
    Object.entries(meetings).forEach(([type, meetingList]) => {
      const meetingType = MEETING_TYPES.find(m => m.id === type);
      meetingList.forEach(() => {
        donHours += meetingType?.duration || 1;
      });
    });
    
    const monthKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}`;
    const monthEvents = RLM_EVENTS_DATA[monthKey] || [];
    monthEvents.forEach((event, idx) => {
      const eventId = `${monthKey}-${idx}`;
      if (event.category === 'fnh' && selectedRLMEvents[eventId]) {
        const eventDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), event.date);
        if (eventDate >= weekStart && eventDate <= weekEnd) {
          donHours += 2;
        }
      }
      if (event.category === 'meeting' && event.selectable && selectedRLMEvents[eventId]) {
        const eventDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), event.date);
        if (eventDate >= weekStart && eventDate <= weekEnd) {
          donHours += 0.5;
        }
      }
    });
    
    const connectionsPerWeek = communitySize ? Math.ceil(parseInt(communitySize) / 4) : 0;
    donHours += connectionsPerWeek * 0.25;
    
    return { classHours, donHours, personalHours, socialHours, total: classHours + donHours + personalHours + socialHours };
  };

  const calculateMonthlyHours = (month, year) => {
    const weeks = getWeeksInMonth(month, year);
    let totalClass = 0, totalDon = 0, totalPersonal = 0, totalSocial = 0;
    
    weeks.forEach(week => {
      const weekMidpoint = new Date(week.start);
      weekMidpoint.setDate(weekMidpoint.getDate() + 3);
      if (weekMidpoint.getMonth() === month) {
        const hours = calculateWeeklyHours(week.start, week.end);
        totalClass += hours.classHours;
        totalDon += hours.donHours;
        totalPersonal += hours.personalHours;
        totalSocial += hours.socialHours;
      }
    });
    
    return { classHours: totalClass, donHours: totalDon, personalHours: totalPersonal, socialHours: totalSocial, total: totalClass + totalDon + totalPersonal + totalSocial };
  };

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
  }[category] || '#888');

  const formatHour = (h) => h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); const hour = h % 12 || 12; return `${hour}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

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

  const monthEvents = getMonthEvents(selectedMonth.month, selectedMonth.year);
  const weeksInMonth = getWeeksInMonth(selectedMonth.month, selectedMonth.year);
  const monthlyHours = calculateMonthlyHours(selectedMonth.month, selectedMonth.year);

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedMonth.year, selectedMonth.month, 1);
    const lastDay = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
    const days = [];
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    for (let i = 0; i < startDay; i++) days.push({ day: null, events: [] });
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dayEvents = monthEvents.filter(e => e.date === d && e.selected);
      days.push({ day: d, events: dayEvents });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const countSelectedByCategory = (category) => {
    return Object.entries(RLM_EVENTS_DATA).reduce((count, [monthKey, events]) => {
      return count + events.filter((e, idx) => 
        e.category === category && selectedRLMEvents[`${monthKey}-${idx}`]
      ).length;
    }, 0);
  };

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
        .tag button { background: rgba(255,255,255,0.2); border: none; width: 20px; height: 20px; border-radius: 50%; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .tag.class { background: #a8c5e2; color: #2c3e50; }
        .tag.dod { background: #f5d5a0; color: #5d4e37; }
        .tag.meeting { background: #9dd5c8; color: #2d4a44; }
        .upload-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 16px; padding: 36px; text-align: center; cursor: pointer; transition: all 0.3s; }
        .upload-zone:hover, .upload-zone.dragging { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
        .nav-buttons { display: flex; justify-content: space-between; margin-top: 24px; gap: 12px; flex-wrap: wrap; }
        .form-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
        h1 { font-family: 'Fraunces', serif; font-size: 38px; text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .subtitle { text-align: center; opacity: 0.5; margin-bottom: 28px; font-size: 15px; }
        .section-desc { opacity: 0.6; margin-bottom: 18px; font-size: 14px; }
        
        .step-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; justify-content: center; }
        .step-tab { padding: 10px 20px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: inherit; font-weight: 500; font-size: 14px; color: rgba(255,255,255,0.6); transition: all 0.2s; }
        .step-tab.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-color: transparent; }
        .step-tab.completed { border-color: #34d399; color: #34d399; }
        
        .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .month-nav-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; }
        
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .calendar-header { text-align: center; font-weight: 600; font-size: 12px; padding: 10px 4px; color: rgba(255,255,255,0.5); }
        .calendar-day { min-height: 80px; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .calendar-day:hover { background: rgba(255,255,255,0.06); }
        .calendar-day.empty { background: transparent; cursor: default; }
        .calendar-day-number { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .calendar-event { font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
        
        .hours-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin: 20px 0; }
        .hours-card { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
        .hours-value { font-size: 28px; font-weight: 700; }
        .hours-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
        
        .week-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; }
        .week-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
        
        .event-select { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .event-select:hover { background: rgba(255,255,255,0.06); }
        .event-select.selected { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); }
        .event-checkbox { width: 20px; height: 20px; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .event-checkbox.checked { background: #3b82f6; border-color: #3b82f6; }
        
        .hidden-input { position: absolute; width: 1px; height: 1px; opacity: 0; }
      `}</style>

      <input type="file" ref={classInputRef} className="hidden-input" accept=".xlsx,.xls,.csv" onChange={handleClassFileSelect} />

      <h1>Don Schedule Manager</h1>
      <p className="subtitle">Plan your month • Track your hours • Balance your life</p>

      <div className="step-tabs">
        <button className={`step-tab ${step === 1 ? 'active' : classes.length > 0 ? 'completed' : ''}`} onClick={() => setStep(1)}>1. Classes</button>
        <button className={`step-tab ${step === 2 ? 'active' : dodShifts.length > 0 ? 'completed' : ''}`} onClick={() => setStep(2)}>2. DOD Shifts</button>
        <button className={`step-tab ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>3. Meetings</button>
        <button className={`step-tab ${step === 4 ? 'active' : ''}`} onClick={() => setStep(4)}>4. RLM Events</button>
        <button className={`step-tab ${step === 5 ? 'active' : ''}`} onClick={() => setStep(5)}>5. My Schedule</button>
      </div>

      {step === 1 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><BookOpen size={24} /> Class Schedule</h2>
          <p className="section-desc">Upload your class schedule from Excel/CSV, or add classes manually</p>
          
          <div className={`upload-zone ${isDraggingClass ? 'dragging' : ''}`} onClick={() => classInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDraggingClass(true); }} onDragLeave={() => setIsDraggingClass(false)} onDrop={handleClassDrop} style={{ marginBottom: 20 }}>
            <FileSpreadsheet size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>Upload Excel or CSV file</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>Columns: Day, Start Time, End Time, Course</div>
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
              <input className="input-field" placeholder="Class name (e.g., CAST-3091H)" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} style={{ flex: 1 }} />
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
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <span>Your Classes ({classes.length})</span>
                <button onClick={() => setClasses([])} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Clear All</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {classes.map(cls => (
                  <span key={cls.id} className="tag class">
                    {cls.name} • {cls.day.slice(0,3)} • {formatHour(parseInt(cls.startTime))}-{formatHour(parseInt(cls.endTime))}
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

      {step === 2 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><Clock size={24} /> Don On Duty (DOD) Shifts</h2>
          <p className="section-desc">Which nights do you have DOD each week? (~3 hours each)</p>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <select className="input-field" value={newDodDay} onChange={e => setNewDodDay(e.target.value)} style={{ flex: 1, minWidth: 150 }}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <button className="btn-add" onClick={() => { if (!dodShifts.includes(newDodDay)) setDodShifts([...dodShifts, newDodDay]); }}><Plus size={18} /> Add Shift</button>
          </div>
          
          {dodShifts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {dodShifts.map(day => (
                <span key={day} className="tag dod">{day}<button onClick={() => setDodShifts(dodShifts.filter(d => d !== day))}>×</button></span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(245,213,160,0.1)', borderRadius: 12, border: '1px solid rgba(245,213,160,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={18} style={{ color: '#f5d5a0' }} />
              <span style={{ fontWeight: 600 }}>Weekly DOD Hours: {dodShifts.length * 3}h</span>
            </div>
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2><UserCheck size={24} /> Recurring Meetings</h2>
          <p className="section-desc">Add your weekly/bi-weekly meetings</p>
          
          <div style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 20 }}>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <select className="input-field" value={newMeeting.type} onChange={e => setNewMeeting({ ...newMeeting, type: e.target.value })} style={{ flex: 1 }}>
                {MEETING_TYPES.map(m => <option key={m.id} value={m.id}>{m.name} ({m.frequency})</option>)}
              </select>
              <select className="input-field" value={newMeeting.day} onChange={e => setNewMeeting({ ...newMeeting, day: e.target.value })} style={{ width: 'auto' }}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="time" className="input-field" value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })} style={{ width: 120 }} />
              <button className="btn-add" onClick={addMeeting}><Plus size={18} /></button>
            </div>
          </div>

          {MEETING_TYPES.map(mt => (
            <div key={mt.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{mt.name}</span>
                <span style={{ opacity: 0.6, fontWeight: 400 }}>{mt.frequency} • {mt.duration}h each</span>
              </div>
              {meetings[mt.id].length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {meetings[mt.id].map(m => (
                    <span key={m.id} className="tag meeting" style={{ background: mt.color }}>
                      {m.day} @ {formatTime(m.time)}
                      <button onClick={() => setMeetings(prev => ({ ...prev, [mt.id]: prev[mt.id].filter(x => x.id !== m.id) }))}>×</button>
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, opacity: 0.5 }}>No meetings added</div>
              )}
            </div>
          ))}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Continue <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2><CalendarDays size={24} /> Select Your RLM Activities</h2>
          <p className="section-desc">Choose which Friday Night Hangouts, events, and activities you're assigned to this month</p>
          
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => navigateMonth(-1)}><ArrowLeft size={18} /></button>
            <h3 style={{ margin: 0 }}>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button className="month-nav-btn" onClick={() => navigateMonth(1)}><ArrowRight size={18} /></button>
          </div>

          <div style={{ marginBottom: 20 }}>
            {monthEvents.filter(e => e.selectable).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No selectable events this month</div>
            ) : (
              monthEvents.filter(e => e.selectable).map(event => (
                <div key={event.id} className={`event-select ${event.selected ? 'selected' : ''}`} onClick={() => toggleRLMEvent(event.id)}>
                  <div className={`event-checkbox ${event.selected ? 'checked' : ''}`}>
                    {event.selected && <Check size={14} />}
                  </div>
                  <div style={{ width: 50, fontWeight: 600, color: getEventColor(event.category) }}>
                    {MONTHS[selectedMonth.month].slice(0,3)} {event.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{event.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.6, textTransform: 'capitalize' }}>{event.category}</div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>
                    {event.category === 'fnh' ? '~2h' : event.category === 'meeting' ? '~30min' : '~1h'}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Other Deadlines This Month</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {monthEvents.filter(e => !e.selectable).map(event => (
                <span key={event.id} style={{ fontSize: 11, padding: '4px 10px', background: getEventColor(event.category), color: '#1a1a2e', borderRadius: 6, fontWeight: 500 }}>
                  {event.date}: {event.title}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: 16, background: 'rgba(59,130,246,0.1)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Your Selections (All Months)</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13 }}>
              <span><strong style={{ color: '#e8b4c8' }}>{countSelectedByCategory('fnh')}</strong> Friday Night Hangouts</span>
              <span><strong style={{ color: '#9dd5c8' }}>{countSelectedByCategory('meeting')}</strong> Community Meetings</span>
              <span><strong style={{ color: '#c8e6c9' }}>{countSelectedByCategory('event')}</strong> Events</span>
            </div>
          </div>
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(3)}><ChevronLeft size={20} /> Back</button>
            <button className="btn-primary" onClick={() => setStep(5)}>View My Schedule <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="glass-card" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2><Calendar size={24} /> My Schedule</h2>
            {selectedWeek !== null && (
              <button className="btn-secondary" onClick={() => setSelectedWeek(null)}><ArrowLeft size={16} /> Back to Month</button>
            )}
          </div>

          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => { navigateMonth(-1); setSelectedWeek(null); }}><ArrowLeft size={18} /></button>
            <h3 style={{ margin: 0 }}>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h3>
            <button className="month-nav-btn" onClick={() => { navigateMonth(1); setSelectedWeek(null); }}><ArrowRight size={18} /></button>
          </div>

          {selectedWeek === null ? (
            <>
              <div className="hours-summary">
                <div className="hours-card">
                  <div className="hours-value" style={{ color: '#a8c5e2' }}>{monthlyHours.classHours}h</div>
                  <div className="hours-label">Classes</div>
                </div>
                <div className="hours-card">
                  <div className="hours-value" style={{ color: '#f5d5a0' }}>{monthlyHours.donHours.toFixed(1)}h</div>
                  <div className="hours-label">Don Duties</div>
                </div>
                <div className="hours-card">
                  <div className="hours-value" style={{ color: '#b8d4e8' }}>{monthlyHours.personalHours}h</div>
                  <div className="hours-label">Personal</div>
                </div>
                <div className="hours-card">
                  <div className="hours-value" style={{ color: '#c8e6c9' }}>{monthlyHours.socialHours}h</div>
                  <div className="hours-label">Social</div>
                </div>
                <div className="hours-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}>
                  <div className="hours-value" style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{monthlyHours.total.toFixed(0)}h</div>
                  <div className="hours-label">Total/Month</div>
                </div>
              </div>

              <div className="calendar-grid" style={{ marginBottom: 24 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {calendarDays.map((dayData, idx) => (
                  <div key={idx} className={`calendar-day ${!dayData.day ? 'empty' : ''}`}>
                    {dayData.day && (
                      <>
                        <div className="calendar-day-number">{dayData.day}</div>
                        {dayData.events.slice(0, 2).map((event, i) => (
                          <div key={i} className="calendar-event" style={{ background: getEventColor(event.category), color: '#1a1a2e' }}>
                            {event.title}
                          </div>
                        ))}
                        {dayData.events.length > 2 && <div style={{ fontSize: 9, opacity: 0.6 }}>+{dayData.events.length - 2}</div>}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Week by Week</h3>
              {weeksInMonth.map((week, idx) => {
                const weekHours = calculateWeeklyHours(week.start, week.end);
                const weekEvents = monthEvents.filter(e => {
                  const eventDate = new Date(selectedMonth.year, selectedMonth.month, e.date);
                  return eventDate >= week.start && eventDate <= week.end && e.selected;
                });
                
                return (
                  <div key={idx} className="week-card" onClick={() => setSelectedWeek(idx)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>Week {week.weekNumber}</div>
                        <div style={{ fontSize: 12, opacity: 0.6 }}>
                          {week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                        <span><strong style={{ color: '#a8c5e2' }}>{weekHours.classHours}h</strong> class</span>
                        <span><strong style={{ color: '#f5d5a0' }}>{weekHours.donHours.toFixed(1)}h</strong> don</span>
                        <span><strong>{weekHours.total.toFixed(0)}h</strong> total</span>
                      </div>
                    </div>
                    {weekEvents.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {weekEvents.map((event, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '4px 10px', background: getEventColor(event.category), color: '#1a1a2e', borderRadius: 6, fontWeight: 500 }}>
                            {event.title}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 10, fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Click to view details <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            (() => {
              const week = weeksInMonth[selectedWeek];
              const weekHours = calculateWeeklyHours(week.start, week.end);
              const weekEvents = monthEvents.filter(e => {
                const eventDate = new Date(selectedMonth.year, selectedMonth.month, e.date);
                return eventDate >= week.start && eventDate <= week.end && e.selected;
              });
              const weekDeadlines = monthEvents.filter(e => {
                const eventDate = new Date(selectedMonth.year, selectedMonth.month, e.date);
                return eventDate >= week.start && eventDate <= week.end && !e.selectable;
              });
              
              return (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <h3 style={{ margin: 0 }}>Week {week.weekNumber}</h3>
                    <div style={{ opacity: 0.6 }}>
                      {week.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {week.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="hours-summary">
                    <div className="hours-card">
                      <div className="hours-value" style={{ color: '#a8c5e2' }}>{weekHours.classHours}h</div>
                      <div className="hours-label">Classes</div>
                    </div>
                    <div className="hours-card">
                      <div className="hours-value" style={{ color: '#f5d5a0' }}>{weekHours.donHours.toFixed(1)}h</div>
                      <div className="hours-label">Don Duties</div>
                    </div>
                    <div className="hours-card">
                      <div className="hours-value" style={{ color: '#b8d4e8' }}>{weekHours.personalHours}h</div>
                      <div className="hours-label">Personal</div>
                    </div>
                    <div className="hours-card">
                      <div className="hours-value" style={{ color: '#c8e6c9' }}>{weekHours.socialHours}h</div>
                      <div className="hours-label">Social</div>
                    </div>
                    <div className="hours-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}>
                      <div className="hours-value" style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{weekHours.total.toFixed(0)}h</div>
                      <div className="hours-label">Total Week</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ marginBottom: 12 }}>Your Activities This Week</h4>
                    
                    {classes.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#a8c5e2' }}>Classes</div>
                        {classes.map(cls => (
                          <div key={cls.id} style={{ padding: 10, background: 'rgba(168,197,226,0.1)', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                            <strong>{cls.name}</strong> — {cls.day} {formatHour(parseInt(cls.startTime))}-{formatHour(parseInt(cls.endTime))}
                          </div>
                        ))}
                      </div>
                    )}

                    {dodShifts.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#f5d5a0' }}>DOD Shifts</div>
                        {dodShifts.map(day => (
                          <div key={day} style={{ padding: 10, background: 'rgba(245,213,160,0.1)', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                            <strong>{day}</strong> — 8:00 PM - 11:00 PM
                          </div>
                        ))}
                      </div>
                    )}

                    {Object.entries(meetings).some(([_, list]) => list.length > 0) && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#9dd5c8' }}>Meetings</div>
                        {Object.entries(meetings).map(([type, list]) => 
                          list.map(m => (
                            <div key={m.id} style={{ padding: 10, background: 'rgba(157,213,200,0.1)', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                              <strong>{MEETING_TYPES.find(mt => mt.id === type)?.name}</strong> — {m.day} @ {formatTime(m.time)}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {weekEvents.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#e8b4c8' }}>RLM Activities</div>
                        {weekEvents.map((event, i) => (
                          <div key={i} style={{ padding: 10, background: `${getEventColor(event.category)}20`, borderRadius: 8, marginBottom: 6, fontSize: 13, borderLeft: `3px solid ${getEventColor(event.category)}` }}>
                            <strong>{event.title}</strong> — {MONTHS[selectedMonth.month]} {event.date}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {weekDeadlines.length > 0 && (
                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                      <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={18} style={{ color: '#fbbf24' }} /> Deadlines & Important Dates
                      </h4>
                      {weekDeadlines.map((event, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: getEventColor(event.category) }} />
                          <span style={{ fontWeight: 500 }}>{MONTHS[selectedMonth.month]} {event.date}:</span>
                          <span style={{ opacity: 0.8 }}>{event.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()
          )}
          
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => setStep(4)}><ChevronLeft size={20} /> Edit RLM Events</button>
            <button className="btn-secondary" onClick={() => setStep(1)}>Edit Schedule</button>
          </div>
        </div>
      )}
    </div>
  );
}
