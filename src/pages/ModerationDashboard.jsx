import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  AlertTriangle,
  Ban,
  CheckCircle,
  Eye,
  Flag,
  MessageSquare,
  Shield,
  User
} from 'lucide-react';
import { createPageUrl } from '../utils';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function ModerationDashboard() {
  const { currentUser } = useAuth();
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = createPageUrl('Home');
      return;
    }

    loadModerationData();
  }, [currentUser]);

  const loadModerationData = async () => {
    try {
      setLoading(true);

      // Get flagged messages
      const flaggedResponse = await mockAPI.moderation.getFlaggedMessages();
      if (flaggedResponse.success) {
        setFlaggedMessages(flaggedResponse.messages);
      }

      // Get reports
      const reportsResponse = await mockAPI.safety.getReports();
      if (reportsResponse.success) {
        setReports(reportsResponse.reports);
      }
    } catch (error) {
      console.error('Error loading moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, reason) => {
    if (!confirm(`Tem certeza que deseja banir este usuário?\n\nMotivo: ${reason}`)) {
      return;
    }

    try {
      const response = await mockAPI.moderation.banUser(userId, reason);
      if (response.success) {
        alert('✅ Usuário banido com sucesso!');
        loadModerationData();
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Erro ao banir usuário.');
    }
  };

  const handleDismissFlag = async (messageId) => {
    try {
      const response = await mockAPI.moderation.dismissFlag(messageId);
      if (response.success) {
        setFlaggedMessages(flaggedMessages.filter(m => m.id !== messageId));
      }
    } catch (error) {
      console.error('Error dismissing flag:', error);
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = createPageUrl('Home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard de Moderação</h1>
            <p className="text-sm text-slate-600">Revisão de conteúdo e denúncias</p>
          </div>
          <Badge variant="outline" className="text-red-600 border-red-600">
            <Shield className="w-4 h-4 mr-1" />
            Admin
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{flaggedMessages.length}</p>
                <p className="text-sm text-slate-600">Mensagens Sinalizadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{reports.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-slate-600">Denúncias Pendentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{reports.filter(r => r.status === 'resolved').length}</p>
                <p className="text-sm text-slate-600">Casos Resolvidos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens Sinalizadas
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Flag className="w-4 h-4 mr-2" />
              Denúncias
            </TabsTrigger>
          </TabsList>

          {/* Flagged Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {flaggedMessages.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma mensagem sinalizada</h3>
                <p className="text-slate-600">Todas as conversas estão dentro das regras.</p>
              </Card>
            ) : (
              flaggedMessages.map((message) => (
                <Card key={message.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">
                            Mensagem de {message.senderName}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {new Date(message.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.reasons.map((reason, idx) => (
                            <Badge key={idx} variant="outline" className="border-red-600 text-red-700">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                        <p className="text-slate-900">{message.text}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleBanUser(message.senderId, message.reasons.join(', '))}
                          variant="destructive"
                          size="sm"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Banir Usuário
                        </Button>
                        <Button
                          onClick={() => handleDismissFlag(message.id)}
                          variant="outline"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Dispensar
                        </Button>
                        <Button
                          onClick={() => window.location.href = createPageUrl('Chat') + '?matchId=' + message.matchId}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Conversa
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {reports.filter(r => r.status === 'pending').length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma denúncia pendente</h3>
                <p className="text-slate-600">Todas as denúncias foram resolvidas.</p>
              </Card>
            ) : (
              reports
                .filter(r => r.status === 'pending')
                .map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Flag className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 mb-1">
                              Denúncia contra {report.reportedUserName}
                            </h3>
                            <p className="text-sm text-slate-600">
                              Por {report.reporterName} • {new Date(report.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-red-600 text-red-700">
                            {report.category}
                          </Badge>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-slate-700 mb-2">Descrição:</p>
                          <p className="text-slate-900">{report.description}</p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleBanUser(report.reportedUserId, report.category)}
                            variant="destructive"
                            size="sm"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Banir Denunciado
                          </Button>
                          <Button
                            onClick={() => window.location.href = createPageUrl('ProfileView') + '?id=' + report.reportedUserId}
                            variant="outline"
                            size="sm"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Ver Perfil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


