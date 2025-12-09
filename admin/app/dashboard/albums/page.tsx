'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AlbumsPage() {
    const router = useRouter();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/albums', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAlbums(response.data);
        } catch (error) {
            console.error('Error fetching albums:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`https://bonimusik-app-mobile.onrender.com/api/albums/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAlbums(albums.filter((a: any) => a.id !== id));
        } catch (error) {
            console.error('Error deleting album:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold">Albums</h1>
                <button
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:px-6 rounded-lg transition text-sm md:text-base"
                    onClick={() => router.push('/dashboard/albums/new')}
                >
                    + Nouvel Album
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Chargement...</p>
                </div>
            ) : albums.length === 0 ? (
                <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400 text-base md:text-lg mb-4">Aucun album pour le moment</p>
                    <p className="text-gray-500 text-sm md:text-base">Cliquez sur "Nouvel Album" pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {albums.map((album: any) => (
                        <div
                            key={album.id}
                            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-500 transition cursor-pointer group"
                            onClick={() => router.push(`/dashboard/albums/${album.id}`)}
                        >
                            {album.cover_url && (
                                <img src={album.cover_url} alt={album.title} className="w-full h-40 md:h-48 object-cover" />
                            )}
                            <div className="p-3 md:p-4">
                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 truncate">{album.title}</h3>
                                <p className="text-gray-400 text-sm mb-3 md:mb-4">{album.year}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/dashboard/albums/${album.id}/edit`);
                                        }}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-xs md:text-sm transition"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, album.id)}
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
