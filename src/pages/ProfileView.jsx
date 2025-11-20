import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Info, Heart, X as XIcon, Gift } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    
    if (!user) {
      window.location.href = createPageUrl('Home');
      return;
    }
    
    setCurrentUser(user);
    
    // Mock data - em produção viria do backend
    const mockProfiles = {
      woman: [
        {
          id: 1,
          name: 'Marina',
          age: 24,
          city: 'São Paulo',
          state: 'SP',
          height: '165',
          photos: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
          ],
          situation: 'Desempregada',
          needs: 'Moradia/Aluguel',
          looking_for: 'Busco alguém que possa me ajudar a sair dessa situação difícil. Quero construir algo verdadeiro com respeito e carinho.',
          about: 'Amo ler, cozinhar e sonho em voltar a estudar. Sou uma pessoa carinhosa e dedicada.',
          interests: ['Leitura', 'Cozinhar', 'Música', 'Natureza'],
          lifestyle: 'Tranquilo e caseiro',
          distance: 2.5
        },
        {
          id: 2,
          name: 'Juliana',
          age: 28,
          city: 'São Paulo',
          state: 'SP',
          height: '168',
          photos: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
          ],
          situation: 'Mãe solo',
          needs: 'Cuidado com filhos',
          looking_for: 'Mãe de duas crianças buscando apoio para recomeçar. Quero um relacionamento sério.',
          about: 'Adoro estar com meus filhos, fazer artesanato e caminhar ao ar livre.',
          interests: ['Artesanato', 'Natureza', 'Cozinhar'],
          lifestyle: 'Equilibrado',
          distance: 5.1
        }
      ],
      man: [
        {
          id: 4,
          name: 'Ricardo',
          age: 35,
          city: 'São Paulo',
          state: 'SP',
          height: '178',
          photos: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
          ],
          occupation: 'Empresário',
          financial_capacity: 'Apoio confortável (R$ 3.000-5.000/mês)',
          looking_for: 'Busco uma companhia verdadeira para construir algo sério juntos.',
          about: 'Gosto de viajar, boa comida e momentos tranquilos em casa.',
          interests: ['Viajar', 'Cinema', 'Esportes'],
          lifestyle: 'Ativo e energético',
          distance: 3.2
        }
      ]
    };
    
    const allProfiles = [...mockProfiles.woman, ...mockProfiles.man];
    const foundProfile = allProfiles.find(p => p.id == profileId);
    
    if (foundProfile) {
      setProfile(foundProfile);
    }
  }, []);

  if (!currentUser || !profile) return null;

  const isWoman = !profile.occupation;
  const photos = profile.photos || [profile.photo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-slate-900">{profile.name}</h1>
          </div>
        </div>

        {/* Photos */}
        <div className="relative">
          <div className="aspect-[3/4] bg-slate-200 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex]}
                alt={profile.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {/* Photo indicators */}
            <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="absolute inset-0 flex">
              <button
                onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                className="flex-1"
                disabled={currentPhotoIndex === 0}
              />
              <button
                onClick={() => setCurrentPhotoIndex(Math.min(photos.length - 1, currentPhotoIndex + 1))}
                className="flex-1"
                disabled={currentPhotoIndex === photos.length - 1}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Basic info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <span className="text-2xl">{profile.age}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}, {profile.state}</span>
                </div>
                {profile.height && (
                  <span>• {profile.height}cm</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key info */}
          {isWoman ? (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Situação</div>
                    <div className="text-sm font-medium text-slate-900">{profile.situation}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Necessidade</div>
                    <div className="text-sm font-medium text-slate-900">{profile.needs}</div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Profissão</div>
                    <div className="text-sm font-medium text-slate-900">{profile.occupation}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Apoio</div>
                    <div className="text-xs font-medium text-slate-900">{profile.financial_capacity}</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Looking for */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">O que busca</h3>
            <p className="text-slate-700 leading-relaxed">{profile.looking_for}</p>
          </Card>

          {/* About */}
          {profile.about && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Sobre</h3>
              <p className="text-slate-700 leading-relaxed">{profile.about}</p>
            </Card>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Interesses</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className={`${isWoman ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Lifestyle */}
          {profile.lifestyle && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Estilo de Vida</h3>
              <p className="text-slate-700">{profile.lifestyle}</p>
            </Card>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pb-8">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 border-2"
                onClick={() => window.history.back()}
              >
                <XIcon className="w-5 h-5 mr-2" />
                Voltar
              </Button>
              <Button
                size="lg"
                className={`flex-1 h-14 ${
                  isWoman
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                    : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
                } text-white`}
                onClick={() => {
                  // Add to likes logic
                  const user = JSON.parse(localStorage.getItem('currentUser'));
                  user.likes = user.likes || [];
                  if (!user.likes.includes(profile.id)) {
                    user.likes.push(profile.id);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                  }
                  window.history.back();
                }}
              >
                <Heart className="w-5 h-5 mr-2" fill="white" />
                Curtir
              </Button>
            </div>
            
            {isWoman && currentUser.userType === 'man' && (
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold"
                onClick={() => window.location.href = createPageUrl('RoseCheckout') + '?profileId=' + profile.id}
              >
                <Gift className="w-5 h-5 mr-2" />
                Enviar uma Rosa 🌹
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}