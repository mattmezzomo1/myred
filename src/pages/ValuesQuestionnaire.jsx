import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Heart, Shield, CheckCircle } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function ValuesQuestionnaire() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    intentions: '',
    expectations: '',
    relationshipGoal: 'long-term',
    commitment: 'serious',
    currentSituation: '',
    monthlyIncome: '',
    mainNeed: '',
    acceptedTerms: false,
    acceptedConduct: false
  });

  const totalSteps = currentUser?.userType === 'woman' ? 4 : 3;

  const handleNext = () => {
    if (step === 1 && (!formData.intentions || !formData.expectations)) {
      alert('Por favor, responda todas as perguntas.');
      return;
    }
    if (step === 2 && currentUser?.userType === 'woman' && !formData.currentSituation) {
      alert('Por favor, responda todas as perguntas.');
      return;
    }
    if ((step === 2 && currentUser?.userType === 'man') || (step === 3 && currentUser?.userType === 'woman')) {
      if (!formData.acceptedTerms || !formData.acceptedConduct) {
        alert('Você precisa aceitar os termos para continuar.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    try {
      const response = await mockAPI.user.saveQuestionnaire(currentUser.id, formData);
      if (response.success) {
        alert('✅ Questionário concluído!');
        window.location.href = createPageUrl('Home');
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Passo {step} de {totalSteps}</span>
            <span className="text-sm text-slate-600">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Suas Intenções</h2>
                  <p className="text-slate-600">Queremos entender melhor suas expectativas</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">
                      O que você busca nesta plataforma?
                    </Label>
                    <Textarea
                      value={formData.intentions}
                      onChange={(e) => setFormData({ ...formData, intentions: e.target.value })}
                      placeholder="Seja honesto(a) sobre suas intenções..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">
                      Quais são suas expectativas em relação a um relacionamento aqui?
                    </Label>
                    <Textarea
                      value={formData.expectations}
                      onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                      placeholder="Descreva o que você espera..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Tipo de relacionamento desejado:</Label>
                    <RadioGroup value={formData.relationshipGoal} onValueChange={(value) => setFormData({ ...formData, relationshipGoal: value })}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="long-term" id="long-term" />
                          <Label htmlFor="long-term" className="cursor-pointer">Relacionamento de longo prazo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="short-term" id="short-term" />
                          <Label htmlFor="short-term" className="cursor-pointer">Apoio temporário</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="flexible" id="flexible" />
                          <Label htmlFor="flexible" className="cursor-pointer">Flexível, depende da conexão</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                  Continuar
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && currentUser.userType === 'woman' && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Sua Situação Atual</h2>
                  <p className="text-slate-600">Informações confidenciais para melhor suporte</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Descreva sua situação atual:</Label>
                    <Textarea
                      value={formData.currentSituation}
                      onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                      placeholder="Ex: Desempregada, mãe solteira, buscando recomeçar..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Renda mensal aproximada:</Label>
                    <RadioGroup value={formData.monthlyIncome} onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value })}>
                      <div className="space-y-2">
                        {['Sem renda', 'Até R$ 1.000', 'R$ 1.000 - R$ 2.000', 'R$ 2.000 - R$ 3.000', 'Acima de R$ 3.000'].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Principal necessidade:</Label>
                    <RadioGroup value={formData.mainNeed} onValueChange={(value) => setFormData({ ...formData, mainNeed: value })}>
                      <div className="space-y-2">
                        {['Moradia', 'Alimentação', 'Educação/Curso', 'Saúde/Tratamento', 'Dívidas', 'Recomeço geral'].map((need) => (
                          <div key={need} className="flex items-center space-x-2">
                            <RadioGroupItem value={need} id={need} />
                            <Label htmlFor={need} className="cursor-pointer">{need}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">Voltar</Button>
                  <Button onClick={handleNext} className="flex-1 bg-purple-600 hover:bg-purple-700">Continuar</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {((step === 2 && currentUser.userType === 'man') || (step === 3 && currentUser.userType === 'woman')) && (
            <motion.div key="terms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Termos e Conduta</h2>
                  <p className="text-slate-600">Leia e aceite nossos termos</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-64 overflow-y-auto">
                    <h3 className="font-bold text-slate-900 mb-3">Código de Conduta NoJob</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><strong>1. Respeito Mútuo:</strong> Trate todos os usuários com dignidade e respeito.</p>
                      <p><strong>2. Proibido Sexualização:</strong> Esta não é uma plataforma de prostituição. Conversas sexuais resultam em banimento imediato.</p>
                      <p><strong>3. Transparência:</strong> Seja honesto sobre suas intenções e situação.</p>
                      <p><strong>4. Segurança:</strong> Use sempre os recursos de segurança da plataforma.</p>
                      <p><strong>5. Compromisso:</strong> Cumpra os acordos de apoio mensal estabelecidos.</p>
                      <p><strong>6. Denúncias:</strong> Reporte qualquer comportamento inadequado imediatamente.</p>
                      <p><strong>7. Privacidade:</strong> Não compartilhe informações pessoais de outros usuários.</p>
                      <p><strong>8. Zero Tolerância:</strong> Violações graves resultam em banimento permanente.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptedTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptedTerms: checked })}
                      />
                      <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                        Li e aceito os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> da plataforma NoJob.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="conduct"
                        checked={formData.acceptedConduct}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptedConduct: checked })}
                      />
                      <Label htmlFor="conduct" className="cursor-pointer text-sm leading-relaxed">
                        Comprometo-me a seguir o <strong>Código de Conduta</strong> e entendo que violações podem resultar em banimento permanente.
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setStep(step - 1)} variant="outline" className="flex-1">Voltar</Button>
                  <Button onClick={handleNext} className="flex-1 bg-purple-600 hover:bg-purple-700">Continuar</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {((step === 3 && currentUser.userType === 'man') || (step === 4 && currentUser.userType === 'woman')) && (
            <motion.div key="tutorial" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Tutorial de Segurança</h2>
                  <p className="text-slate-600">Conheça os recursos que protegem você</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Botão de Pânico
                    </h4>
                    <p className="text-sm text-red-800">
                      Em caso de emergência, use o botão de pânico para alertar autoridades e seu contato de emergência.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-bold text-amber-900 mb-2">Sistema de Denúncia</h4>
                    <p className="text-sm text-amber-800">
                      Denuncie comportamentos inadequados. Todas as denúncias são investigadas e podem resultar em banimento.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Apoio Mensal Seguro</h4>
                    <p className="text-sm text-purple-800">
                      Pagamentos ficam em custódia por 48h. Se houver denúncia, o valor é congelado automaticamente.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Encontros Seguros</h4>
                    <p className="text-sm text-blue-800">
                      Use o sistema de check-in para encontros presenciais. Sua localização será compartilhada com segurança.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">IA de Moderação</h4>
                    <p className="text-sm text-green-800">
                      Mensagens são monitoradas por IA. Conteúdo inadequado é sinalizado automaticamente.
                    </p>
                  </div>
                </div>

                <Button onClick={handleComplete} className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Concluir e Começar
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


