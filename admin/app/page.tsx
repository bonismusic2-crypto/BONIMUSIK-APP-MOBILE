'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: "Bienvenue sur BONI MUSIK",
      subtitle: "Admin Dashboard",
      description: "Gérez votre plateforme de streaming musical chrétienne en toute simplicité.",
      icon: "🎵"
    },
    {
      title: "Gestion de Contenu",
      subtitle: "Albums, Vidéos & Enseignements",
      description: "Ajoutez et organisez facilement vos albums, vidéos et enseignements spirituels.",
      icon: "📚"
    },
    {
      title: "Suivi des Abonnements",
      subtitle: "Analytics & Revenus",
      description: "Suivez vos abonnés, analysez les performances et gérez les paiements FedaPay.",
      icon: "📊"
    },
    {
      title: "Prêt à commencer ?",
      subtitle: "Connectez-vous",
      description: "Accédez à votre tableau de bord et commencez à gérer votre contenu.",
      icon: "🚀"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      router.push('/login');
    }
  };

  const skipToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={skipToLogin}
          className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-medium"
        >
          Passer →
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 relative">
            <Image
              src="/icon.png"
              alt="BONI MUSIK"
              fill
              className="object-contain rounded-2xl shadow-2xl shadow-yellow-500/20"
              priority
            />
          </div>
          <div className="absolute -inset-4 bg-yellow-500/20 rounded-3xl blur-xl -z-10"></div>
        </div>

        {/* Slide content */}
        <div className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {slides[currentSlide].title}
          </h1>
          <h2 className="text-xl text-yellow-500 font-semibold mb-4">
            {slides[currentSlide].subtitle}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-lg">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-yellow-500 w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
                }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-12 flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={nextSlide}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/25"
          >
            {currentSlide === slides.length - 1 ? 'Se connecter' : 'Suivant'}
          </button>

          {currentSlide < slides.length - 1 && (
            <button
              onClick={skipToLogin}
              className="w-full bg-transparent border border-gray-600 hover:border-yellow-500 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200"
            >
              Aller à la connexion
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 text-sm">
        © 2024 BONI MUSIK. Tous droits réservés.
      </div>
    </div>
  );
}
