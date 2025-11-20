import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Heart, Shield, Users, Sparkles } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    icon: Heart,
    title: "Bem-vinda ao NoJob",
    description: "Uma plataforma que conecta mulheres que buscam estabilidade financeira com homens dispostos a oferecer suporte e construir relacionamentos genuínos.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Segurança e Respeito",
    description: "Todos os perfis são verificados. Priorizamos relacionamentos saudáveis baseados em respeito mútuo e transparência.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Users,
    title: "Conexões Reais",
    description: "Encontre pessoas compatíveis na sua região. Não é sobre sexo, é sobre apoio, companhia e construir algo significativo.",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: Sparkles,
    title: "Comece Sua Jornada",
    description: "Seja honesta sobre suas necessidades e expectativas. Aqui você encontrará pessoas que entendem e respeitam sua situação.",
    color: "from-fuchsia-500 to-pink-500"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const currentUser = localStorage.getItem('currentUser');

    // Se já viu onboarding E está logado, vai para Home
    if (hasSeenOnboarding && currentUser) {
      window.location.href = createPageUrl('Home');
    }
    // Se já viu onboarding mas NÃO está logado, vai para ChooseType
    else if (hasSeenOnboarding && !currentUser) {
      window.location.href = createPageUrl('ChooseType');
    }
  }, []);

  const nextSlide = () => {
    setDirection(1);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const prevSlide = () => {
    setDirection(-1);
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    window.location.href = createPageUrl('ChooseType');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 shadow-2xl`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </motion.div>

              <motion.h1 
                className="text-3xl font-bold text-slate-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {slide.title}
              </motion.h1>

              <motion.p 
                className="text-lg text-slate-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              onClick={prevSlide}
              className="flex-1 h-14 text-base border-2"
            >
              Voltar
            </Button>
          )}
          <Button
            onClick={nextSlide}
            className="flex-1 h-14 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
          >
            {currentSlide === slides.length - 1 ? 'Começar' : 'Próximo'}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {currentSlide === 0 && (
          <button
            onClick={handleFinish}
            className="w-full mt-4 text-slate-500 text-sm"
          >
            Pular introdução
          </button>
        )}
      </div>
    </div>
  );
}