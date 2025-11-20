import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Info, Edit, LogOut, Camera } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.location.href = createPageUrl('Landing');
      return;
    }
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // Mantém hasSeenOnboarding para não mostrar slides novamente
    window.location.href = createPageUrl('ChooseType');
  };

  if (!currentUser) return null;

  const isWoman = currentUser.userType === 'woman';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-64 bg-gradient-to-br from-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="px-4 -mt-20 relative z-10">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-200 mb-4">
                {currentUser.photo ? (
                  <img
                    src={currentUser.photo}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {currentUser.name}, {currentUser.age}
              </h1>
              <div className="flex items-center gap-1 text-slate-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.city}, {currentUser.state}</span>
              </div>
              <Badge className={`${isWoman ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'} border-0`}>
                {isWoman ? 'Busco apoio' : 'Ofereço apoio'}
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="px-4 space-y-4 mt-4">
          {isWoman ? (
            <>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Situação Atual</div>
                    <div className="text-sm text-slate-900">{currentUser.situation}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Necessidade Principal</div>
                    <div className="text-sm text-slate-900">{currentUser.needs}</div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Profissão</div>
                    <div className="text-sm text-slate-900">{currentUser.occupation}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Capacidade de Apoio</div>
                    <div className="text-sm text-slate-900">{currentUser.financial_capacity}</div>
                  </div>
                </div>
              </Card>
            </>
          )}

          <Card className="p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">O que busco</div>
            <p className="text-sm text-slate-700 leading-relaxed">{currentUser.looking_for}</p>
          </Card>

          {currentUser.about && (
            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sobre mim</div>
              <p className="text-sm text-slate-700 leading-relaxed">{currentUser.about}</p>
            </Card>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <Button
              variant="outline"
              className="flex-1 h-12"
              disabled
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          <div className="text-center text-xs text-slate-500 pb-4">
            <p>Versão 1.0.0 • NoJob</p>
            <p className="mt-1">Uma alternativa digna e respeitosa</p>
          </div>
        </div>
      </div>
      <BottomNav active="Profile" />
    </div>
  );
}