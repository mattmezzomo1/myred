import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, Briefcase, DollarSign, Info, Gift } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNav from '../components/BottomNav';
import { createPageUrl } from '../utils';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

// Mock data
const mockProfiles = {
  woman: [
    {
      id: 1,
      name: 'Marina',
      age: 24,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      situation: 'Desempregada',
      needs: 'Moradia/Aluguel',
      looking_for: 'Busco alguém que possa me ajudar a sair dessa situação difícil. Quero construir algo verdadeiro.',
      about: 'Amo ler, cozinhar e sonho em voltar a estudar.',
      distance: 2.5
    },
    {
      id: 2,
      name: 'Juliana',
      age: 28,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      situation: 'Mãe solo',
      needs: 'Cuidado com filhos',
      looking_for: 'Mãe de duas crianças buscando apoio para recomeçar. Quero um relacionamento sério.',
      about: 'Adoro estar com meus filhos, fazer artesanato e caminhar ao ar livre.',
      distance: 5.1
    },
    {
      id: 3,
      name: 'Carolina',
      age: 22,
      city: 'Rio de Janeiro',
      state: 'RJ',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      situation: 'Estudante sem renda',
      needs: 'Estudos/Curso',
      looking_for: 'Preciso de ajuda para continuar meus estudos. Busco alguém especial.',
      about: 'Estudo design, amo arte e música. Sonho em ter minha própria marca.',
      distance: 180.3
    }
  ],
  man: [
    {
      id: 4,
      name: 'Ricardo',
      age: 35,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      occupation: 'Empresário',
      financial_capacity: 'Apoio confortável (R$ 3.000-5.000/mês)',
      looking_for: 'Busco uma companhia verdadeira para construir algo sério juntos.',
      about: 'Gosto de viajar, boa comida e momentos tranquilos em casa.',
      distance: 3.2
    },
    {
      id: 5,
      name: 'Felipe',
      age: 42,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      occupation: 'Executivo',
      financial_capacity: 'Apoio amplo (R$ 5.000+/mês)',
      looking_for: 'Quero ajudar alguém a ter uma vida melhor e construir um relacionamento genuíno.',
      about: 'Adoro esportes, cinema e conhecer novos lugares.',
      distance: 7.8
    },
    {
      id: 6,
      name: 'Marcos',
      age: 38,
      city: 'Campinas',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      occupation: 'Médico',
      financial_capacity: 'Apoio moderado (R$ 1.500-3.000/mês)',
      looking_for: 'Busco conexão verdadeira e alguém para compartilhar a vida.',
      about: 'Gosto de natureza, música clássica e boas conversas.',
      distance: 45.6
    }
  ]
};

export default function Home() {
  const { currentUser, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Espera o loading do useAuth terminar
    if (authLoading) return;

    if (!currentUser) {
      // Verifica se já viu o onboarding
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

      if (hasSeenOnboarding) {
        // Já viu onboarding, vai para escolher tipo de usuário
        window.location.href = createPageUrl('ChooseType');
      } else {
        // Nunca viu onboarding, mostra slides introdutórios
        window.location.href = createPageUrl('Onboarding');
      }
      return;
    }

    loadProfiles();
  }, [currentUser, authLoading]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const targetType = currentUser.userType === 'woman' ? 'man' : 'woman';
      const response = await mockAPI.user.getProfiles(targetType);

      if (response.success) {
        setProfiles(response.profiles);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;

    const likedProfile = profiles[currentIndex];

    try {
      const response = await mockAPI.matching.like(currentUser.id, likedProfile.id);

      if (response.success && response.match) {
        // Show match notification
        alert(`🎉 É um match! Você e ${likedProfile.name} deram match!`);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = () => {
    setCurrentIndex(currentIndex + 1);
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NoJob
            </h1>
          </div>
          <Card className="p-8 text-center">
            <p className="text-slate-600 mb-4">Não há mais perfis disponíveis no momento.</p>
            <Button onClick={() => setCurrentIndex(0)}>Recomeçar</Button>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NoJob
          </h1>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {currentUser.city}, {currentUser.state}
          </Badge>
        </div>

        {currentIndex >= profiles.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Não há mais perfis</h2>
            <p className="text-slate-600 text-center mb-6">
              Volte mais tarde para ver novos perfis
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl('Matches')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Ver Meus Matches
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <ProfileCard
              key={currentProfile.id}
              profile={currentProfile}
              userType={currentUser.userType}
              onLike={handleLike}
              onPass={handlePass}
            />
          </AnimatePresence>
        )}
      </div>
      <BottomNav active="Home" />
    </div>
  );
}

function ProfileCard({ profile, userType, onLike, onPass }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onLike();
      } else {
        onPass();
      }
    }
  };

  const openProfile = (e) => {
    e.stopPropagation();
    window.location.href = createPageUrl('ProfileView') + '?id=' + profile.id;
  };

  const handleRoseClick = (e) => {
    e.stopPropagation();
    window.location.href = createPageUrl('RoseCheckout') + '?profileId=' + profile.id;
  };

  const isWoman = userType === 'man';

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative"
    >
      <Card className="overflow-hidden shadow-2xl border-2">
        <div className="relative h-96 cursor-pointer" onClick={openProfile}>
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Info button */}
          <button
            onClick={openProfile}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Info className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <span className="text-2xl">{profile.age}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/90 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.city}, {profile.state}</span>
              <span className="ml-2 text-white/70">• {profile.distance} km</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-white">
          {isWoman ? (
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Situação</div>
                  <div className="text-sm text-slate-900">{profile.situation}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Necessidade</div>
                  <div className="text-sm text-slate-900">{profile.needs}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Profissão</div>
                  <div className="text-sm text-slate-900">{profile.occupation}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Capacidade de Apoio</div>
                  <div className="text-sm text-slate-900">{profile.financial_capacity}</div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">O que busca</div>
            <p className="text-sm text-slate-700 leading-relaxed">{profile.looking_for}</p>
          </div>

          {profile.about && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sobre</div>
              <p className="text-sm text-slate-700 leading-relaxed">{profile.about}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          onClick={onPass}
          size="lg"
          className="w-16 h-16 rounded-full bg-white hover:bg-slate-50 shadow-xl border-2 border-slate-200"
        >
          <X className="w-8 h-8 text-slate-500" strokeWidth={2.5} />
        </Button>
        <Button
          onClick={onLike}
          size="lg"
          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-xl border-0"
        >
          <Heart className="w-10 h-10 text-white" strokeWidth={2.5} fill="white" />
        </Button>
        {isWoman && (
          <Button
            onClick={handleRoseClick}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-xl border-0 relative"
          >
            <Gift className="w-8 h-8 text-white" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
              🌹
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}