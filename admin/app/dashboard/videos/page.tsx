'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function VideosPage() {
    const router = useRouter();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchVideos();
    }, [filter]);

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/videos', {
                headers: { Authorization: `Bearer ${token}` },
                params: filter !== 'all' ? { category: filter } : {},
            });
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`https://bonimusik-app-mobile.onrender.com/api/videos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVideos(videos.filter((v: any) => v.id !== id));
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Vidéos</h1>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition" onClick={() => router.push('/dashboard/videos/new')}>
                    + Nouvelle Vidéo
                </button>
            </div>

            <div className="flex gap-4 mb-6 flex-wrap">
                {['all', 'clip', 'concert', 'interview', 'predication', 'rediffusion_live'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-lg transition ${filter === category
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {category === 'all' ? 'Tous' : category === 'rediffusion_live' ? 'Rediffusion Live' : category === 'predication' ? 'Prédication' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-lg mb-4">Aucune vidéo pour le moment</p>
                    <p className="text-gray-500">Cliquez sur "Nouvelle Vidéo" pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video: any) => (
                        <div key={video.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-500 transition group">
                            {video.thumbnail_url && (
                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">{video.category}</span>
                                <h3 className="text-xl font-bold mt-2 mb-2">{video.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{video.views} vues</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/videos/${video.id}/edit`)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm transition"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, video.id)}
                                        className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-200 py-2 rounded text-sm transition"
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
