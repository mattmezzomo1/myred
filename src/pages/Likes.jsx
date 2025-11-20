import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { MapPin, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';

const mockProfiles = {
  woman: [
    {
      id: 1,
      name: 'Marina',
      age: 24,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      id: 2,
      name: 'Juliana',
      age: 28,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
    }
  ],
  man: [
    {
      id: 4,
      name: 'Ricardo',
      age: 35,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      id: 5,
      name: 'Felipe',
      age: 42,
      city: 'São Paulo',
      state: 'SP',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    }
  ]
};

export default function Likes() {
  const [currentUser, setCurrentUser] = useState(null);
  const [likedProfiles, setLikedProfiles] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    setCurrentUser(user);
    
    const targetProfiles = user.userType === 'woman' ? mockProfiles.man : mockProfiles.woman;
    const liked = targetProfiles.filter(p => user.likes?.includes(p.id));
    setLikedProfiles(liked);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Curtidas</h1>

        {likedProfiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-pink-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Nenhuma curtida ainda</h2>
            <p className="text-slate-600 text-center">
              Comece a curtir perfis na tela inicial!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likedProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square relative">
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="font-bold text-base">{profile.name}</h3>
                        <span className="text-sm">{profile.age}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{profile.city}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="Likes" />
    </div>
  );
}