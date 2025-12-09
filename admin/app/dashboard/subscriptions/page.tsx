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

interface User {
    id: string;
    phone_number: string;
    full_name: string;
}

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
    const [grantingSubscription, setGrantingSubscription] = useState(false);
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        fetchSubscriptions();
        fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleGrantFreeSubscription = async () => {
        if (!selectedUserId) {
            alert('Veuillez sélectionner un utilisateur');
            return;
        }

        setGrantingSubscription(true);
        try {
            const token = localStorage.getItem('admin_token');
            await axios.post(
                'https://bonimusik-app-mobile.onrender.com/api/subscriptions/grant-free',
                { userId: selectedUserId, plan: selectedPlan },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Abonnement gratuit accordé avec succès !');
            setShowModal(false);
            setSelectedUserId('');
            setUserSearch('');
            fetchSubscriptions();
        } catch (error) {
            console.error('Error granting subscription:', error);
            alert('Erreur lors de l\'attribution de l\'abonnement');
        } finally {
            setGrantingSubscription(false);
        }
    };

    const filteredSubscriptions = subscriptions.filter((sub) =>
        sub.user?.phone_number?.includes(searchTerm) || sub.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.phone_number?.includes(userSearch) || user.full_name?.toLowerCase().includes(userSearch.toLowerCase())
    );

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter((s) => s.status === 'active').length,
        monthly: subscriptions.filter((s) => s.plan === 'monthly').length,
        annual: subscriptions.filter((s) => s.plan === 'annual').length,
    };

    const getSelectedUserName = () => {
        const user = users.find(u => u.id === selectedUserId);
        return user ? `${user.full_name || 'Sans nom'} (${user.phone_number})` : '';
    };

    return (
        <div className="text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold">Abonnements</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Accorder Abonnement Gratuit</span>
                    <span className="sm:hidden">Gratuit</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Total</h3>
                    <p className="text-xl md:text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Actifs</h3>
                    <p className="text-xl md:text-3xl font-bold text-green-500">{stats.active}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Mensuels</h3>
                    <p className="text-xl md:text-3xl font-bold text-blue-500">{stats.monthly}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Annuels</h3>
                    <p className="text-xl md:text-3xl font-bold text-yellow-500">{stats.annual}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm md:text-base"
                />
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div className="flex gap-2 min-w-max sm:min-w-0">
                        {['all', 'active', 'expired', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 md:px-4 py-2 rounded-lg transition text-sm ${filter === status
                                    ? 'bg-yellow-500 text-black font-bold'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : status === 'expired' ? 'Expirés' : 'Annulés'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table - Scrollable on mobile */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : filteredSubscriptions.length === 0 ? (
                <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-base md:text-lg">Aucun abonnement trouvé</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Utilisateur</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Plan</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Statut</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Montant</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Expiration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-700 transition">
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <div className="text-sm md:text-base">{sub.user?.full_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-400">{sub.user?.phone_number}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${sub.plan === 'annual' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'
                                                }`}>
                                                {sub.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-500 text-white' :
                                                sub.status === 'expired' ? 'bg-red-500 text-white' :
                                                    'bg-gray-500 text-white'
                                                }`}>
                                                {sub.status === 'active' ? 'Actif' : sub.status === 'expired' ? 'Expiré' : 'Annulé'}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold">
                                            {sub.amount === 0 ? (
                                                <span className="text-green-400">Gratuit</span>
                                            ) : (
                                                `${sub.amount.toLocaleString()} F`
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-gray-400 text-sm">
                                            {new Date(sub.end_date).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-5 md:p-8 w-full max-w-lg border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">Accorder Abonnement</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUserId('');
                                    setUserSearch('');
                                }}
                                className="text-gray-400 hover:text-white text-2xl p-1"
                            >
                                ×
                            </button>
                        </div>

                        {/* User Search */}
                        <div className="mb-5 md:mb-6">
                            <label className="block text-gray-300 mb-2 font-semibold text-sm md:text-base">
                                Sélectionner un utilisateur
                            </label>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 text-sm md:text-base"
                            />
                            {selectedUserId && (
                                <div className="bg-green-900 border border-green-600 rounded-lg p-3 mb-2 flex justify-between items-center">
                                    <span className="text-green-300 text-sm">{getSelectedUserName()}</span>
                                    <button
                                        onClick={() => setSelectedUserId('')}
                                        className="text-green-300 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            {userSearch && !selectedUserId && (
                                <div className="max-h-40 md:max-h-48 overflow-y-auto bg-gray-700 rounded-lg border border-gray-600">
                                    {filteredUsers.length === 0 ? (
                                        <p className="p-3 text-gray-400 text-sm">Aucun utilisateur trouvé</p>
                                    ) : (
                                        filteredUsers.slice(0, 10).map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => {
                                                    setSelectedUserId(user.id);
                                                    setUserSearch('');
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-600 border-b border-gray-600 last:border-b-0 transition text-sm"
                                            >
                                                <span className="font-semibold">{user.full_name || 'Sans nom'}</span>
                                                <span className="text-gray-400 ml-2">{user.phone_number}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Plan Selection */}
                        <div className="mb-6 md:mb-8">
                            <label className="block text-gray-300 mb-3 font-semibold text-sm md:text-base">
                                Type d'abonnement
                            </label>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <button
                                    onClick={() => setSelectedPlan('monthly')}
                                    className={`p-3 md:p-4 rounded-lg border-2 transition ${selectedPlan === 'monthly'
                                            ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                                            : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="text-base md:text-lg font-bold">Mensuel</div>
                                    <div className="text-gray-400 text-xs md:text-sm">30 jours</div>
                                </button>
                                <button
                                    onClick={() => setSelectedPlan('annual')}
                                    className={`p-3 md:p-4 rounded-lg border-2 transition ${selectedPlan === 'annual'
                                            ? 'border-yellow-500 bg-yellow-900 bg-opacity-30'
                                            : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="text-base md:text-lg font-bold">Annuel</div>
                                    <div className="text-gray-400 text-xs md:text-sm">1 an</div>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 md:gap-4">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUserId('');
                                    setUserSearch('');
                                }}
                                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition text-sm md:text-base"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleGrantFreeSubscription}
                                disabled={!selectedUserId || grantingSubscription}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition text-sm md:text-base ${!selectedUserId || grantingSubscription
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                {grantingSubscription ? 'Attribution...' : 'Accorder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
