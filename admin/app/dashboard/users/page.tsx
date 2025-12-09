'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir bloquer cet utilisateur ?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(
                `https://bonimusik-app-mobile.onrender.com/api/users/${userId}/block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
            alert('Utilisateur bloqué avec succès');
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Erreur lors du blocage');
        }
    };

    const filteredUsers = users.filter((user: any) =>
        user.phone_number.includes(searchTerm) || user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold">Utilisateurs</h1>
                <button
                    onClick={() => router.push('/dashboard/users/new')}
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:px-6 rounded-lg transition text-sm md:text-base"
                >
                    + Nouvel Utilisateur
                </button>
            </div>

            <div className="mb-4 md:mb-6">
                <input
                    type="text"
                    placeholder="Rechercher par téléphone ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm md:text-base"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-base md:text-lg">Aucun utilisateur trouvé</p>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredUsers.map((user: any) => (
                            <div key={user.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold">{user.full_name || 'N/A'}</h3>
                                        <p className="text-gray-400 text-sm">{user.phone_number}</p>
                                    </div>
                                    <button
                                        onClick={() => handleBlockUser(user.id)}
                                        className="text-red-500 hover:text-red-400 text-sm font-semibold bg-red-900/30 px-3 py-1 rounded"
                                    >
                                        Bloquer
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nom</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Téléphone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Inscription</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-700 transition">
                                        <td className="px-6 py-4">{user.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.phone_number}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleBlockUser(user.id)}
                                                className="text-red-500 hover:text-red-400 font-semibold"
                                            >
                                                Bloquer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
