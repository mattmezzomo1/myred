import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Gift, Plus, Minus, Check } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function RoseCheckout() {
  const [profile, setProfile] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'pix'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('profileId');
    
    // Mock data
    const mockProfile = {
      id: 1,
      name: 'Marina',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    };
    
    setProfile(mockProfile);
  }, []);

  const pricePerRose = 20;
  const total = quantity * pricePerRose;

  const handlePurchase = () => {
    // Simulate purchase
    setShowSuccess(true);
    
    setTimeout(() => {
      window.location.href = createPageUrl('Home');
    }, 2000);
  };

  if (!profile) return null;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Rosa Enviada! 🌹</h2>
          <p className="text-slate-600">
            {profile.name} receberá sua rosa especial
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-slate-900">Enviar Rosa</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile info */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{profile.name}, {profile.age}</h3>
                <p className="text-sm text-slate-600">Receberá sua rosa especial</p>
              </div>
            </div>
          </Card>

          {/* Rose info */}
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-2">O que é uma Rosa? 🌹</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Uma rosa é um presente especial que mostra seu interesse. Ela vai direto para a carteira dela como R$ 20 e sua curtida aparece destacada.
                </p>
              </div>
            </div>
          </Card>

          {/* Bouquet visualization */}
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <Label className="text-base font-semibold mb-4 block text-center">Seu Buquê</Label>
            <div className="flex items-end justify-center gap-1 h-32">
              {[...Array(Math.min(quantity, 10))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  className="relative"
                  style={{ 
                    transform: `rotate(${(i - quantity / 2) * 5}deg)`,
                    zIndex: i
                  }}
                >
                  <div className="text-4xl">🌹</div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-600 mt-4">
              {quantity === 1 ? '1 rosa' : `${quantity} rosas`} no seu buquê
            </p>
          </Card>

          {/* Quantity selector */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Quantidade de Rosas</Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-full"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="text-3xl font-bold text-slate-900 min-w-[60px] text-center">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="w-12 h-12 rounded-full"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Total</div>
                <div className="text-2xl font-bold text-pink-600">
                  R$ {total.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>

          {/* Payment method selector */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Método de Pagamento</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className={`h-14 ${paymentMethod === 'card' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Cartão
              </Button>
              <Button
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                className={`h-14 ${paymentMethod === 'pix' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''}`}
                onClick={() => setPaymentMethod('pix')}
              >
                🔷 Pix
              </Button>
            </div>
          </Card>

          {/* Payment info */}
          {paymentMethod === 'card' ? (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Informações do Cartão</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome no Cartão</Label>
                  <Input
                    id="name"
                    placeholder="Nome Completo"
                    className="h-12"
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Pagamento via Pix</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-100 rounded-lg p-4 text-center">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Escaneie o QR Code ou copie o código Pix
                  </p>
                  <p className="text-xs text-slate-500">
                    O pagamento será processado instantaneamente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Chave Pix Copia e Cola</Label>
                  <div className="flex gap-2">
                    <Input
                      value="00020126580014BR.GOV.BCB.PIX..."
                      readOnly
                      className="h-12 font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      className="h-12 px-4"
                      onClick={() => {
                        navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX...');
                        alert('Código Pix copiado!');
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    ⏱️ Este código expira em <strong>15 minutos</strong>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Summary */}
          <Card className="p-6 bg-slate-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Rosas ({quantity}x)</span>
                <span className="text-slate-900 font-medium">R$ {(quantity * pricePerRose).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxa de processamento</span>
                <span className="text-slate-900 font-medium">R$ 0,00</span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-pink-600 text-lg">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Action button */}
          <Button
            onClick={handlePurchase}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-base font-semibold shadow-lg"
          >
            <Gift className="w-5 h-5 mr-2" />
            {paymentMethod === 'pix' ? 'Pagar com Pix' : `Pagar R$ ${total.toFixed(2)}`}
          </Button>

          <p className="text-xs text-center text-slate-500">
            Ao finalizar a compra, você concorda com nossos Termos de Uso
          </p>
        </div>
      </div>
    </div>
  );
}