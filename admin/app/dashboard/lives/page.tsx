'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LivesPage() {
    const [tiktokUrl, setTiktokUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [tiktokActive, setTiktokActive] = useState(false);
    const [facebookActive, setFacebookActive] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchLiveLinks();
    }, []);

    const fetchLiveLinks = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('https://bonimusik-app-mobile.onrender.com/api/lives', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const tiktok = response.data.find((l: any) => l.platform === 'tiktok');
            const facebook = response.data.find((l: any) => l.platform === 'facebook');

            if (tiktok) {
                setTiktokUrl(tiktok.url || '');
                setTiktokActive(tiktok.is_active);
            }
            if (facebook) {
                setFacebookUrl(facebook.url || '');
                setFacebookActive(facebook.is_active);
            }
        } catch (error) {
            console.error('Error fetching live links:', error);
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(
                'https://bonimusik-app-mobile.onrender.com/api/lives',
                {
                    tiktok: { url: tiktokUrl, is_active: tiktokActive },
                    facebook: { url: facebookUrl, is_active: facebookActive },
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Liens sauvegardés avec succès !');
        } catch (error) {
            console.error('Error saving live links:', error);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) {
            alert('Veuillez entrer un message');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            await axios.post(
                'https://bonimusik-app-mobile.onrender.com/api/notifications/send',
                { message: notificationMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Notification envoyée avec succès !');
            setNotificationMessage('');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Erreur lors de l\'envoi de la notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white">
            <h1 className="text-4xl font-bold mb-8">Gestion des Lives</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* TikTok Live */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📱</span>
                        <h2 className="text-2xl font-bold">TikTok Live</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL du Live TikTok
                            </label>
                            <input
                                type="url"
                                value={tiktokUrl}
                                onChange={(e) => setTiktokUrl(e.target.value)}
                                placeholder="https://www.tiktok.com/@bonismusic/live"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="tiktok-active"
                                checked={tiktokActive}
                                onChange={(e) => setTiktokActive(e.target.checked)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600"
                            />
                            <label htmlFor="tiktok-active" className="text-gray-300">
                                Activer le live TikTok dans l'app
                            </label>
                        </div>
                    </div>
                </div>

                {/* Facebook Live */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📘</span>
                        <h2 className="text-2xl font-bold">Facebook Live</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL du Live Facebook
                            </label>
                            <input
                                type="url"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                placeholder="https://www.facebook.com/bonismusic/live"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="facebook-active"
                                checked={facebookActive}
                                onChange={(e) => setFacebookActive(e.target.checked)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600"
                            />
                            <label htmlFor="facebook-active" className="text-gray-300">
                                Activer le live Facebook dans l'app
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mb-8">
                <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition disabled:opacity-50"
                >
                    {saveLoading ? 'Sauvegarde...' : 'Sauvegarder les Liens'}
                </button>
            </div>

            {/* Push Notifications */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🔔</span>
                    <h2 className="text-2xl font-bold">Notifications Push</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Message de notification
                        </label>
                        <textarea
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            placeholder="Ex: Nouveau live sur TikTok maintenant ! 🎵"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <button
                        onClick={handleSendNotification}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Envoi...' : 'Envoyer à tous les abonnés'}
                    </button>

                    <p className="text-gray-400 text-sm">
                        💡 La notification sera envoyée à tous les utilisateurs ayant activé les notifications push.
                    </p>
                </div>
            </div>
        </div>
    );
}
