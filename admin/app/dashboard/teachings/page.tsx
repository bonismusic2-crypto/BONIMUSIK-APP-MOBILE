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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Enseignements & Prédications</h1>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition" onClick={() => router.push('/dashboard/teachings/new')}>
                    + Nouvel Enseignement
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : teachings.length === 0 ? (
                <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-lg mb-4">Aucun enseignement pour le moment</p>
                    <p className="text-gray-500">Cliquez sur "Nouvel Enseignement" pour commencer</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {teachings.map((teaching: any) => (
                        <div key={teaching.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition flex items-center gap-6">
                            {teaching.thumbnail_url && (
                                <img src={teaching.thumbnail_url} alt={teaching.title} className="w-32 h-32 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">{teaching.type}</span>
                                    <h3 className="text-xl font-bold">{teaching.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2">{teaching.description}</p>
                            </div>
                            <div className="text-right flex gap-4">
                                <button
                                    onClick={() => router.push(`/dashboard/teachings/${teaching.id}/edit`)}
                                    className="text-yellow-500 hover:text-yellow-400"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, teaching.id)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
