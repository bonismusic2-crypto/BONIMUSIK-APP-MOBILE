'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        totalContent: 0,
    });

    useEffect(() => {
        // TODO: Fetch real stats from API
        // For now, using placeholder data
    }, []);

    return (
        <div className="text-white">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Total Abonnés</h3>
                    <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Abonnements Actifs</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.activeSubscriptions}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Revenus Mensuels</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.monthlyRevenue.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Total Contenus</h3>
                    <p className="text-3xl font-bold">{stats.totalContent}</p>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Bienvenue sur BONI MUSIK Admin</h2>
                <p className="text-gray-400">
                    Utilisez le menu de gauche pour gérer les contenus, abonnés, et paramètres de l'application.
                </p>
            </div>
        </div>
    );
}
