'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        annualRevenue: 0,
        newUsersThisMonth: 0,
    });

    const [revenueData, setRevenueData] = useState([]);
    const [planDistribution, setPlanDistribution] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/analytics/overview', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStats(response.data.stats);
            setRevenueData(response.data.revenueData);
            setPlanDistribution(response.data.planDistribution);
            setUserGrowth(response.data.userGrowth);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const COLORS = ['#FFC107', '#3B82F6', '#10B981', '#EF4444'];

    return (
        <div className="text-white">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Analytics</h1>

            {/* Key Metrics - 2 cols mobile, 5 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Total Abonnés</h3>
                    <p className="text-xl md:text-3xl font-bold">{stats.totalSubscribers}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Actifs</h3>
                    <p className="text-xl md:text-3xl font-bold text-green-500">{stats.activeSubscriptions}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Revenus/Mois</h3>
                    <p className="text-lg md:text-2xl font-bold text-yellow-500">{stats.monthlyRevenue.toLocaleString()} F</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Revenus/An</h3>
                    <p className="text-lg md:text-2xl font-bold text-yellow-500">{stats.annualRevenue.toLocaleString()} F</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 col-span-2 md:col-span-1">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Nouveaux (ce mois)</h3>
                    <p className="text-xl md:text-3xl font-bold text-blue-500">{stats.newUsersThisMonth}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Revenue Chart */}
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h2 className="text-lg md:text-xl font-bold mb-4">Revenus sur 12 mois</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', fontSize: 12 }} />
                            <Line type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={2} name="Revenus (FCFA)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Plan Distribution */}
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h2 className="text-lg md:text-xl font-bold mb-4">Distribution des Plans</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={planDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {planDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                <h2 className="text-lg md:text-xl font-bold mb-4">Croissance des Utilisateurs</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', fontSize: 12 }} />
                        <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Utilisateurs" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
