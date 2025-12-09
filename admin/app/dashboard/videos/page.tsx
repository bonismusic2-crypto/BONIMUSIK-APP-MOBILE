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

    const categories = ['all', 'clip', 'concert', 'interview', 'predication', 'rediffusion_live'];
    const getCategoryLabel = (cat: string) => {
        const labels: Record<string, string> = {
            'all': 'Tous',
            'clip': 'Clip',
            'concert': 'Concert',
            'interview': 'Interview',
            'predication': 'Prédication',
            'rediffusion_live': 'Rediff. Live'
        };
        return labels[cat] || cat;
    };

    return (
        <div className="text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-4xl font-bold">Vidéos</h1>
                <button
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:px-6 rounded-lg transition text-sm md:text-base"
                    onClick={() => router.push('/dashboard/videos/new')}
                >
                    + Nouvelle Vidéo
                </button>
            </div>

            {/* Filter buttons - horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2 mb-4 md:mb-6 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 min-w-max md:flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap text-sm ${filter === category
                                ? 'bg-yellow-500 text-black font-bold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {getCategoryLabel(category)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-base md:text-lg mb-4">Aucune vidéo pour le moment</p>
                    <p className="text-gray-500 text-sm md:text-base">Cliquez sur "Nouvelle Vidéo" pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {videos.map((video: any) => (
                        <div key={video.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-500 transition group">
                            {video.thumbnail_url && (
                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-40 md:h-48 object-cover" />
                            )}
                            <div className="p-3 md:p-4">
                                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">{video.category}</span>
                                <h3 className="text-lg md:text-xl font-bold mt-2 mb-1 md:mb-2 truncate">{video.title}</h3>
                                <p className="text-gray-400 text-sm mb-3 md:mb-4">{video.views} vues</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/videos/${video.id}/edit`)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-xs md:text-sm transition"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, video.id)}
                                        className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-200 py-2 rounded text-xs md:text-sm transition"
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
