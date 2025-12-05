'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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
            <h1 className="text-4xl font-bold mb-8">Analytics & Statistiques</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Total Abonnés</h3>
                    <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Actifs</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.activeSubscriptions}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Revenus Mensuels</h3>
                    <p className="text-2xl font-bold text-yellow-500">{stats.monthlyRevenue.toLocaleString()} F</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Revenus Annuels</h3>
                    <p className="text-2xl font-bold text-yellow-500">{stats.annualRevenue.toLocaleString()} F</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Nouveaux (ce mois)</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats.newUsersThisMonth}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Revenus sur 12 mois</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={2} name="Revenus (FCFA)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Plan Distribution */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Distribution des Plans</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={planDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {planDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Croissance des Utilisateurs</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Legend />
                        <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Utilisateurs" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
