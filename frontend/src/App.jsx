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

const API = "https://savra-r70j.onrender.com";

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
  const [trends, setTrends] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refined States for Search & Dropdowns
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (selectedGrade !== "All Grades") {
          params.grade = selectedGrade.split(" ")[1];
        }
        if (selectedSubject !== "All Subjects") {
          params.subject = selectedSubject;
        }

        const [summaryRes, trendsRes, teachersRes, classroomsRes] = await Promise.all([
          axios.get(`${API}/insights/summary`, { params }),
          axios.get(`${API}/insights/trends`, { params }),
          axios.get(`${API}/insights/teachers`, { params }),
          axios.get(`${API}/insights/classrooms`, { params }),
        ]);

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setTeachers(teachersRes.data);
        setClassrooms(classroomsRes.data);

        if (teachersRes.data.length > 0 && !selectedTeacherName) {
          setSelectedTeacherName(teachersRes.data[0].name);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGrade, selectedSubject, selectedTeacherName]);

  const grades = ["All Grades", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
  const subjects = ["All Subjects", "Maths", "Science", "Physics", "Chemistry", "Biology", "English"];

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subjects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTeacherData = teachers.find(t => t.name === selectedTeacherName) || teachers[0];

  const reportTrend = [
    { name: 'Oct', teacher: selectedTeacherData?.avg || 82, school: 75 },
    { name: 'Nov', teacher: (selectedTeacherData?.avg || 82) - 2, school: 76 },
    { name: 'Dec', teacher: (selectedTeacherData?.avg || 82) + 5, school: 74 },
    { name: 'Jan', teacher: (selectedTeacherData?.avg || 82) + 8, school: 77 },
    { name: 'Feb', teacher: (selectedTeacherData?.avg || 82) + 6, school: 76 },
  ];

  // Export functions
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading...</div>;

  const renderHeaderRight = (placeholder) => (
    <div className="header-right no-print">
      <div className="search-container">
        <span className="search-icon"><Icons.Search /></span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <select
        className="grade-btn select-styled"
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
      >
        {grades.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <select
        className="subject-btn select-styled"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );

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
              {renderHeaderRight("Ask Savra Ai")}
            </header>

            <section className="insights-section">
              <div className="insights-header">
                <h2>Insights</h2>
                <div className="tabs no-print">
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
                  <div className="kpi-value">{summary?.active_teachers ?? "0"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card green">
                  <div className="kpi-top">
                    <span className="kpi-label">Lessons Created</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.lessons ?? "0"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card orange">
                  <div className="kpi-top">
                    <span className="kpi-label">Assessments Made</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.assessments ?? "0"}</div>
                  <div className="kpi-sub">This week</div>
                </div>

                <div className="kpi-card yellow">
                  <div className="kpi-top">
                    <span className="kpi-label">Quizzes Conducted</span>
                    <span className="kpi-icon"><Icons.Book /></span>
                  </div>
                  <div className="kpi-value">{summary?.quizzes ?? "0"}</div>
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
                    <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  {teachers.length > 0 && (
                    <div className="pulse-item pink">
                      <div className="pulse-icon-box"><Icons.Trophy /></div>
                      <div className="pulse-text">{teachers[0].name} is a top performer with {teachers[0].lessons} lessons</div>
                    </div>
                  )}
                  {classrooms.length > 0 && (
                    <div className="pulse-item green">
                      <div className="pulse-icon-box"><Icons.TrendingUp /></div>
                      <div className="pulse-text">{classrooms[0].name} has the highest average score of {classrooms[0].score}</div>
                    </div>
                  )}
                  <div className="pulse-item yellow">
                    <div className="pulse-icon-box"><Icons.AlertTriangle /></div>
                    <div className="pulse-text">Overall school engagement is at {summary?.submission_rate}%</div>
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
                <button className="back-btn no-print" onClick={() => { setView("dashboard"); setSearchQuery(""); }}>
                  <Icons.ChevronLeft />
                </button>
                <div className="teacher-profile-info">
                  <h1>{selectedTeacherName}</h1>
                  <p>Performance Overview</p>
                </div>
              </div>
              {renderHeaderRight("Search teachers...")}
            </header>

            <div className="teacher-meta">
              <p>Subject: <strong>{selectedTeacherData?.subjects || "General"}</strong></p>
              <div className="teacher-meta-row">
                <p>Grade Taught: <strong>Class 7, Class 8, Class 9, Class 10</strong></p>
                <div className="tabs mini-tabs no-print">
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
                <div className="kpi-value">{selectedTeacherData?.lessons || 0}</div>
              </div>

              <div className="kpi-card green-light">
                <div className="kpi-top">
                  <span className="kpi-label">Quizzes Conducted</span>
                  <span className="kpi-icon"><Icons.Book /></span>
                </div>
                <div className="kpi-value">{(selectedTeacherData?.lessons || 0) / 2 | 0}</div>
              </div>

              <div className="kpi-card yellow-light">
                <div className="kpi-top">
                  <span className="kpi-label">Assessments Assigned</span>
                  <span className="kpi-icon"><Icons.Book /></span>
                </div>
                <div className="kpi-value">{(selectedTeacherData?.lessons || 0) / 4 | 0}</div>
              </div>

              <div className="kpi-card gray-light alert-card">
                <div className="kpi-top">
                  <span className="kpi-label">Engagement Score</span>
                  <span className="kpi-icon"><Icons.AlertTriangle /></span>
                </div>
                <div className="engagement-text">Performance Rating: {selectedTeacherData?.status}. Avg Score: {selectedTeacherData?.avg}%.</div>
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
                    <BarChart data={classrooms} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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

              <div className="panel recent-activity no-print">
                <h3>Filtered Results</h3>
                <div className="pulse-list">
                  {filteredTeachers.slice(0, 3).map((t, i) => (
                    <div key={i} className="pulse-item pink" style={{ cursor: 'pointer' }} onClick={() => setSelectedTeacherName(t.name)}>
                      <div className="pulse-icon-box"><Icons.User /></div>
                      <div className="pulse-text">{t.name} - {t.subjects}</div>
                    </div>
                  ))}
                  {filteredTeachers.length === 0 && <div className="empty-sub">No teachers found for "{searchQuery}"</div>}
                </div>
              </div>
            </div>

            <div className="page-footer no-print">
              <button className="export-btn" onClick={() => exportToCSV([selectedTeacherData], `${selectedTeacherName}_Report`)}>
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
                <button className="back-btn no-print" onClick={() => { setView("dashboard"); setSearchQuery(""); }}>
                  <Icons.ChevronLeft />
                </button>
                <div className="teacher-profile-info">
                  <h1>Classroom Overviews</h1>
                  <p>Performance & Analytics by Grade</p>
                </div>
              </div>
              {renderHeaderRight("Search grades...")}
            </header>

            <div className="kpi-grid">
              {filteredClassrooms.map(c => (
                <div key={c.name} className="kpi-card blue">
                  <div className="kpi-top">
                    <span className="kpi-label">{c.name} Avg Score</span>
                    <span className="kpi-icon"><Icons.TrendingUp /></span>
                  </div>
                  <div className="kpi-value">{c.score}</div>
                  <div className="kpi-sub">{c.completion}% Completion</div>
                </div>
              ))}
              {filteredClassrooms.length === 0 && <div className="empty-sub">No grades found for "{searchQuery}"</div>}
            </div>

            <div className="dashboard-bottom">
              <div className="panel grade-performance">
                <h3>Grade Comparison</h3>
                <p className="panel-sub">Performance metrics across all levels</p>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={filteredClassrooms}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#3498db" name="Avg Score" />
                      <Bar dataKey="completion" fill="#f39c12" name="Completion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="page-footer no-print">
              <button className="export-btn" onClick={exportToPDF} style={{ backgroundColor: '#2ecc71' }}>
                <Icons.Download /> PDF Summary
              </button>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="reports-view">
            <header className="header">
              <div className="header-left">
                <h1>Reports Dashboard</h1>
                <p>Detailed performance analytics and comparisons</p>
              </div>
              {renderHeaderRight("Search data...")}
            </header>

            <div className="dashboard-bottom report-layout">
              <div className="panel performance-comparison">
                <div className="panel-header-row">
                  <h3>{selectedTeacherName} vs School Average</h3>
                  <select
                    className="select-teacher select-styled mini no-print"
                    value={selectedTeacherName}
                    onChange={(e) => setSelectedTeacherName(e.target.value)}
                  >
                    {teachers.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
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
                      <Area type="monotone" dataKey="teacher" stroke="#7c5cff" strokeWidth={3} fillOpacity={1} fill="url(#colorTeacher)" name={`${selectedTeacherName}'s Score`} />
                      <Area type="monotone" dataKey="school" stroke="#e0e0e0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="School Average" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel summary-metrics">
                <h3>Quick Metrics</h3>
                <div className="pulse-list">
                  <div className="pulse-item green">
                    <div className="pulse-text">Teacher Score: <strong>{selectedTeacherData?.avg}%</strong></div>
                  </div>
                  <div className="pulse-item blue" style={{ backgroundColor: '#ebf5fb' }}>
                    <div className="pulse-text">Lessons: <strong>{selectedTeacherData?.lessons}</strong></div>
                  </div>
                  <div className="pulse-item yellow">
                    <div className="pulse-text">Performance: <strong>{selectedTeacherData?.status}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel teacher-table-panel">
              <div className="panel-header-row">
                <h3>Teacher Performance Overview</h3>
                <button className="view-btn no-print" onClick={exportToPDF} style={{ padding: '4px 12px' }}>Export PDF</button>
              </div>
              <div className="table-container">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Teacher Name</th>
                      <th>Primary Subjects</th>
                      <th>Avg Student Score</th>
                      <th>Lessons Created</th>
                      <th>Status</th>
                      <th className="no-print">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher, idx) => (
                      <tr key={idx} className={selectedTeacherName === teacher.name ? "selected-row" : ""}>
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
                        <td className="no-print">
                          <button className="view-btn" onClick={() => { setSelectedTeacherName(teacher.name); setView("teachers"); setSearchQuery(""); }}>View Detailed</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTeachers.length === 0 && <div className="empty-state-padding">No results found for "{searchQuery}"</div>}
              </div>
            </div>

            <div className="page-footer no-print">
              <button className="export-btn" onClick={() => exportToCSV(teachers, "School_Wide_Teacher_Report")}>
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
      <aside className="sidebar no-print">
        <div className="sidebar-top">
          <div className="logo-container">
            <img src={logo} alt="Savra Logo" className="logo-img" />
          </div>

          <div className="sidebar-menu">
            <div className="sidebar-label">Main</div>
            <nav className="nav-links">
              <a href="#" className={`nav-item ${view === "dashboard" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("dashboard"); setSearchQuery(""); }}>
                <span className="nav-icon"><Icons.Dashboard /></span>
                Dashboard
              </a>
              <a href="#" className={`nav-item ${view === "teachers" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("teachers"); setSearchQuery(""); }}>
                <span className="nav-icon"><Icons.Teachers /></span>
                Teachers
              </a>
              <a href="#" className={`nav-item ${view === "classrooms" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("classrooms"); setSearchQuery(""); }}>
                <span className="nav-icon"><Icons.Classrooms /></span>
                Classrooms
              </a>
              <a href="#" className={`nav-item ${view === "reports" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setView("reports"); setSearchQuery(""); }}>
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
