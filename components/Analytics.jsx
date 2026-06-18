import React, { useState } from 'react'

function Analytics() {
  const [range, setRange] = useState("Last 3 Months");
  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <circle cx="12" cy="12" r="10" stroke="#7C6FF7" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="#7C6FF7" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="#7C6FF7" />
        </svg>
      ),
      iconBg: "bg-indigo-100",
      label: "Active Habits",
      value: "1",
      sub: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <polyline points="3 17 9 11 13 15 21 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="17 7 21 7 21 11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-green-100",
      label: "Avg. Completion",
      value: "0%",
      sub: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <circle cx="12" cy="8" r="4" stroke="#F59E0B" strokeWidth="2" />
          <path d="M8 14h8l1 7H7l1-7z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-amber-100",
      label: "Longest Streak",
      value: "0 days",
      sub: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <rect x="3" y="4" width="18" height="17" rx="2" stroke="#A78BFA" strokeWidth="2" />
          <path d="M3 9h18" stroke="#A78BFA" strokeWidth="2" />
          <path d="M8 2v3M16 2v3" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      iconBg: "bg-violet-100",
      label: "Best Month",
      value: "None",
      sub: "0%",
    },
  ];

  const topHabits = [
    { rank: 1, icon: "🧊", name: "drink 8 glass of water", streak: "0 day streak", pct: "0%" },
  ];
  function SparkLine() {
    const months = ["Nov 2024", "Dec 2024", "Jan 2025"];
    const w = 600, h = 200, padL = 36, padB = 36, padR = 24, padT = 16;
    const inner_w = w - padL - padR;
    const inner_h = h - padT - padB;
    const yZero = padT + inner_h;
    const points = months.map((_, i) => {
      const x = padL + (i / (months.length - 1)) * inner_w;
      return `${x},${yZero}`;
    });

    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" display="block">
        {[0, 1].map((tick) => {
          const y = padT + inner_h - tick * inner_h;
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{tick}</text>
            </g>
          );
        })}
        <polyline points={points.join(" ")} fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {months.map((m, i) => {
          const x = padL + (i / (months.length - 1)) * inner_w;
          return (
            <text key={m} x={x} y={h - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF">{m}</text>
          );
        })}
      </svg>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your progress and identify patterns</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">{s.value}</p>
              {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>

        {/* Monthly Progress Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Monthly Progress Trend</p>
          <p className="text-xs text-gray-500 mb-4">Completion rates over time</p>
          <div className="h-48">
            <SparkLine />
          </div>
        </div>

        {/* Top Performing Habits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Top Performing Habits</p>
          <p className="text-xs text-gray-500 mb-4">This month's best habits</p>
          {topHabits.map((h) => (
            <div key={h.name} className="flex items-center gap-3 py-2.5 border-t border-gray-100">
              <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-500 shrink-0">
                {h.rank}
              </span>
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                {h.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{h.name}</p>
                <p className="text-xs text-gray-400">{h.streak}</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">{h.pct}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Analytics
