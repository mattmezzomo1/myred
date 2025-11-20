import React, { useState } from 'react';
import { AlertTriangle, Phone, User, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import mockAPI from '../services/mockAPI';

export default function PanicButton({ userId }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activating, setActivating] = useState(false);

  const handlePanicClick = () => {
    setShowConfirmation(true);
  };

  const handleCallPolice = async () => {
    setActivating(true);
    
    try {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          const response = await mockAPI.safety.panicButton(userId, location);
          
          if (response.success) {
            alert('🚨 EMERGÊNCIA ATIVADA!\n\nAutoridades foram notificadas.\nSua localização foi compartilhada.\n\nID de Emergência: ' + response.emergencyId);
            
            // Try to call emergency number
            window.location.href = 'tel:190';
          }
        }, (error) => {
          console.error('Location error:', error);
          alert('Não foi possível obter sua localização, mas a emergência foi registrada.');
        });
      } else {
        const response = await mockAPI.safety.panicButton(userId, null);
        alert('🚨 EMERGÊNCIA ATIVADA!\n\nID: ' + response.emergencyId);
        window.location.href = 'tel:190';
      }
    } catch (error) {
      console.error('Panic button error:', error);
      alert('Erro ao ativar emergência. Ligue 190 imediatamente!');
    } finally {
      setActivating(false);
      setShowConfirmation(false);
    }
  };

  const handleCallEmergencyContact = async () => {
    try {
      const response = await mockAPI.safety.getEmergencyContacts(userId);
      
      if (response.success && response.contacts.length > 0) {
        const contact = response.contacts[0];
        window.location.href = `tel:${contact.phone}`;
      } else {
        alert('Você ainda não cadastrou um contato de emergência.\nVá em Perfil > Segurança para adicionar.');
      }
    } catch (error) {
      console.error('Emergency contact error:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      {/* Floating Panic Button */}
      <motion.button
        onClick={handlePanicClick}
        className="fixed bottom-24 right-4 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AlertTriangle className="w-8 h-8" />
      </motion.button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Botão de Pânico
            </DialogTitle>
            <DialogDescription>
              Escolha uma opção de emergência. Sua localização será compartilhada automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Button
              onClick={handleCallPolice}
              disabled={activating}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-lg"
            >
              <Phone className="w-6 h-6 mr-2" />
              {activating ? 'Ativando...' : 'Ligar para Polícia (190)'}
            </Button>

            <Button
              onClick={handleCallEmergencyContact}
              variant="outline"
              className="w-full h-16 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-lg"
            >
              <User className="w-6 h-6 mr-2" />
              Ligar para Contato de Emergência
            </Button>

            <Button
              onClick={() => setShowConfirmation(false)}
              variant="ghost"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              ⚠️ Use apenas em situações de emergência real. Acionamentos falsos podem resultar em consequências legais.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

