# 🚀 NoJob - Próximos Passos

## ✅ O que foi feito até agora

### FASE 1 e 2: Frontend Completo (100%)
- ✅ Desacoplamento total do Base44
- ✅ Sistema de autenticação mockado
- ✅ Botão de pânico e denúncias
- ✅ Verificação KYC completa
- ✅ Apoio mensal com custódia de 48h
- ✅ IA de moderação de chat
- ✅ Sistema de encontros seguros
- ✅ Plano de recomeço para mulheres
- ✅ Onboarding aprimorado

### FASE 3: Backend Iniciado (20%)
- ✅ Estrutura do projeto Node.js + TypeScript
- ✅ Express + Socket.IO configurados
- ✅ Schema Prisma completo (11 modelos)
- ⏳ APIs pendentes

---

## 📋 Tarefas Restantes (em ordem de prioridade)

### 1. Finalizar Setup do Backend (1-2 dias)

#### 1.1 Instalar Dependências
```bash
cd backend
npm install
```

#### 1.2 Configurar Banco de Dados
```bash
# Criar arquivo .env
cp .env.example .env

# Editar .env e adicionar:
DATABASE_URL="mysql://usuario:senha@host:3306/nojob_db"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_REFRESH_SECRET="sua-chave-refresh-aqui"
```

#### 1.3 Rodar Migrations
```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 1.4 Testar Backend
```bash
npm run dev
# Deve rodar em http://localhost:3001
```

---

### 2. Implementar Autenticação JWT (3.3) - 2-3 dias

**Arquivos a criar:**
- `backend/src/middleware/auth.ts` - Middleware de autenticação
- `backend/src/controllers/authController.ts` - Login, registro, refresh
- `backend/src/routes/authRoutes.ts` - Rotas de autenticação
- `backend/src/utils/jwt.ts` - Funções JWT

**Endpoints:**
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

**Funcionalidades:**
- Hash de senha com bcrypt
- Geração de JWT access token (1h)
- Geração de refresh token (7d)
- Middleware de proteção de rotas
- Roles (USER, ADMIN, MODERATOR)

---

### 3. Implementar APIs de Usuários (3.4) - 2-3 dias

**Arquivos a criar:**
- `backend/src/controllers/userController.ts`
- `backend/src/routes/userRoutes.ts`
- `backend/src/services/userService.ts`

**Endpoints:**
- `GET /api/v1/users/profile` - Perfil do usuário logado
- `PUT /api/v1/users/profile` - Atualizar perfil
- `GET /api/v1/users/:id` - Ver perfil de outro usuário
- `POST /api/v1/users/photos` - Upload de fotos
- `DELETE /api/v1/users/photos/:id` - Deletar foto

---

### 4. Implementar APIs de Matching (3.5) - 3-4 dias

**Arquivos a criar:**
- `backend/src/controllers/matchingController.ts`
- `backend/src/routes/matchingRoutes.ts`
- `backend/src/services/matchingService.ts`

**Endpoints:**
- `GET /api/v1/matching/profiles` - Perfis para swipe
- `POST /api/v1/matching/like` - Dar like
- `GET /api/v1/matching/matches` - Ver matches
- `GET /api/v1/matching/likes` - Ver likes recebidos

**Funcionalidades:**
- Algoritmo de matching por localização
- Detecção automática de match mútuo
- Filtros por idade, distância

---

### 5. Implementar APIs de Chat (3.5) - 3-4 dias

**Arquivos a criar:**
- `backend/src/controllers/chatController.ts`
- `backend/src/routes/chatRoutes.ts`
- `backend/src/services/chatService.ts`
- `backend/src/sockets/chatSocket.ts`

**Endpoints:**
- `GET /api/v1/chat/:matchId` - Mensagens do chat
- `POST /api/v1/chat/:matchId/message` - Enviar mensagem
- `PUT /api/v1/chat/:matchId/read` - Marcar como lido

**WebSocket Events:**
- `join-chat` - Entrar no chat
- `send-message` - Enviar mensagem em tempo real
- `new-message` - Receber mensagem
- `typing` - Indicador de digitação

---

### 6. Implementar APIs de Verificação (3.4) - 2 dias

**Arquivos a criar:**
- `backend/src/controllers/verificationController.ts`
- `backend/src/routes/verificationRoutes.ts`
- `backend/src/middleware/upload.ts` - Multer config

**Endpoints:**
- `POST /api/v1/verification/document` - Upload documento
- `POST /api/v1/verification/selfie` - Upload selfie
- `POST /api/v1/verification/video` - Upload vídeo
- `GET /api/v1/verification/status` - Status da verificação

---

### 7. Implementar APIs de Apoio Mensal (3.7) - 3-4 dias

**Arquivos a criar:**
- `backend/src/controllers/supportController.ts`
- `backend/src/routes/supportRoutes.ts`
- `backend/src/services/paymentService.ts`
- `backend/src/jobs/releasePayments.ts` - Cron job

**Endpoints:**
- `POST /api/v1/support/create` - Criar apoio
- `GET /api/v1/support/:id` - Ver apoio
- `POST /api/v1/support/:id/release` - Liberar (automático)

**Funcionalidades:**
- Integração com gateway de pagamento
- Custódia de 48 horas
- Liberação automática (cron job)
- Congelamento em caso de denúncia

---

### 8. Implementar APIs de Segurança (3.6) - 2-3 dias

**Arquivos a criar:**
- `backend/src/controllers/safetyController.ts`
- `backend/src/routes/safetyRoutes.ts`
- `backend/src/services/emergencyService.ts`

**Endpoints:**
- `POST /api/v1/safety/panic` - Botão de pânico
- `POST /api/v1/safety/report` - Denunciar usuário
- `GET /api/v1/safety/reports` - Ver denúncias (admin)
- `POST /api/v1/safety/ban` - Banir usuário (admin)

---

### 9. Implementar IA de Moderação (3.8) - 3-4 dias

**Arquivos a criar:**
- `backend/src/services/moderationService.ts`
- `backend/src/utils/aiModeration.ts`

**Funcionalidades:**
- Análise de mensagens em tempo real
- Detecção de palavras-chave
- Integração com API de IA (opcional)
- Flagging automático
- Banimento automático em casos graves

---

### 10. Integrar Frontend com Backend (3.9) - 3-5 dias

**Modificações necessárias:**
- Substituir `mockAPI` por chamadas reais
- Configurar axios/fetch
- Adicionar interceptors para JWT
- Tratamento de erros
- Loading states

**Arquivo a criar:**
- `src/services/api.js` - Cliente HTTP real

---

### 11. Testes e Deploy (3.10) - 5-7 dias

**Testes:**
- Testes unitários (Jest)
- Testes de integração
- Testes E2E (Playwright)

**Deploy:**
- Backend: Railway, Render, ou DigitalOcean
- Frontend: Vercel ou Netlify
- Banco de Dados: PlanetScale, Railway, ou servidor próprio

---

## ⏱️ Estimativa de Tempo Total

- **Backend APIs:** 15-20 dias
- **Integração:** 3-5 dias
- **Testes:** 3-5 dias
- **Deploy:** 2-3 dias

**Total: 23-33 dias (1-1.5 meses)**

---

## 🎯 Recomendação de Ordem

1. ✅ Setup do Backend (FEITO)
2. ✅ Banco de Dados (FEITO)
3. ⏳ Autenticação JWT (PRÓXIMO)
4. ⏳ APIs de Usuários
5. ⏳ APIs de Matching
6. ⏳ APIs de Chat (com WebSocket)
7. ⏳ APIs de Verificação
8. ⏳ APIs de Segurança
9. ⏳ APIs de Apoio Mensal
10. ⏳ IA de Moderação
11. ⏳ Integração Frontend
12. ⏳ Testes e Deploy

---

## 📞 Suporte

Se precisar de ajuda em qualquer etapa, consulte:
- `backend/README.md` - Documentação do backend
- `PROGRESS_SUMMARY.md` - Resumo completo do projeto
- Documentação do Prisma: https://www.prisma.io/docs
- Documentação do Express: https://expressjs.com

**Boa sorte! 🚀**

