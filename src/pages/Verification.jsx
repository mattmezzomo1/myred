import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Upload,
  Camera,
  Video,
  CheckCircle,
  Shield,
  FileText,
  User
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

const VERIFICATION_STEPS = [
  {
    id: 'document',
    title: 'Documento de Identidade',
    description: 'Envie uma foto do seu RG ou CNH',
    icon: FileText,
    required: true
  },
  {
    id: 'selfie',
    title: 'Selfie com Prova de Vida',
    description: 'Tire uma selfie segurando seu documento',
    icon: User,
    required: true
  },
  {
    id: 'video',
    title: 'Entrevista por Vídeo',
    description: 'Grave um vídeo respondendo perguntas sobre seus valores',
    icon: Video,
    required: false
  }
];

export default function Verification() {
  const { currentUser, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState({
    document: null,
    selfie: null,
    video: null
  });
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }

    // Check existing verification status
    if (currentUser.verified) {
      if (currentUser.verified.document && !verificationData.document) {
        setVerificationData(prev => ({ ...prev, document: 'verified' }));
      }
      if (currentUser.verified.selfie && !verificationData.selfie) {
        setVerificationData(prev => ({ ...prev, selfie: 'verified' }));
      }
      if (currentUser.verified.video && !verificationData.video) {
        setVerificationData(prev => ({ ...prev, video: 'verified' }));
      }
    }
  }, [currentUser]);

  const handleFileUpload = async (type, file) => {
    if (!file) return;

    setUploading(true);

    try {
      let response;
      
      if (type === 'document') {
        response = await mockAPI.verification.uploadDocument(currentUser.id, file);
      } else if (type === 'selfie') {
        response = await mockAPI.verification.uploadSelfie(currentUser.id, file);
      } else if (type === 'video') {
        response = await mockAPI.verification.uploadVideo(currentUser.id, file);
      }

      if (response.success) {
        setVerificationData(prev => ({ ...prev, [type]: 'verified' }));
        
        // Update user profile
        const updatedVerified = {
          ...currentUser.verified,
          [type]: true
        };
        
        await updateProfile({ verified: updatedVerified });
        
        // Move to next step
        if (currentStep < VERIFICATION_STEPS.length - 1) {
          setTimeout(() => setCurrentStep(currentStep + 1), 1000);
        } else {
          setCompleted(true);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const progress = ((currentStep + 1) / VERIFICATION_STEPS.length) * 100;
  const step = VERIFICATION_STEPS[currentStep];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Verificação Completa!</h2>
          <p className="text-slate-600 mb-2">
            Seu perfil foi verificado com sucesso.
          </p>
          {currentUser.userType === 'man' && verificationData.video === 'verified' && (
            <Badge className="bg-purple-600 text-white mb-6">
              <Shield className="w-4 h-4 mr-1" />
              Homem de Valor
            </Badge>
          )}
          <Button
            onClick={() => window.location.href = createPageUrl('Profile')}
            className="mt-4"
          >
            Ir para Perfil
          </Button>
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
            onClick={() => window.location.href = createPageUrl('Profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Verificação de Identidade</h1>
            <p className="text-sm text-slate-600">Etapa {currentStep + 1} de {VERIFICATION_STEPS.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h2>
                  <p className="text-slate-600">{step.description}</p>
                  {step.required && (
                    <Badge variant="outline" className="mt-2">Obrigatório</Badge>
                  )}
                </div>
              </div>

              {/* Upload Area */}
              {verificationData[step.id] === 'verified' ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-green-900">Verificado com sucesso!</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  {step.id === 'document' && (
                    <>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-semibold mb-2">
                        Envie uma foto do seu documento
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        RG, CNH ou Passaporte (frente e verso)
                      </p>
                    </>
                  )}
                  {step.id === 'selfie' && (
                    <>
                      <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-semibold mb-2">
                        Tire uma selfie segurando seu documento
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        Certifique-se de que seu rosto e o documento estejam visíveis
                      </p>
                    </>
                  )}
                  {step.id === 'video' && (
                    <>
                      <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-semibold mb-2">
                        Grave um vídeo de apresentação
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        Fale sobre seus valores e intenções (máx. 2 minutos)
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    id={`upload-${step.id}`}
                    accept={step.id === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => handleFileUpload(step.id, e.target.files[0])}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById(`upload-${step.id}`).click()}
                    disabled={uploading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploading ? 'Enviando...' : step.id === 'video' ? 'Gravar Vídeo' : 'Selecionar Arquivo'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
              )}
              {!step.required && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentStep < VERIFICATION_STEPS.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      window.location.href = createPageUrl('Profile');
                    }
                  }}
                  className="flex-1"
                >
                  Pular
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Info Card */}
        <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Por que verificamos?</p>
              <p>
                A verificação garante a segurança de todos os usuários e ajuda a construir
                uma comunidade de confiança. Seus dados são criptografados e protegidos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


