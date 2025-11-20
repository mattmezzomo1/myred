import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  Target,
  BookOpen,
  Briefcase,
  Home,
  Heart,
  Plus,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function RestartPlan() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: 'course',
    title: '',
    description: '',
    targetDate: '',
    milestones: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }

    if (currentUser.userType !== 'woman') {
      alert('Esta funcionalidade é exclusiva para mulheres.');
      window.location.href = createPageUrl('Home');
      return;
    }

    loadGoals();
  }, [currentUser]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await mockAPI.goals.getGoals(currentUser.id);
      if (response.success) {
        setGoals(response.goals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.category) {
      alert('Por favor, preencha o título e selecione uma categoria.');
      return;
    }

    try {
      const response = await mockAPI.goals.createGoal(currentUser.id, newGoal);
      if (response.success) {
        setGoals([...goals, response.goal]);
        setShowNewGoal(false);
        setNewGoal({
          category: 'course',
          title: '',
          description: '',
          targetDate: '',
          milestones: []
        });
        alert('✅ Meta criada com sucesso!');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Erro ao criar meta.');
    }
  };

  const handleUpdateProgress = async (goalId, progress) => {
    try {
      const response = await mockAPI.goals.updateProgress(goalId, progress);
      if (response.success) {
        setGoals(goals.map(g => g.id === goalId ? { ...g, progress } : g));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'course': return <BookOpen className="w-5 h-5" />;
      case 'job': return <Briefcase className="w-5 h-5" />;
      case 'moving': return <Home className="w-5 h-5" />;
      case 'treatment': return <Heart className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      course: 'Curso/Educação',
      job: 'Emprego',
      moving: 'Mudança',
      treatment: 'Tratamento',
      other: 'Outro'
    };
    return labels[category] || category;
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Plano de Recomeço</h1>
            <p className="text-sm text-slate-600">Defina e acompanhe suas metas</p>
          </div>
          <Button onClick={() => setShowNewGoal(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{goals.length}</p>
                <p className="text-sm text-slate-600">Metas Ativas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{goals.filter(g => g.progress === 100).length}</p>
                <p className="text-sm text-slate-600">Concluídas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
                </p>
                <p className="text-sm text-slate-600">Progresso Médio</p>
              </div>
            </div>
          </Card>
        </div>

        {/* New Goal Form */}
        {showNewGoal && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Nova Meta</h3>
              <div className="space-y-4">
                <div>
                  <Label>Categoria</Label>
                  <RadioGroup value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
                      {['course', 'job', 'moving', 'treatment', 'other'].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <RadioGroupItem value={cat} id={cat} />
                          <Label htmlFor={cat} className="cursor-pointer text-sm">
                            {getCategoryLabel(cat)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="title">Título da Meta *</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Concluir curso de Marketing Digital"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Descreva sua meta e como pretende alcançá-la..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="targetDate">Data Alvo</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCreateGoal} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Criar Meta
                  </Button>
                  <Button onClick={() => setShowNewGoal(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma meta definida</h3>
              <p className="text-slate-600 mb-4">
                Comece definindo suas metas e acompanhe seu progresso rumo ao recomeço.
              </p>
              <Button onClick={() => setShowNewGoal(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    goal.progress === 100 ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {goal.progress === 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      getCategoryIcon(goal.category)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{goal.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {getCategoryLabel(goal.category)}
                        </Badge>
                      </div>
                      {goal.progress === 100 && (
                        <Award className="w-6 h-6 text-amber-500" />
                      )}
                    </div>

                    {goal.description && (
                      <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
                    )}

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Progresso</span>
                        <span className="font-semibold text-slate-900">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {goal.targetDate && (
                      <p className="text-sm text-slate-500">
                        Meta: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}

                    {goal.progress < 100 && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleUpdateProgress(goal.id, Math.min(100, goal.progress + 25))}
                          size="sm"
                          variant="outline"
                        >
                          +25% Progresso
                        </Button>
                        <Button
                          onClick={() => handleUpdateProgress(goal.id, 100)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Concluir
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Educational Resources */}
        {goals.length > 0 && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Recursos Educacionais
            </h3>
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <h4 className="font-semibold text-slate-900 text-sm">Cursos Gratuitos Online</h4>
                <p className="text-xs text-slate-600">Plataformas com cursos profissionalizantes gratuitos</p>
              </a>
              <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <h4 className="font-semibold text-slate-900 text-sm">Orientação de Carreira</h4>
                <p className="text-xs text-slate-600">Dicas para elaborar currículo e se preparar para entrevistas</p>
              </a>
              <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <h4 className="font-semibold text-slate-900 text-sm">Apoio Psicológico</h4>
                <p className="text-xs text-slate-600">Serviços de apoio emocional e psicológico gratuitos</p>
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


