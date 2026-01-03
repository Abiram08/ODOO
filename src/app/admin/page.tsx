"use client";

import { Users, TrendingUp, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from "recharts";

// Mock Data for "3 Plans"
const planData = [
    { name: "Free Tier", users: 1250, color: "#94A3B8" }, // Gray
    { name: "Premium", users: 850, color: "#10B981" },    // Green
    { name: "Pro / Agency", users: 320, color: "#FF6B4A" }, // Brand Color
];

const revenueData = [
    { month: "Jan", amount: 4000 },
    { month: "Feb", amount: 3000 },
    { month: "Mar", amount: 2000 },
    { month: "Apr", amount: 2780 },
    { month: "May", amount: 1890 },
    { month: "Jun", amount: 2390 },
    { month: "Jul", amount: 3490 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Users", value: "2,420", trend: "+12%", trendUp: true, icon: Users, color: "bg-blue-500" },
                    { title: "Active Trips", value: "145", trend: "+5%", trendUp: true, icon: Activity, color: "bg-[#FF6B4A]" },
                    { title: "Revenue", value: "$12.4k", trend: "-2.4%", trendUp: false, icon: CreditCard, color: "bg-[#10B981]" },
                    { title: "Avg. Duration", value: "8 Days", trend: "+1 Day", trendUp: true, icon: TrendingUp, color: "bg-purple-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {stat.trend}
                                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm font-medium">{stat.title}</div>
                            <div className="text-2xl font-bold text-[#1E293B]">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* 3 Plans Analytics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h3 className="font-bold text-lg text-[#1E293B] mb-6">Subscription Plans</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={planData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="users" radius={[0, 4, 4, 0]} barSize={30}>
                                    {planData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        {planData.map(plan => (
                            <div key={plan.name} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-gray-600">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                                    {plan.name}
                                </span>
                                <span className="font-bold text-[#1E293B]">{plan.users} Users</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Graph (Revenue/Traffic) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-[#1E293B]">Platform Growth</h3>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm p-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6b4a" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ff6b4a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="amount" stroke="#FF6B4A" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
