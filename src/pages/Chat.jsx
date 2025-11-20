import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Send, Image as ImageIcon, MoreVertical, Flag, Shield, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function Chat() {
  const { currentUser } = useAuth();
  const [matchUser, setMatchUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchId, setMatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supportData, setSupportData] = useState(null);
  const [chatBlocked, setChatBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('matchId');

    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }

    if (id) {
      setMatchId(id);
      loadChat(id);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async (id) => {
    try {
      setLoading(true);

      // Get match details
      const matchesResponse = await mockAPI.matching.getMatches(currentUser.id);
      if (matchesResponse.success) {
        const match = matchesResponse.matches.find(m => m.id === id);
        if (match) {
          // Get the other user's profile
          const otherUserId = match.userId === currentUser.id ? match.matchedUserId : match.userId;
          const profileResponse = await mockAPI.user.getProfile(otherUserId);

          if (profileResponse.success) {
            setMatchUser(profileResponse.user);
          }
        }
      }

      // Load messages
      const messagesResponse = await mockAPI.chat.getMessages(id);
      if (messagesResponse.success) {
        setMessages(messagesResponse.messages);
      }

      // Check monthly support (only for men)
      if (currentUser.userType === 'man') {
        const supportResponse = await mockAPI.support.getSupport(currentUser.id, id);
        if (supportResponse.success && supportResponse.support) {
          setSupportData(supportResponse.support);
          setChatBlocked(false);
        } else {
          setChatBlocked(true);
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !matchId) return;

    try {
      const response = await mockAPI.chat.sendMessage(matchId, currentUser.id, newMessage);

      if (response.success) {
        setMessages([...messages, response.message]);
        setNewMessage('');

        // Analyze message for safety
        const analysisResponse = await mockAPI.moderation.analyzeMessage(newMessage);
        if (analysisResponse.flagged) {
          console.warn('Message flagged:', analysisResponse.reasons);

          // Show warning to sender
          const warningMessage = `⚠️ AVISO DE SEGURANÇA\n\nSua mensagem foi sinalizada por conter: ${analysisResponse.reasons.join(', ')}.\n\nLembre-se das regras da plataforma. Violações podem resultar em banimento.`;

          setTimeout(() => {
            if (confirm(warningMessage + '\n\nDeseja revisar sua mensagem?')) {
              // User can edit their message
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (!matchUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = createPageUrl('Matches')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <button
            onClick={() => window.location.href = createPageUrl('ProfileView') + '?id=' + matchUser.id}
            className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
              {matchUser.photos?.[0] ? (
                <img src={matchUser.photos[0]} alt={matchUser.name} className="w-full h-full object-cover" />
              ) : matchUser.photo ? (
                <img src={matchUser.photo} alt={matchUser.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="text-left">
              <h2 className="font-bold text-slate-900">{matchUser.name}</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => window.location.href = createPageUrl('Report') + '?userId=' + matchUser.id}
                className="text-red-600 cursor-pointer"
              >
                <Flag className="w-4 h-4 mr-2" />
                Denunciar Usuário
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Shield className="w-4 h-4 mr-2" />
                Bloquear Usuário
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">É um Match! 🎉</h3>
              <p className="text-slate-600">Comece a conversa enviando uma mensagem</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.senderId === currentUser.id;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMine
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${isMine ? 'text-purple-100' : 'text-slate-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 sticky bottom-0">
        <div className="max-w-md mx-auto">
          {chatBlocked ? (
            /* Blocked Chat - Require Monthly Support */
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Chat Bloqueado
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Para iniciar a conversa, é necessário configurar o apoio mensal.
                  Isso garante a segurança e o compromisso de ambas as partes.
                </p>
                <Button
                  onClick={() => window.location.href = createPageUrl('MonthlySupport') + '?matchId=' + matchId}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Configurar Apoio Mensal
                </Button>
              </div>
            </Card>
          ) : (
            /* Normal Chat Input */
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </Button>

              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite uma mensagem..."
                className="flex-1 h-12 rounded-full"
              />

              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}