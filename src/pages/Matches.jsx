import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Heart } from 'lucide-react';
import { createPageUrl } from '../utils';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';

export default function Matches() {
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    setCurrentUser(user);
    setMatches(user.matches || []);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Matches</h1>

        {matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-purple-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Nenhum match ainda</h2>
            <p className="text-slate-600 text-center">
              Continue curtindo perfis para fazer matches!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = createPageUrl('Chat') + '?matchId=' + match.id}
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={match.photos?.[0] || match.photo}
                        alt={match.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{match.name}</h3>
                        <span className="text-slate-600">{match.age}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{match.city}, {match.state}</span>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        É um match!
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="Matches" />
    </div>
  );
}