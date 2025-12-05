'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [artistName, setArtistName] = useState('Boniface Aka');
    const [bio, setBio] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [facebook, setFacebook] = useState('');
    const [youtube, setYoutube] = useState('');
    const [instagram, setInstagram] = useState('');

    const [cinetpaySiteId, setCinetpaySiteId] = useState('');
    const [cinetpayApiKey, setCinetpayApiKey] = useState('');
    const [testMode, setTestMode] = useState(true);

    const handleSaveProfile = () => {
        alert('Profil sauvegardé !');
    };

    const handleSavePayment = () => {
        alert('Configuration paiement sauvegardée !');
    };

    return (
        <div className="text-white">
            <h1 className="text-4xl font-bold mb-8">Paramètres & Configuration</h1>

            <div className="space-y-8">
                {/* Artist Profile */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Profil Artiste</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nom de l'artiste
                            </label>
                            <input
                                type="text"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Biographie
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Présentez l'artiste..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    TikTok
                                </label>
                                <input
                                    type="url"
                                    value={tiktok}
                                    onChange={(e) => setTiktok(e.target.value)}
                                    placeholder="@bonismusic"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    placeholder="facebook.com/bonismusic"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    YouTube
                                </label>
                                <input
                                    type="url"
                                    value={youtube}
                                    onChange={(e) => setYoutube(e.target.value)}
                                    placeholder="youtube.com/@bonismusic"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    placeholder="@bonismusic"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition"
                        >
                            Sauvegarder le Profil
                        </button>
                    </div>
                </div>

                {/* Payment Configuration */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Configuration Paiements (CinetPay)</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Site ID
                            </label>
                            <input
                                type="text"
                                value={cinetpaySiteId}
                                onChange={(e) => setCinetpaySiteId(e.target.value)}
                                placeholder="Votre Site ID CinetPay"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                API Key
                            </label>
                            <input
                                type="password"
                                value={cinetpayApiKey}
                                onChange={(e) => setCinetpayApiKey(e.target.value)}
                                placeholder="Votre clé API CinetPay"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="test-mode"
                                checked={testMode}
                                onChange={(e) => setTestMode(e.target.checked)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600"
                            />
                            <label htmlFor="test-mode" className="text-gray-300">
                                Mode Test (Sandbox)
                            </label>
                        </div>

                        <button
                            onClick={handleSavePayment}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition"
                        >
                            Sauvegarder la Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
