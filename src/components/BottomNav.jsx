import React from 'react';
import { Home, Heart, MessageCircle, User } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function BottomNav({ active }) {
  const navItems = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'Curtidas', icon: Heart, page: 'Likes' },
    { name: 'Matches', icon: MessageCircle, page: 'Matches' },
    { name: 'Perfil', icon: User, page: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 pb-safe z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.page;
          
          return (
            <a
              key={item.name}
              href={createPageUrl(item.page)}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
              >
                <div className={`relative ${isActive ? 'text-purple-600' : 'text-slate-400'}`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-purple-600 font-semibold' : 'text-slate-400'}`}>
                  {item.name}
                </span>
              </motion.div>
            </a>
          );
        })}
      </div>
    </div>
  );
}