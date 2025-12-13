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
                <div className="flex items-center gap-4">
                    <img src="/icon.png" alt="BONI MUSIK Logo" className="w-12 h-12 object-contain rounded-xl shadow-lg border border-yellow-500/20" />
                    <span className="text-2xl font-bold text-yellow-500 tracking-wider">BONI MUSIK</span>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto mt-[-40px]">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <span className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        Lancement Officiel • Concert Live
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                        L'Application <br />
                        <span className="text-yellow-500">BONI MUSIK</span>
                    </h1>

                    <p className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Accédez à l'univers complet du <strong>Chantre Boniface</strong>. <br />
                        Louange, Adoration, Enseignements et Vidéos exclusives, directement sur votre mobile.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full"
                >
                    <FeatureCard
                        icon="🎵"
                        title="Discographie Complète"
                        desc="Retrouvez tous les albums et singles en haute qualité audio."
                    />
                    <FeatureCard
                        icon="📹"
                        title="Vidéos & Lives"
                        desc="Clips officiels, concerts et moments de culte inédits."
                    />
                    <FeatureCard
                        icon="📖"
                        title="Enseignements"
                        desc="Des messages inspirants pour nourrir votre foi chaque jour."
                    />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col gap-6 w-full md:w-auto items-center"
                >
                    <a
                        href="/bonimusic.apk"
                        download="bonimusic.apk"
                        className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-extrabold text-xl px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all flex items-center justify-center gap-4 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M3.5 17.5h17v2.5h-17v-2.5zm8-13l-6 8h4v5h4v-5h4l-6-8z" /></svg>
                        <span>TÉLÉCHARGER L'APPLICATION</span>
                    </a>

                    <div className="flex flex-col items-center gap-2 text-gray-500 text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.68-.06-.83.21l-1.88 3.24c-1.12-.47-2.33-.74-3.6-.74-1.29 0-2.52.27-3.65.75L7.33 5.67c-.15-.27-.54-.36-.83-.21-.29.15-.41.53-.25.84l1.83 3.17C5.39 11.23 3.5 13.9 3.5 17h16c0-3.09-1.89-5.77-4.9-7.52zM8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                            <span>Compatible Android (Samsung, Tecno, Infinix, Huawei...)</span>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-500/60">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            <span>Version iPhone (iOS) en cours de validation</span>
                        </div>
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
