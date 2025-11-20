// Mock data for NoJob application
// This file contains all mock data used throughout the application

export const mockUsers = {
  women: [
    {
      id: 'w1',
      name: 'Ana Silva',
      age: 28,
      city: 'São Paulo',
      state: 'SP',
      distance: 5,
      bio: 'Busco recomeçar minha vida com dignidade. Quero fazer um curso de enfermagem e ter uma vida melhor.',
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
      userType: 'woman',
      email: 'ana@example.com',
      verified: {
        document: true,
        selfie: true,
        video: false
      },
      goals: {
        type: 'Curso',
        description: 'Curso de Enfermagem',
        progress: 30
      },
      socioeconomic: {
        situation: 'Vulnerável',
        hasChildren: true,
        needsSupport: true
      }
    },
    {
      id: 'w2',
      name: 'Maria Santos',
      age: 25,
      city: 'Rio de Janeiro',
      state: 'RJ',
      distance: 12,
      bio: 'Mãe solo, busco oportunidade de trabalho e estabilidade para minha filha.',
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
      userType: 'woman',
      email: 'maria@example.com',
      verified: {
        document: true,
        selfie: false,
        video: false
      },
      goals: {
        type: 'Emprego',
        description: 'Trabalho em escritório',
        progress: 15
      },
      socioeconomic: {
        situation: 'Muito vulnerável',
        hasChildren: true,
        needsSupport: true
      }
    }
  ],
  men: [
    {
      id: 'm1',
      name: 'Carlos Oliveira',
      age: 35,
      city: 'São Paulo',
      state: 'SP',
      distance: 3,
      bio: 'Empresário, quero ajudar mulheres a reconstruírem suas vidas com dignidade.',
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
      userType: 'man',
      email: 'carlos@example.com',
      verified: {
        document: true,
        selfie: true,
        video: true,
        badge: 'Homem de Valor'
      },
      values: {
        respectful: true,
        supportive: true,
        verified: true
      }
    },
    {
      id: 'm2',
      name: 'Roberto Lima',
      age: 42,
      city: 'São Paulo',
      state: 'SP',
      distance: 8,
      bio: 'Profissional liberal, acredito em segundas chances e quero fazer a diferença.',
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
      userType: 'man',
      email: 'roberto@example.com',
      verified: {
        document: true,
        selfie: true,
        video: false
      },
      values: {
        respectful: true,
        supportive: true,
        verified: false
      }
    }
  ]
};

export const mockMatches = [
  {
    id: 'match1',
    userId: 'm1',
    matchedUserId: 'w1',
    matchedAt: new Date('2024-01-15'),
    hasSupport: true,
    supportStatus: 'active',
    supportAmount: 1500,
    lastMessage: 'Olá! Como você está?',
    lastMessageAt: new Date('2024-01-20')
  }
];

export const mockMessages = {
  match1: [
    {
      id: 'msg1',
      senderId: 'm1',
      text: 'Olá Ana! Prazer em conhecê-la.',
      timestamp: new Date('2024-01-15T10:00:00'),
      flagged: false
    },
    {
      id: 'msg2',
      senderId: 'w1',
      text: 'Olá Carlos! Obrigada pelo apoio.',
      timestamp: new Date('2024-01-15T10:05:00'),
      flagged: false
    }
  ]
};

export const mockLikes = [
  { id: 'like1', userId: 'w1', likedUserId: 'm1', likedAt: new Date('2024-01-14') },
  { id: 'like2', userId: 'm1', likedUserId: 'w1', likedAt: new Date('2024-01-15') }
];

export const mockReports = [];

export const mockSupports = [
  {
    id: 'support1',
    fromUserId: 'm1',
    toUserId: 'w1',
    amount: 1500,
    status: 'in_custody', // in_custody, released, frozen
    createdAt: new Date('2024-01-15'),
    releaseAt: new Date('2024-01-17'),
    hoursRemaining: 24
  }
];

export const mockMeetings = [];

export const mockEmergencyContacts = [];

