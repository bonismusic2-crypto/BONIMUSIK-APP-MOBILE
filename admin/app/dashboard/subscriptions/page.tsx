'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscription {
    id: string;
    user: {
        phone_number: string;
        full_name: string;
    };
    plan: string;
    status: string;
    start_date: string;
    end_date: string;
    amount: number;
}

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, [filter]);

    const fetchSubscriptions = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/subscriptions', {
                headers: { Authorization: `Bearer ${token}` },
                params: filter !== 'all' ? { status: filter } : {},
            });
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscriptions = subscriptions.filter((sub) =>
        sub.user.phone_number.includes(searchTerm) || sub.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter((s) => s.status === 'active').length,
        monthly: subscriptions.filter((s) => s.plan === 'monthly').length,
        annual: subscriptions.filter((s) => s.plan === 'annual').length,
    };

    return (
        <div className="text-white">
            <h1 className="text-4xl font-bold mb-8">Gestion des Abonnements</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Total Abonnés</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Actifs</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.active}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Mensuels</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats.monthly}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm mb-2">Annuels</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.annual}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher par téléphone ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex gap-2">
                    {['all', 'active', 'expired', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg transition ${filter === status
                                    ? 'bg-yellow-500 text-black font-bold'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {status === 'all' ? 'Tous' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : filteredSubscriptions.length === 0 ? (
                <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-lg">Aucun abonnement trouvé</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Utilisateur</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Téléphone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Plan</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Statut</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Montant</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Expiration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredSubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-700 transition">
                                    <td className="px-6 py-4">{sub.user.full_name}</td>
                                    <td className="px-6 py-4 text-gray-400">{sub.user.phone_number}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.plan === 'annual' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'
                                            }`}>
                                            {sub.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-500 text-white' :
                                                sub.status === 'expired' ? 'bg-red-500 text-white' :
                                                    'bg-gray-500 text-white'
                                            }`}>
                                            {sub.status === 'active' ? 'Actif' : sub.status === 'expired' ? 'Expiré' : 'Annulé'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{sub.amount.toLocaleString()} FCFA</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(sub.end_date).toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
