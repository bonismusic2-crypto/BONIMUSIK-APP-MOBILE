'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { use } from 'react';

export default function EditTeachingPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'audio',
        category: 'enseignement'
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [currentThumbnail, setCurrentThumbnail] = useState('');

    useEffect(() => {
        fetchTeaching();
    }, []);

    const fetchTeaching = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get(`https://bonimusik-app-mobile.onrender.com/api/teachings/${resolvedParams.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const teaching = response.data;
            setFormData({
                title: teaching.title,
                description: teaching.description || '',
                type: teaching.type,
                category: teaching.category || 'enseignement'
            });
            setCurrentThumbnail(teaching.thumbnail_url);
        } catch (error) {
            console.error('Error fetching teaching:', error);
            alert('Erreur lors du chargement de l\'enseignement');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'file') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'thumbnail') setThumbnail(e.target.files[0]);
            else setFile(e.target.files[0]);
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
            data.append('type', formData.type);
            data.append('category', formData.category);

            if (thumbnail) data.append('thumbnail', thumbnail);
            if (file) data.append('file', file);

            await axios.put(`https://bonimusik-app-mobile.onrender.com/api/teachings/${resolvedParams.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            router.push('/dashboard/teachings');
        } catch (error: any) {
            console.error('Error updating teaching:', error);
            alert('Erreur lors de la modification de l\'enseignement');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-12">Chargement...</div>;
    }

    return (
        <div className="text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Modifier l'Enseignement</h1>

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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Type de contenu</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="audio">Audio</option>
                            <option value="video">Vidéo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Catégorie</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="enseignement">Enseignement</option>
                            <option value="predication">Prédication</option>
                            <option value="temoignage">Témoignage</option>
                        </select>
                    </div>
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
                            <img src={currentThumbnail} alt="Current thumbnail" className="w-32 h-32 object-cover rounded" />
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
                    <label className="block text-gray-400 mb-2">Fichier Media (Optionnel - Remplacer)</label>
                    <input
                        type="file"
                        accept={formData.type === 'audio' ? 'audio/*' : 'video/*'}
                        onChange={(e) => handleFileChange(e, 'file')}
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
