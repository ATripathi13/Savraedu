import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import logo from "./assets/logo.webp";
import "./App.css";

const API = "http://127.0.0.1:8000";

// Simple SVG Icons to match the image
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  Teachers: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Classrooms: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  ),
  Reports: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Book: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Award: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  ),
  Trophy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.44.98.94 1.21 1.21.54 2.06 2.03 2.06 3.79"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>
  ),
  TrendingUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  )
};

export default function App() {
  const [view, setView] = useState("dashboard");
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("Diipaal");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          axios.get(`${API}/insights/summary`),
          axios.get(`${API}/insights/trends`),
        ]);

        setSummary(summaryRes.data);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const transformedTrend = trendRes.data.map((item, index) => ({
          name: days[index] || `Day ${index + 1}`,
          value1: item.count || 0,
          value2: (item.count || 0) * 0.6
        }));
        setTrend(transformedTrend);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  const barData = [
    { name: 'Class 7', score: 3.2, completion: 85 },
    { name: 'Class 8', score: 2.8, completion: 70 },
    { name: 'Class 9', score: 3.5, completion: 90 },
    { name: 'Class 10', score: 3.0, completion: 80 },
  ];

  const classroomTrend = [
    { name: 'Week 1', avg: 75, top: 92 },
    { name: 'Week 2', avg: 78, top: 95 },
    { name: 'Week 3', avg: 72, top: 88 },
    { name: 'Week 4', avg: 80, top: 96 },
  ];

  const reportTrend = [
    { name: 'Oct', teacher: 82, school: 75 },
    { name: 'Nov', teacher: 78, school: 76 },
    { name: 'Dec', teacher: 85, school: 74 },
    { name: 'Jan', teacher: 90, school: 77 },
    { name: 'Feb', teacher: 88, school: 76 },
  ];

  const teacherList = [
    { name: "Diipaal", subjects: "Chemistry, Science", avg: 88, lessons: 142, status: "Excellent" },
    { name: "Shaurya", subjects: "Maths, Physics", avg: 82, lessons: 98, status: "Good" },
    { name: "Harshita", subjects: "Biology, English", avg: 75, lessons: 110, status: "Average" },
    { name: "Ankit", subjects: "History, Civics", avg: 65, lessons: 45, status: "Improvement Needed" },
    { name: "Meera", subjects: "Geography", avg: 92, lessons: 88, status: "Excellent" },
  ];

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <>
            <header className="header">
              <div className="header-left">
                <h1>Admin Companion</h1>
                <p>See What's Happening Across your School</p>
              </div>

              <div className="header-right">
                <div className="search-container">
                  <span className="search-icon"><Icons.Search /></span>
                  <input type="text" className="search-input" placeholder="Ask Savra Ai" />
                </div>
                <button className="grade-btn">
                  Grade 7 <Icons.ChevronDown />
                </button>
                <button className="subject-btn">
                  All Subjects <Icons.ChevronDown />
                </button>
              </div>
            </header>

            <section className="insights-section">
              <div className="insights-header">
                <h2>Insights</h2>
                <div className="tabs">
                  <button className="tab active">This Week</button>
                  <button className="tab">This Month</button>
                  <button className="tab">This Year</button>
                </div>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card blue">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Teachers</span>
                    <span className="kpi-icon"><Icons.Users /></span>
                  </div>
                  <div className="kpi-value">{summary?.active_teachers ?? "52"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card green">
                  <div className="kpi-top">
                    <span className="kpi-label">Lessons Created</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.lessons ?? "64"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card orange">
                  <div className="kpi-top">
                    <span className="kpi-label">Assessments Made</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.assessments ?? "39"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card yellow">
                  <div className="kpi-top">
                    <span className="kpi-label">Quizzes Conducted</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.quizzes ?? "50"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card pink">
                  <div className="kpi-top">
                    <span className="kpi-label">Submission Rate</span>
                    <span className="kpi-icon"><Icons.Award /></span>
                  </div>
                  <div className="kpi-value">{summary?.submission_rate ?? "0"}%</div>
                  <div className="kpi-sub">This week</div>
                </div>
              </div>
            </section>

            <div className="dashboard-bottom">
              <div className="panel weekly-activity">
                <h3>Weekly Activity</h3>
                <p className="panel-sub">Content creation trends</p>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value1" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorVal1)" />
                      <Area type="monotone" dataKey="value2" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorVal2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel ai-pulse">
                <h3>AI Pulse Summary</h3>
                <p className="panel-sub">Real time insights from your data</p>
                <div className="pulse-list">
                  <div className="pulse-item pink">
                    <div className="pulse-icon-box"><Icons.Trophy /></div>
                    <div className="pulse-text">Harshita has the highest workload with 35 classes and 7 subjects</div>
                  </div>
                  <div className="pulse-item green">
                    <div className="pulse-icon-box"><Icons.TrendingUp /></div>
                    <div className="pulse-text">Class 1 A has the most students with 7 enrolled</div>
                  </div>
                  <div className="pulse-item yellow">
                    <div className="pulse-icon-box"><Icons.AlertTriangle /></div>
                    <div className="pulse-text">Class 11 A has only 0 students - consider reviewing enrollment</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "teachers":
        return (
          <div className="teachers-view">
            <header className="header">
              <div className="header-left-row">
                <button className="back-btn" onClick={() => setView("dashboard")}>
                  <Icons.ChevronLeft />
                </button>
                <div className="teacher-profile-info">
                  <h1>{selectedTeacher}</h1>
                  <p>Performance Overview</p>
                </div>
              </div>

              <div className="header-right">
                <div className="search-container">
                  <span className="search-icon"><Icons.Search /></span>
                  <input type="text" className="search-input" placeholder="Search teachers..." />
                </div>
                <button className="grade-btn">
                  Grade 7 <Icons.ChevronDown />
                </button>
                <button className="subject-btn">
                  All Subjects <Icons.ChevronDown />
                </button>
              </div>
            </header>

            <div className="teacher-meta">
              <p>Subject: <strong>Chemistry, Science, Physics, Maths, Business Studies, Biology</strong></p>
              <div className="teacher-meta-row">
                <p>Grade Taught: <strong>Class 7, Class 8, Class 9, Class 10</strong></p>
                <div className="tabs mini-tabs">
                  <button className="tab active">This Week</button>
                  <button className="tab">This Month</button>
                  <button className="tab">This Year</button>
                </div>
              </div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card pink-light">
                <div className="kpi-top">
                  <span className="kpi-label">Lessons Created</span>
                  <span className="kpi-icon"><Icons.Users /></span>
                </div>
                <div className="kpi-value">0</div>
              </div>

              <div className="kpi-card green-light">
                <div className="kpi-top">
                  <span className="kpi-label">Quizzes Conducted</span>
                  <span className="kpi-icon"><Icons.Book /></span>
                </div>
                <div className="kpi-value">0</div>
              </div>

              <div className="kpi-card yellow-light">
                <div className="kpi-top">
                  <span className="kpi-label">Assessments Assigned</span>
                  <span className="kpi-icon"><Icons.Book /></span>
                </div>
                <div className="kpi-value">1</div>
              </div>

              <div className="kpi-card gray-light alert-card">
                <div className="kpi-top">
                  <span className="kpi-label">Low Engagement Note</span>
                  <span className="kpi-icon"><Icons.AlertTriangle /></span>
                </div>
                <div className="engagement-text">Average score is 0%. Consider reviewing teaching methods.</div>
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="panel class-breakdown">
                <h3>Class-wise Breakdown</h3>
                <div className="custom-legend">
                  <div className="legend-item"><span className="dot blue"></span> Avg Score</div>
                  <div className="legend-item"><span className="dot orange"></span> Completion</div>
                </div>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 13 }} dy={10} />
                      <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 13 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3498db" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="completion" fill="#f39c12" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel recent-activity">
                <h3>Recent Activity</h3>
                <div className="empty-activity">
                  <div className="empty-icon"><Icons.Reports /></div>
                  <div className="empty-title">No Recent Activity</div>
                  <div className="empty-sub">No lessons or quizzes created yet</div>
                </div>
              </div>
            </div>

            <div className="page-footer">
              <button className="export-btn">
                <Icons.Download /> Export Report (CSV)
              </button>
            </div>
          </div>
        );
      case "classrooms":
        return (
          <div className="classrooms-view">
            <header className="header">
              <div className="header-left-row">
                <button className="back-btn" onClick={() => setView("dashboard")}>
                  <Icons.ChevronLeft />
                </button>
                <div className="teacher-profile-info">
                  <h1>Grade 7 Overview</h1>
                  <p>Classroom Performance & Analytics</p>
                </div>
              </div>

              <div className="header-right">
                <div className="search-container">
                  <span className="search-icon"><Icons.Search /></span>
                  <input type="text" className="search-input" placeholder="Search students..." />
                </div>
                <button className="grade-btn">
                  Grade 7 <Icons.ChevronDown />
                </button>
                <button className="subject-btn">
                  All Subjects <Icons.ChevronDown />
                </button>
              </div>
            </header>

            <div className="teacher-meta">
              <p>Class Teacher: <strong>Shauryaman Ray</strong></p>
              <div className="teacher-meta-row">
                <p>Total Students: <strong>35 Enrolled</strong></p>
                <div className="tabs mini-tabs">
                  <button className="tab active">Weekly</button>
                  <button className="tab">Monthly</button>
                  <button className="tab">Yearly</button>
                </div>
              </div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card blue">
                <div className="kpi-top">
                  <span className="kpi-label">Active Students</span>
                  <span className="kpi-icon"><Icons.Users /></span>
                </div>
                <div className="kpi-value">32</div>
                <div className="kpi-sub">Out of 35</div>
              </div>

              <div className="kpi-card green">
                <div className="kpi-top">
                  <span className="kpi-label">Attendance Rate</span>
                  <span className="kpi-icon"><Icons.Award /></span>
                </div>
                <div className="kpi-value">94%</div>
                <div className="kpi-sub">Above average</div>
              </div>

              <div className="kpi-card orange">
                <div className="kpi-top">
                  <span className="kpi-label">Average Score</span>
                  <span className="kpi-icon"><Icons.TrendingUp /></span>
                </div>
                <div className="kpi-value">78</div>
                <div className="kpi-sub">+5% from last month</div>
              </div>

              <div className="kpi-card yellow">
                <div className="kpi-top">
                  <span className="kpi-label">Assignments Done</span>
                  <span className="kpi-icon"><Icons.Book /></span>
                </div>
                <div className="kpi-value">12</div>
                <div className="kpi-sub">This week</div>
              </div>

              <div className="kpi-card pink">
                <div className="kpi-top">
                  <span className="kpi-label">Pending Reviews</span>
                  <span className="kpi-icon"><Icons.AlertTriangle /></span>
                </div>
                <div className="kpi-value">4</div>
                <div className="kpi-sub">Requires attention</div>
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="panel grade-performance">
                <h3>Performance Trends</h3>
                <p className="panel-sub">Average vs Top Performer scores</p>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={classroomTrend}>
                      <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3498db" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="avg" stroke="#3498db" fillOpacity={1} fill="url(#colorAvg)" name="Class Average" />
                      <Area type="monotone" dataKey="top" stroke="#2ecc71" fill="transparent" name="Top Performer" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel active-students">
                <h3>Top Students</h3>
                <ul className="pulse-list">
                  <li className="pulse-item green">
                    <div className="pulse-icon-box"><Icons.Award /></div>
                    <div className="pulse-text"><strong>Aravind Kumar</strong> - 98% Score (Physics)</div>
                  </li>
                  <li className="pulse-item blue" style={{ backgroundColor: '#ebf5fb' }}>
                    <div className="pulse-icon-box"><Icons.Award /></div>
                    <div className="pulse-text"><strong>Meera Nair</strong> - 95% Score (Maths)</div>
                  </li>
                  <li className="pulse-item orange" style={{ backgroundColor: '#fef5e7' }}>
                    <div className="pulse-icon-box"><Icons.Award /></div>
                    <div className="pulse-text"><strong>Rahul Singh</strong> - 92% Score (Chemistry)</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="reports-view">
            <header className="header">
              <div className="header-left">
                <h1>Teacher Performance Reports</h1>
                <p>Detailed performance analytics and comparisons</p>
              </div>

              <div className="header-right">
                <div className="search-container teacher-search">
                  <span className="search-icon"><Icons.User /></span>
                  <select
                    className="search-input select-teacher"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    {teacherList.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <button className="grade-btn">
                  Export PDF <Icons.Download />
                </button>
              </div>
            </header>

            <div className="dashboard-bottom report-layout">
              <div className="panel performance-comparison">
                <h3>{selectedTeacher} vs School Average</h3>
                <p className="panel-sub">Performance trend comparison across key metrics</p>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={reportTrend}>
                      <defs>
                        <linearGradient id="colorTeacher" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="teacher" stroke="#7c5cff" strokeWidth={3} fillOpacity={1} fill="url(#colorTeacher)" name={`${selectedTeacher}'s Score`} />
                      <Area type="monotone" dataKey="school" stroke="#e0e0e0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="School Average" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel summary-metrics">
                <h3>Quick Metrics</h3>
                <div className="pulse-list">
                  <div className="pulse-item green">
                    <div className="pulse-text">Teacher Score: <strong>88%</strong></div>
                  </div>
                  <div className="pulse-item blue" style={{ backgroundColor: '#ebf5fb' }}>
                    <div className="pulse-text">School Rank: <strong>#4 of 52</strong></div>
                  </div>
                  <div className="pulse-item yellow">
                    <div className="pulse-text">Growth Index: <strong>+12%</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel teacher-table-panel">
              <h3>All Teachers Performance Overview</h3>
              <div className="table-container">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Teacher Name</th>
                      <th>Primary Subjects</th>
                      <th>Avg Student Score</th>
                      <th>Lessons Created</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherList.map((teacher, idx) => (
                      <tr key={idx} className={selectedTeacher === teacher.name ? "selected-row" : ""}>
                        <td>
                          <div className="table-cell-name">
                            <div className="mini-avatar">{teacher.name.substring(0, 2)}</div>
                            {teacher.name}
                          </div>
                        </td>
                        <td>{teacher.subjects}</td>
                        <td>
                          <div className="score-badge">
                            <div className="score-bar" style={{ width: `${teacher.avg}%`, backgroundColor: teacher.avg > 85 ? "#2ecc71" : teacher.avg > 75 ? "#f1c40f" : "#e67e22" }}></div>
                            <span>{teacher.avg}%</span>
                          </div>
                        </td>
                        <td>{teacher.lessons}</td>
                        <td>
                          <span className={`status-tag ${teacher.status.toLowerCase().replace(/ /g, '-')}`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td>
                          <button className="view-btn" onClick={() => { setSelectedTeacher(teacher.name); setView("teachers"); }}>View Detailed</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="page-footer">
              <button className="export-btn">
                <Icons.Download /> Export Full Table (CSV)
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-container">
            <img src={logo} alt="Savra Logo" className="logo-img" />
          </div>

          <div className="sidebar-menu">
            <div className="sidebar-label">Main</div>
            <nav className="nav-links">
              <a href="#" className={`nav-item ${view === "dashboard" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("dashboard"); }}>
                <span className="nav-icon"><Icons.Dashboard /></span>
                Dashboard
              </a>
              <a href="#" className={`nav-item ${view === "teachers" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("teachers"); }}>
                <span className="nav-icon"><Icons.Teachers /></span>
                Teachers
              </a>
              <a href="#" className={`nav-item ${view === "classrooms" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("classrooms"); }}>
                <span className="nav-icon"><Icons.Classrooms /></span>
                Classrooms
              </a>
              <a href="#" className={`nav-item ${view === "reports" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("reports"); }}>
                <span className="nav-icon"><Icons.Reports /></span>
                Reports
              </a>
            </nav>
          </div>
        </div>

        <div className="admin-profile">
          <div className="avatar">SR</div>
          <div className="admin-info">
            <span className="admin-role">School Admin</span>
            <span className="admin-name">Shauryaman Ray</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}
