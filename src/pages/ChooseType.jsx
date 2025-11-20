import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, HandHeart, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function ChooseType() {
  const handleChoice = (type) => {
    localStorage.setItem('userType', type);
    if (type === 'woman') {
      window.location.href = createPageUrl('RegisterWoman');
    } else {
      window.location.href = createPageUrl('RegisterMan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-slate-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Quem é você?
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Escolha o tipo de perfil para continuar
          </motion.p>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-300 group"
              onClick={() => handleChoice('woman')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Busco Apoio</h3>
                  <p className="text-sm text-slate-600">
                    Procuro estabilidade financeira e um relacionamento sério
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300 group"
              onClick={() => handleChoice('man')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HandHeart className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Ofereço Apoio</h3>
                  <p className="text-sm text-slate-600">
                    Quero ajudar e construir um relacionamento verdadeiro
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.p 
          className="text-center text-sm text-slate-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Todos os perfis passam por verificação
        </motion.p>
      </motion.div>
    </div>
  );
}