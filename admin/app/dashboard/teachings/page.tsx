'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TeachingsPage() {
    const router = useRouter();
    const [teachings, setTeachings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeachings();
    }, []);

    const fetchTeachings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/teachings', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeachings(response.data);
        } catch (error) {
            console.error('Error fetching teachings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignement ?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`https://bonimusik-app-mobile.onrender.com/api/teachings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeachings(teachings.filter((t: any) => t.id !== id));
        } catch (error) {
            console.error('Error deleting teaching:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold">Enseignements</h1>
                <button
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:px-6 rounded-lg transition text-sm md:text-base"
                    onClick={() => router.push('/dashboard/teachings/new')}
                >
                    + Nouvel Enseignement
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : teachings.length === 0 ? (
                <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-base md:text-lg mb-4">Aucun enseignement pour le moment</p>
                    <p className="text-gray-500 text-sm md:text-base">Cliquez sur "Nouvel Enseignement" pour commencer</p>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {teachings.map((teaching: any) => (
                        <div
                            key={teaching.id}
                            className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition"
                        >
                            {/* Mobile layout - stack vertical */}
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                {teaching.thumbnail_url && (
                                    <img
                                        src={teaching.thumbnail_url}
                                        alt={teaching.title}
                                        className="w-full h-40 md:w-32 md:h-32 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">{teaching.type}</span>
                                        <h3 className="text-lg md:text-xl font-bold truncate">{teaching.title}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2">{teaching.description}</p>
                                </div>
                                <div className="flex gap-3 md:flex-col md:gap-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/teachings/${teaching.id}/edit`)}
                                        className="flex-1 md:flex-none text-yellow-500 hover:text-yellow-400 bg-gray-700 md:bg-transparent px-4 py-2 md:p-0 rounded md:rounded-none text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, teaching.id)}
                                        className="flex-1 md:flex-none text-red-500 hover:text-red-400 bg-gray-700 md:bg-transparent px-4 py-2 md:p-0 rounded md:rounded-none text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
