'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { downloadFile } from '@/app/utils/downloadFile';


export default function NewAlbumPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        year: new Date().getFullYear().toString(),
        description: ''
    });
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('artist', formData.artist);
            data.append('year', formData.year);
            data.append('description', formData.description);
            if (file) {
                data.append('file', file);
            }

            const response = await axios.post('https://bonimusik-app-mobile.onrender.com/api/albums', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Download the file locally if it was uploaded
            if (file) {
                downloadFile(file, `album_cover_${formData.title}_${file.name}`);
            }

            router.push(`/dashboard/albums/${response.data.id}`);
        } catch (error: any) {
            console.error('Error creating album:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de l\'album';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Nouvel Album</h1>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg border border-gray-700 space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2">Titre de l'album</label>
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
                    <label className="block text-gray-400 mb-2">Artiste</label>
                    <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Année de sortie</label>
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
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
                    <label className="block text-gray-400 mb-2">Pochette de l'album (optionnel)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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
                        {loading ? 'Création...' : 'Créer l\'album'}
                    </button>
                </div>
            </form>
        </div>
    );
}
