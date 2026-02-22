import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import logo from "./assets/logo.webp";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          axios.get(`${API}/insights/summary`),
          axios.get(`${API}/insights/trends`),
        ]);

        setSummary(summaryRes.data);
        setTrend(trendRes.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="Savra Logo" className="logo" />

        <nav>
          <a className="active">Dashboard</a>
          <a>Teachers</a>
          <a>Classrooms</a>
          <a>Reports</a>
        </nav>

        <div className="admin">
          <div className="avatar">SR</div>
          <div>
            <div className="small">School Admin</div>
            <div className="name">Shauryaman Ray</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="content">
        <header className="topbar">
          <h1>Admin Companion</h1>

          <input placeholder="Ask Savra AI" />

          <select>
            <option>Grade 7</option>
          </select>

          <select>
            <option>All Subjects</option>
          </select>
        </header>

        <h2>Insights</h2>

        {/* 🔥 KPI Stat Cards */}
        <div className="cards">
          <div className="card">
            <div className="value">
              {summary?.active_teachers ?? "--"}
            </div>
            <div className="label">Active Teachers</div>
            <div className="sub">This week</div>
          </div>

          <div className="card">
            <div className="value">{summary?.lessons ?? "--"}</div>
            <div className="label">Lessons Created</div>
            <div className="sub">This week</div>
          </div>

          <div className="card">
            <div className="value">{summary?.assessments ?? "--"}</div>
            <div className="label">Assessments Made</div>
            <div className="sub">This week</div>
          </div>

          <div className="card">
            <div className="value">{summary?.quizzes ?? "--"}</div>
            <div className="label">Quizzes Conducted</div>
            <div className="sub">This week</div>
          </div>

          <div className="card">
            <div className="value">
              {summary?.submission_rate ?? "--"}%
            </div>
            <div className="label">Submission Rate</div>
            <div className="sub">This week</div>
          </div>
        </div>

        {/* Charts + AI Panel */}
        <div className="grid">
          {/* Weekly Chart */}
          <div className="panel">
            <h3>Weekly Activity</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trend}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7c8cff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Summary Panel */}
          <div className="panel">
            <h3>AI Pulse Summary</h3>

            <ul className="pulse">
              <li>Harshita has the highest workload</li>
              <li>Class 1A has the most students</li>
              <li>Class 11A has low enrollment</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
