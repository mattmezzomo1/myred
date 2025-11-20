import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPageUrl } from '../utils';
import { Upload, Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';

export default function RegisterMan() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    city: '',
    state: '',
    height: '',
    about: '',
    occupation: '',
    financial_capacity: '',
    looking_for: '',
    interests: [],
    lifestyle: '',
    photos: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      ...formData,
      userType: 'man',
      distance: 0
    };

    try {
      const response = await mockAPI.auth.register(userData);

      if (response.success) {
        window.location.href = createPageUrl('Home');
      } else {
        alert('Erro ao registrar: ' + response.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Erro ao registrar. Tente novamente.');
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 6) {
      alert('Você pode adicionar no máximo 6 fotos');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const interests = [
    'Música', 'Cinema', 'Leitura', 'Cozinhar', 'Viajar', 'Esportes',
    'Arte', 'Dança', 'Yoga', 'Natureza', 'Fotografia', 'Moda',
    'Tecnologia', 'Negócios', 'Carros', 'Jogos'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-50 py-8 px-4">
      <motion.div 
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Crie seu Perfil</h1>
          <p className="text-slate-600">Seja claro sobre suas intenções</p>
        </div>

        <Card className="p-6 shadow-xl border-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    step === currentStep ? 'w-8 bg-purple-500' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">Passo {currentStep} de 3</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900">Suas Fotos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.photos.length < 6 && (
                      <label className="aspect-square rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex flex-col items-center justify-center cursor-pointer hover:from-purple-200 hover:to-violet-200 transition-all border-2 border-dashed border-purple-300">
                        <Camera className="w-8 h-8 text-purple-400 mb-1" />
                        <span className="text-xs text-purple-600">Adicionar</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Adicione até 6 fotos (mínimo 2 recomendado)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="h-12"
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade *</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      min="18"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="25"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="175"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="SP"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Profissão *</Label>
                  <Input
                    id="occupation"
                    required
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="Ex: Empresário, Executivo..."
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financial_capacity">Capacidade de Apoio Financeiro *</Label>
                  <Select
                    value={formData.financial_capacity}
                    onValueChange={(value) => setFormData({ ...formData, financial_capacity: value })}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Apoio básico (R$ 500-1.500/mês)</SelectItem>
                      <SelectItem value="moderado">Apoio moderado (R$ 1.500-3.000/mês)</SelectItem>
                      <SelectItem value="confortavel">Apoio confortável (R$ 3.000-5.000/mês)</SelectItem>
                      <SelectItem value="amplo">Apoio amplo (R$ 5.000+/mês)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="situation">Sua Situação Atual *</Label>
                  <Select
                    value={formData.situation}
                    onValueChange={(value) => setFormData({ ...formData, situation: value })}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desempregada">Desempregada</SelectItem>
                      <SelectItem value="emprego_baixa_renda">Emprego de baixa renda</SelectItem>
                      <SelectItem value="estudante">Estudante sem renda</SelectItem>
                      <SelectItem value="mae_solo">Mãe solo</SelectItem>
                      <SelectItem value="outra">Outra situação difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needs">Necessidade Financeira *</Label>
                  <Select
                    value={formData.needs}
                    onValueChange={(value) => setFormData({ ...formData, needs: value })}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moradia">Moradia/Aluguel</SelectItem>
                      <SelectItem value="alimentacao">Alimentação básica</SelectItem>
                      <SelectItem value="estudos">Estudos/Curso</SelectItem>
                      <SelectItem value="saude">Saúde/Medicamentos</SelectItem>
                      <SelectItem value="filhos">Cuidado com filhos</SelectItem>
                      <SelectItem value="geral">Apoio financeiro geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="looking_for">O que você busca? *</Label>
                  <Textarea
                    id="looking_for"
                    required
                    value={formData.looking_for}
                    onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                    placeholder="Ex: Busco uma companhia genuína, alguém para construir algo sério..."
                    className="min-h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seus Interesses</Label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.interests.includes(interest)
                            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifestyle">Estilo de Vida</Label>
                  <Select
                    value={formData.lifestyle}
                    onValueChange={(value) => setFormData({ ...formData, lifestyle: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo e energético</SelectItem>
                      <SelectItem value="tranquilo">Tranquilo e caseiro</SelectItem>
                      <SelectItem value="social">Social e extrovertido</SelectItem>
                      <SelectItem value="equilibrado">Equilibrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">Sobre Você</Label>
                  <Textarea
                    id="about"
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    placeholder="Conte sobre você, seus interesses, estilo de vida..."
                    className="min-h-24 resize-none"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 h-12"
                >
                  Voltar
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg"
                >
                  Criar Perfil
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}