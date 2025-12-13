'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-yellow-900/20 to-transparent z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl z-0 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 w-full p-6 flex justify-between items-center max-w-6xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="BONI MUSIK" className="w-10 h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="text-xl font-bold text-yellow-500 tracking-wider">BONI MUSIK</span>
                </div>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Connexion Admin</Link>
            </header>

            {/* Hero Section */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto mt-[-40px]">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-6 inline-block">
                        Application Officielle
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        L'Adoration <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                            Au Creux de Votre Main
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Retrouvez tous les albums, vidéos exclusives et enseignements du Chantre Boniface dans une expérience mobile premium.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full"
                >
                    <FeatureCard icon="🎵" title="Musique Illimitée" desc="Écoutez tous les albums en haute qualité." />
                    <FeatureCard icon="🎬" title="Vidéos Exclusives" desc="Clips, concerts et lives inédits." />
                    <FeatureCard icon="📥" title="Mode Hors-Ligne" desc="Téléchargez pour écouter sans internet." />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col gap-4 w-full md:w-auto"
                >
                    <a
                        href="/bonimusic.apk"
                        download="bonimusic.apk"
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.5 17.5h17v2.5h-17v-2.5zm8-13l-6 8h4v5h4v-5h4l-6-8z" /></svg>
                        Télécharger pour Android (APK)
                    </a>
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.8-1.26 1.99-1.12 3.07 1.17.09 2.37-.73 3.11-1.57z" /></svg>
                        <span>Version iPhone bientôt disponible</span>
                    </div>
                </motion.div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full p-6 text-center text-gray-600 text-sm">
                <p>© {new Date().getFullYear()} BONI MUSIK. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-white font-bold mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    );
}
