import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Shield,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import mockAPI from '../services/mockAPI';
import { useAuth } from '../hooks/useAuth';

export default function SafeMeeting() {
  const { currentUser } = useAuth();
  const [matchUser, setMatchUser] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    time: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [checkInActive, setCheckInActive] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = createPageUrl('Home');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');
    
    if (matchId) {
      loadMeetingData(matchId);
    }
  }, [currentUser]);

  const loadMeetingData = async (matchId) => {
    try {
      // Get match user info
      const matchResponse = await mockAPI.matching.getMatch(matchId);
      if (matchResponse.success) {
        setMatchUser(matchResponse.match);
      }

      // Get existing meeting
      const meetingResponse = await mockAPI.meeting.getMeeting(currentUser.id, matchId);
      if (meetingResponse.success && meetingResponse.meeting) {
        setMeeting(meetingResponse.meeting);
        if (meetingResponse.meeting.status === 'active') {
          setCheckInActive(true);
          startLocationTracking();
        }
      }
    } catch (error) {
      console.error('Error loading meeting data:', error);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!formData.location || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSubmitting(true);

    try {
      const meetingData = {
        userId: currentUser.id,
        matchUserId: matchUser.id,
        location: formData.location,
        dateTime: `${formData.date}T${formData.time}`,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone
        }
      };

      const response = await mockAPI.meeting.scheduleMeeting(meetingData);

      if (response.success) {
        setMeeting(response.meeting);
        alert('✅ Encontro agendado com sucesso!\n\nLembre-se de fazer o check-in antes do encontro.');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Erro ao agendar encontro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          const response = await mockAPI.meeting.checkIn(meeting.id, loc);

          if (response.success) {
            setCheckInActive(true);
            setLocation(loc);
            startLocationTracking();
            alert('✅ Check-in realizado!\n\nSua localização está sendo compartilhada com seu contato de emergência.');
          }
        }, (error) => {
          console.error('Location error:', error);
          alert('Não foi possível obter sua localização. Ative o GPS e tente novamente.');
        });
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Erro ao fazer check-in.');
    }
  };

  const handleImSafe = async () => {
    try {
      const response = await mockAPI.meeting.confirmSafety(meeting.id);

      if (response.success) {
        alert('✅ Confirmação de segurança registrada!');
      }
    } catch (error) {
      console.error('Error confirming safety:', error);
    }
  };

  const handleEndMeeting = async () => {
    if (!confirm('Deseja encerrar o encontro e parar o compartilhamento de localização?')) {
      return;
    }

    try {
      const response = await mockAPI.meeting.endMeeting(meeting.id);

      if (response.success) {
        setCheckInActive(false);
        stopLocationTracking();
        alert('✅ Encontro encerrado com sucesso!');
        window.location.href = createPageUrl('Matches');
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  const startLocationTracking = () => {
    // Simulate location tracking every 5 minutes
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(loc);
          mockAPI.meeting.updateLocation(meeting.id, loc);
        });
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  };

  const stopLocationTracking = () => {
    setLocation(null);
  };

  if (!currentUser || !matchUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Encontro Seguro</h1>
            <p className="text-sm text-slate-600">Com {matchUser.name}</p>
          </div>
        </div>

        {checkInActive ? (
          /* Active Meeting */
          <div className="space-y-4">
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Encontro Ativo</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Sua localização está sendo compartilhada com segurança
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleImSafe} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Estou Segura
                  </Button>
                  <Button onClick={handleEndMeeting} variant="outline">
                    Encerrar Encontro
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : meeting ? (
          /* Scheduled Meeting */
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Encontro Agendado</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span>{meeting.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span>{new Date(meeting.dateTime).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <Button onClick={handleCheckIn} className="w-full bg-purple-600 hover:bg-purple-700">
              <Navigation className="w-4 h-4 mr-2" />
              Fazer Check-in
            </Button>
          </Card>
        ) : (
          /* Schedule New Meeting */
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Local do Encontro *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Café Central, Rua X, 123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Horário *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyName">Contato de Emergência</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Nome"
                />
              </div>
              <div>
                <Input
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="Telefone"
                />
              </div>
              <Button onClick={handleScheduleMeeting} disabled={submitting} className="w-full">
                {submitting ? 'Agendando...' : 'Agendar Encontro Seguro'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


