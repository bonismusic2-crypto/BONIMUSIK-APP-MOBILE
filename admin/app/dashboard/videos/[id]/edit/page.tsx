'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { use } from 'react';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'clip',
        artist: ''
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [currentThumbnail, setCurrentThumbnail] = useState('');

    useEffect(() => {
        fetchVideo();
    }, []);

    const fetchVideo = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get(`https://bonimusik-app-mobile.onrender.com/api/videos/${resolvedParams.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const video = response.data;
            setFormData({
                title: video.title,
                description: video.description || '',
                category: video.category,
                artist: video.artist || ''
            });
            setCurrentThumbnail(video.thumbnail_url);
        } catch (error) {
            console.error('Error fetching video:', error);
            alert('Erreur lors du chargement de la vidéo');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'video') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'thumbnail') setThumbnail(e.target.files[0]);
            else setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('admin_token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('artist', formData.artist);

            if (thumbnail) data.append('thumbnail', thumbnail);
            if (videoFile) data.append('video', videoFile);

            await axios.put(`https://bonimusik-app-mobile.onrender.com/api/videos/${resolvedParams.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            router.push('/dashboard/videos');
        } catch (error: any) {
            console.error('Error updating video:', error);
            alert('Erreur lors de la modification de la vidéo');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-12">Chargement...</div>;
    }

    return (
        <div className="text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Modifier la Vidéo</h1>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg border border-gray-700 space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2">Titre</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Artiste (Optionnel)</label>
                    <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Catégorie</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="clip">Clip</option>
                        <option value="concert">Concert</option>
                        <option value="interview">Interview</option>
                        <option value="predication">Prédication</option>
                        <option value="rediffusion_live">Rediffusion Live</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Miniature (Optionnel)</label>
                    {currentThumbnail && !thumbnail && (
                        <div className="mb-4">
                            <img src={currentThumbnail} alt="Current thumbnail" className="w-32 h-18 object-cover rounded" />
                            <p className="text-xs text-gray-500 mt-1">Miniature actuelle</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Fichier Vidéo (Optionnel - Remplacer)</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
