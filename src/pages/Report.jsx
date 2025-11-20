import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

const REPORT_CATEGORIES = [
  { id: 'harassment', label: 'Assédio', description: 'Comportamento inadequado ou insistente' },
  { id: 'sexualization', label: 'Sexualização', description: 'Propostas sexuais ou conteúdo impróprio' },
  { id: 'manipulation', label: 'Manipulação', description: 'Chantagem, pressão ou condicionamento' },
  { id: 'threat', label: 'Ameaça', description: 'Ameaças de violência ou intimidação' },
  { id: 'scam', label: 'Golpe', description: 'Tentativa de fraude ou engano' },
  { id: 'other', label: 'Outro', description: 'Outro tipo de violação' }
];

export default function Report() {
  const { currentUser } = useAuth();
  const [reportedUser, setReportedUser] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    evidence: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }
    
    if (userId) {
      loadReportedUser(userId);
    }
  }, [currentUser]);

  const loadReportedUser = async (userId) => {
    try {
      const response = await mockAPI.user.getProfile(userId);
      if (response.success) {
        setReportedUser(response.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('Por favor, selecione uma categoria');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Por favor, descreva o que aconteceu');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const reportData = {
        reporterId: currentUser.id,
        reportedUserId: reportedUser.id,
        category: formData.category,
        description: formData.description,
        evidence: formData.evidence
      };
      
      const response = await mockAPI.safety.createReport(reportData);
      
      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = createPageUrl('Home');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Erro ao enviar denúncia. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser || !reportedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Denúncia Enviada</h2>
          <p className="text-slate-600 mb-4">
            Sua denúncia foi recebida e será analisada pela nossa equipe.
          </p>
          <p className="text-sm text-slate-500">
            Redirecionando...
          </p>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-slate-900">Denunciar Usuário</h1>
            <p className="text-sm text-slate-600">Denunciando: {reportedUser.name}</p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Política de Tolerância Zero</p>
                <p>
                  Denúncias comprovadas resultam em banimento imediato e permanente.
                  Em casos graves, as autoridades serão acionadas.
                </p>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Categoria da Denúncia *</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                {REPORT_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <RadioGroupItem value={category.id} id={category.id} />
                    <div className="flex-1">
                      <Label htmlFor={category.id} className="font-semibold cursor-pointer">
                        {category.label}
                      </Label>
                      <p className="text-sm text-slate-600">{category.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Descreva o que aconteceu *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva detalhadamente o que aconteceu. Inclua datas, horários e contexto."
                className="min-h-32"
                required
              />
              <p className="text-xs text-slate-500">
                Seja o mais específico possível. Isso ajudará nossa equipe a analisar o caso.
              </p>
            </div>

            {/* Evidence Upload */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Evidências (opcional)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-1">
                  Adicione capturas de tela ou outros arquivos
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  PNG, JPG ou PDF até 10MB
                </p>
                <Button type="button" variant="outline" size="sm">
                  Selecionar Arquivos
                </Button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600">
                🔒 <strong>Privacidade:</strong> Suas informações serão mantidas em sigilo.
                O usuário denunciado não saberá quem fez a denúncia.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {submitting ? 'Enviando...' : 'Enviar Denúncia'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}


