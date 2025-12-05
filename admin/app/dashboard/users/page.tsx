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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => router.push('/dashboard/users/new')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition"
                >
                    + Nouvel Utilisateur
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher par téléphone ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
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
            )}
        </div>
    );
}
