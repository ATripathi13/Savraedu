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

import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    axios.get(`${API}/insights/summary`).then((r) => setSummary(r.data));
    axios.get(`${API}/insights/trends`).then((r) => setTrend(r.data));
  }, []);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">SAVRA</h2>

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

        {/* Stat Cards */}
        <div className="cards">
          {summary.map((t) => (
            <div className="card" key={t.teacher_id}>
              <div className="value">{t.total}</div>
              <div className="label">{t.teacher_name}</div>
              <div className="sub">This week</div>
            </div>
          ))}
        </div>

        {/* Charts + AI Panel */}
        <div className="grid">
          <div className="panel">
            <h3>Weekly Activity</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trend}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7c8cff" />
              </LineChart>
            </ResponsiveContainer>
          </div>

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
