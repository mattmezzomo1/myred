import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function MonthlySupport() {
  const { currentUser } = useAuth();
  const [matchUser, setMatchUser] = useState(null);
  const [supportData, setSupportData] = useState(null);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');
    
    if (matchId) {
      loadSupportData(matchId);
    }
  }, [currentUser]);

  const loadSupportData = async (matchId) => {
    try {
      // Get match user info
      const matchResponse = await mockAPI.matching.getMatch(matchId);
      if (matchResponse.success) {
        setMatchUser(matchResponse.match);
      }

      // Get existing support
      const supportResponse = await mockAPI.support.getSupport(currentUser.id, matchId);
      if (supportResponse.success && supportResponse.support) {
        setSupportData(supportResponse.support);
        calculateTimeRemaining(supportResponse.support);
      }
    } catch (error) {
      console.error('Error loading support data:', error);
    }
  };

  const calculateTimeRemaining = (support) => {
    if (support.status !== 'pending') return;

    const releaseTime = new Date(support.releaseDate).getTime();
    const now = new Date().getTime();
    const diff = releaseTime - now;

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining({ hours, minutes });

      // Update every minute
      const interval = setInterval(() => {
        calculateTimeRemaining(support);
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining(null);
    }
  };

  const handleCreateSupport = async () => {
    if (!amount || parseFloat(amount) < 100) {
      alert('O valor mínimo de apoio é R$ 100,00');
      return;
    }

    setProcessing(true);

    try {
      const response = await mockAPI.support.createSupport({
        senderId: currentUser.id,
        receiverId: matchUser.id,
        amount: parseFloat(amount),
        matchId: matchUser.id
      });

      if (response.success) {
        setSupportData(response.support);
        calculateTimeRemaining(response.support);
        alert('✅ Apoio mensal criado com sucesso!\n\nO valor ficará em custódia por 48 horas.');
      }
    } catch (error) {
      console.error('Error creating support:', error);
      alert('Erro ao criar apoio. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (!currentUser || !matchUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  const isWoman = currentUser.userType === 'woman';
  const progressPercentage = timeRemaining 
    ? ((48 - timeRemaining.hours) / 48) * 100 
    : supportData?.status === 'released' ? 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Apoio Mensal</h1>
            <p className="text-sm text-slate-600">
              {isWoman ? `De ${matchUser.name}` : `Para ${matchUser.name}`}
            </p>
          </div>
        </div>

        {/* Existing Support Status */}
        {supportData ? (
          <div className="space-y-4">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Apoio de R$ {supportData.amount.toFixed(2)}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Criado em {new Date(supportData.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge
                  className={
                    supportData.status === 'released'
                      ? 'bg-green-600'
                      : supportData.status === 'frozen'
                      ? 'bg-red-600'
                      : 'bg-amber-600'
                  }
                >
                  {supportData.status === 'released' && <Unlock className="w-4 h-4 mr-1" />}
                  {supportData.status === 'frozen' && <Lock className="w-4 h-4 mr-1" />}
                  {supportData.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                  {supportData.status === 'released' ? 'Liberado' :
                   supportData.status === 'frozen' ? 'Congelado' : 'Em Custódia'}
                </Badge>
              </div>

              {/* Custody Timer */}
              {supportData.status === 'pending' && timeRemaining && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Tempo restante para liberação:</span>
                    <span className="font-bold text-purple-600">
                      {timeRemaining.hours}h {timeRemaining.minutes}m
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-slate-500">
                    O valor será liberado automaticamente em {new Date(supportData.releaseDate).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}

              {/* Released Status */}
              {supportData.status === 'released' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-1">Apoio Liberado</p>
                    <p>
                      {isWoman
                        ? 'O valor foi liberado e está disponível para você.'
                        : 'O valor foi liberado para a beneficiária.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Frozen Status */}
              {supportData.status === 'frozen' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-semibold mb-1">Apoio Congelado</p>
                    <p>
                      Este apoio foi congelado devido a uma denúncia. Nossa equipe está analisando o caso.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Security Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Sistema de Custódia Seguro</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Pagamento retido por 48 horas</li>
                    <li>• Liberação automática se não houver denúncias</li>
                    <li>• Congelamento imediato em caso de violação</li>
                    <li>• Reembolso garantido em casos comprovados</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Create New Support */
          <Card className="p-6">
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2">Como funciona o Apoio Mensal?</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>✓ Você define o valor do apoio mensal</li>
                  <li>✓ O pagamento fica em custódia por 48 horas</li>
                  <li>✓ Após 48h sem denúncias, o valor é liberado</li>
                  <li>✓ Em caso de violação, o pagamento é congelado</li>
                  <li>✓ Chat liberado após confirmação do apoio</li>
                </ul>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-semibold">
                  Valor do Apoio Mensal
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="amount"
                    type="number"
                    min="100"
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="pl-10 text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Valor mínimo: R$ 100,00
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleCreateSupport}
                disabled={processing || !amount || parseFloat(amount) < 100}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg"
              >
                {processing ? 'Processando...' : 'Confirmar Apoio Mensal'}
              </Button>

              {/* Security Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold mb-1">🔒 Pagamento Seguro</p>
                    <p>
                      Seu pagamento é processado de forma segura e fica em custódia por 48 horas.
                      Você pode solicitar reembolso em caso de violação das regras.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


