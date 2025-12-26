# Don Schedule Manager

A scheduling tool for residence dons to balance classes, don duties, and personal time. Built with React for the 2025-26 academic year.

![Don Schedule Manager](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

### 📅 Monthly Planner
- Full calendar view with all RLM (Residence Learning Model) events pre-loaded
- Navigate between months to see upcoming deadlines
- Color-coded events by category (meetings, reports, FNH, etc.)
- Term learning outcomes displayed for each term

### 📊 Weekly Snapshots
- Toggle between Month and Weeks view
- See all RLM tasks for each week at a glance
- Expandable week cards with detailed task lists
- Quick stats: don hours, connections, DOD shifts, task counts

### ⏱️ Don Hours Tracker (15h/week target)
- Visual progress bar toward your 15-hour weekly goal
- Breakdown by category:
  - DOD Shifts (~3h each)
  - Friday Night Hangouts
  - Meetings (Team, RLC, Senior Don 1:1, Community)
  - Connection Conversations
- Color-coded status indicators
- Alerts when below target

### 📚 Class Schedule Import
- Manual class entry with day/time selection
- Screenshot upload for reference
- Drag-and-drop image support
- Visual class tags with easy removal

### 🎯 Community Connection Tracker
- Input community size and deadline
- Calculates connections needed per week/day
- Integrates with DOD shifts for pacing recommendations

### 📋 Auto-Generated Schedule
- Weekly schedule grid (7am - 11pm)
- Locked blocks for classes, DOD, meetings, FNH
- Editable blocks for meals, study, personal, social time
- Drag-and-drop to rearrange
- Add/delete functionality

## Pre-loaded RLM Calendar Data

The app includes all key dates from the 2025-26 Residence Learning Model:

- **September 2025 - April 2026** coverage
- Community Meetings (#1-9)
- StarRez Reports (EB & BTE)
- Community Connection deadlines
- Friday Night Hangout dates
- Roommate Agreement due dates
- Academic dates (first/last day of classes, exams)
- Reading weeks and holidays
- Move-in/Move-out dates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/don-scheduler.git
cd don-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
don-scheduler/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # App icon
├── src/
│   ├── App.jsx             # Main application component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── README.md               # This file
├── .gitignore              # Git ignore rules
└── LICENSE                 # MIT License
```

## Usage Guide

### Step 1: Monthly Planner
- View the big picture of your month
- Check your weekly don hours target
- Toggle to "Weeks" view for snapshots
- Review term learning outcomes

### Step 2: Class Schedule
- Add your classes with name, day, start/end times
- Upload screenshots of your timetable for reference

### Step 3: RLM Calendar
- Upload your RLM calendar photo (optional)
- All key dates are already pre-loaded

### Step 4: DOD Shifts
- Select which nights you have Don On Duty
- See real-time hours calculation

### Step 5: Friday Night Hangouts
- Add FNH shifts with dates and times
- Track total FNH hours

### Step 6: Meetings
- Add team meetings (weekly)
- Add RLC meetings (bi-weekly)
- Add Senior Don 1:1s (monthly)
- Add community meetings (as scheduled)

### Step 7: Community Connections
- Enter your community size
- Set start and due dates
- Get pacing recommendations

### Step 8: Generated Schedule
- View your complete weekly schedule
- Use Move/Delete/Add tools to customize
- See hour totals by category

## Tech Stack

- **React 18** - UI framework
- **Lucide React** - Icons
- **CSS-in-JS** - Styling (no external CSS framework)
- **Google Fonts** - Outfit & Fraunces typefaces

## Color Scheme

| Block Type | Color |
|------------|-------|
| Classes | `#a8c5e2` (Soft Blue) |
| DOD | `#f5d5a0` (Soft Gold) |
| FNH | `#e8b4c8` (Soft Pink) |
| Meetings | `#9dd5c8` (Soft Teal) |
| Connections | `#c5b3d9` (Soft Purple) |
| Meals | `#f0b8b8` (Soft Coral) |
| Study | `#f5e6a3` (Soft Yellow) |
| Personal | `#b8d4e8` (Light Sky) |
| Social | `#c8e6c9` (Soft Green) |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for Trent University Residence Life staff
- Designed to help dons balance academic and community responsibilities
- RLM calendar data based on 2025-26 Residence Learning Model

---

Made with ❤️ for Residence Life Dons
