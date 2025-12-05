'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { downloadFile } from '@/app/utils/downloadFile';


export default function AlbumDetailPage() {
    const router = useRouter();
    const { id } = useParams(); // album id from route
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [trackForm, setTrackForm] = useState({ title: '', duration: '', track_number: '' });
    const [trackFile, setTrackFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchAlbum = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`https://bonimusik-app-mobile.onrender.com/api/albums/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAlbum(res.data);
        } catch (e) {
            console.error('Error fetching album', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAlbum();
    }, [id]);

    const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrackForm({ ...trackForm, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setTrackFile(e.target.files[0]);
    };

    const addTrack = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackFile) {
            alert('Veuillez sélectionner un fichier audio');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const token = localStorage.getItem('admin_token');
            const formData = new FormData();
            formData.append('file', trackFile);
            formData.append('title', trackForm.title);
            formData.append('duration', trackForm.duration);
            formData.append('track_number', trackForm.track_number);

            console.log('Uploading track:', trackForm.title, 'File size:', trackFile.size);

            const res = await axios.post(
                `https://bonimusik-app-mobile.onrender.com/api/albums/${id}/tracks`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 300000, // 5 minutes timeout for large files
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setUploadProgress(percentCompleted);
                        console.log('Upload progress:', percentCompleted + '%');
                    },
                }
            );

            console.log('Track uploaded successfully:', res.data);
            alert('Piste ajoutée avec succès !');

            // Reset form
            setTrackForm({ title: '', duration: '', track_number: '' });
            setTrackFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Refresh album data
            await fetchAlbum();
        } catch (error: any) {
            console.error('Error adding track:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'ajout de la piste';
            alert('Erreur: ' + errorMessage);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const deleteTrack = async (trackId: string) => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`https://bonimusik-app-mobile.onrender.com/api/albums/tracks/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAlbum();
        } catch (e) {
            console.error('Error deleting track', e);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-400">Chargement...</div>;
    if (!album) return <div className="text-center py-12 text-gray-400">Album introuvable</div>;

    return (
        <div className="text-white max-w-3xl mx-auto p-6">
            <button onClick={() => router.back()} className="mb-4 text-yellow-500 hover:underline">
                ← Retour
            </button>
            <h1 className="text-3xl font-bold mb-4">{album.title}</h1>
            {album.cover_url && (
                <img src={album.cover_url} alt={album.title} className="w-full h-64 object-cover rounded mb-4" />
            )}
            <p className="mb-2"><strong>Artiste :</strong> {album.artist}</p>
            <p className="mb-2"><strong>Année :</strong> {album.year}</p>
            <p className="mb-4"><strong>Description :</strong> {album.description}</p>

            <h2 className="text-2xl font-semibold mb-3">Pistes</h2>
            {album.tracks && album.tracks.length > 0 ? (
                <ul className="space-y-2 mb-6">
                    {album.tracks.map((track: any) => (
                        <li key={track.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                            <div>
                                <p className="font-medium">{track.title}</p>
                                <p className="text-sm text-gray-400">Durée: {track.duration}s | N°: {track.track_number}</p>
                            </div>
                            <button
                                onClick={() => deleteTrack(track.id)}
                                className="text-red-500 hover:text-red-400"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 mb-4">Aucune piste pour cet album.</p>
            )}

            <h3 className="text-xl font-semibold mb-2">Ajouter une piste</h3>
            <form onSubmit={addTrack} className="space-y-4 bg-gray-800 p-4 rounded border border-gray-700">
                <input
                    type="text"
                    name="title"
                    placeholder="Titre de la piste"
                    value={trackForm.title}
                    onChange={handleTrackChange}
                    required
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white disabled:opacity-50"
                />
                <input
                    type="number"
                    name="duration"
                    placeholder="Durée (en secondes)"
                    value={trackForm.duration}
                    onChange={handleTrackChange}
                    required
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white disabled:opacity-50"
                />
                <input
                    type="number"
                    name="track_number"
                    placeholder="Numéro de piste"
                    value={trackForm.track_number}
                    onChange={handleTrackChange}
                    required
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white disabled:opacity-50"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.ogg,.mp4,.mov,.avi,.mkv"
                    onChange={handleFileChange}
                    disabled={uploading}
                    required
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600 disabled:opacity-50"
                />
                {trackFile && (
                    <p className="text-sm text-yellow-500 mt-1">
                        Fichier sélectionné : {trackFile.name} ({(trackFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                )}
                {uploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                            className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <p className="text-sm text-yellow-500 mt-2 text-center">
                            Upload en cours... {uploadProgress}%
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Upload en cours...' : 'Ajouter la piste'}
                </button>
            </form>
        </div>
    );
}
