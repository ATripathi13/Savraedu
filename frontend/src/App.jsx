import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend
} from "recharts";

const API = "http://127.0.0.1:8000";

function App() {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState("");
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    axios.get(`${API}/insights/overview`)
      .then(res => setTeachers(res.data));
  }, []);

  useEffect(() => {
    if (selected)
      axios.get(`${API}/insights/weekly?teacher_id=${selected}`)
        .then(res => setWeekly(res.data));
  }, [selected]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Teacher Insights Dashboard</h1>

      <select onChange={e => setSelected(e.target.value)}>
        <option>Select Teacher</option>
        {teachers.map(t => (
          <option key={t.teacher_id} value={t.teacher_id}>
            {t.teacher_name}
          </option>
        ))}
      </select>

      <h2>Weekly Activity</h2>

      <LineChart width={600} height={300} data={weekly}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="lessons" stroke="#8884d8" />
        <Line dataKey="quizzes" stroke="#82ca9d" />
        <Line dataKey="assessments" stroke="#ff7300" />
      </LineChart>
    </div>
  );
}

export default App;
