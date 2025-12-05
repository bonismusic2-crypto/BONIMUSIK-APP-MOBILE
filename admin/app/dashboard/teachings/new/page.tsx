'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NewTeachingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Enseignement',
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMediaFile(e.target.files[0]);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('type', formData.type);
            if (mediaFile) {
                data.append('file', mediaFile);
            }
            if (thumbnailFile) {
                data.append('thumbnail', thumbnailFile);
            }

            await axios.post('https://bonimusik-app-mobile.onrender.com/api/teachings', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            router.push('/dashboard/teachings');
        } catch (error) {
            console.error('Error creating teaching:', error);
            alert('Erreur lors de la création de l\'enseignement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Nouvel Enseignement</h1>

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
                    <label className="block text-gray-400 mb-2">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="Enseignement">Enseignement</option>
                        <option value="Prédication">Prédication</option>
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
                    <label className="block text-gray-400 mb-2">Miniature (Image)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Fichier Audio/Vidéo</label>
                    <input
                        type="file"
                        accept="audio/*,video/*"
                        onChange={handleMediaChange}
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
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
