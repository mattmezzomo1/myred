# ✅ NoJob - Checklist de Testes

## 🎯 Como Testar o Sistema Completo

Este documento guia você pelos testes de todas as funcionalidades implementadas.

---

## 🚀 Preparação

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```
✅ Verificar: `Server running on port 3001`

### 2. Iniciar Frontend
```bash
# Na raiz do projeto
npm run dev
```
✅ Verificar: `http://localhost:5173`

### 3. (Opcional) Abrir Prisma Studio
```bash
cd backend
npm run prisma:studio
```
✅ Verificar: `http://localhost:5555`

---

## 📋 Testes Funcionais

### 1. Autenticação

#### 1.1 Registro de Mulher
- [ ] Acessar `http://localhost:5173`
- [ ] Clicar em "Sou Mulher"
- [ ] Preencher formulário de registro
- [ ] Verificar redirecionamento para Home
- [ ] Verificar token salvo no localStorage

#### 1.2 Registro de Homem
- [ ] Limpar localStorage (`localStorage.clear()`)
- [ ] Clicar em "Sou Homem"
- [ ] Preencher formulário de registro
- [ ] Verificar redirecionamento para Home

#### 1.3 Login
- [ ] Fazer logout
- [ ] Tentar login com credenciais corretas
- [ ] Verificar sucesso
- [ ] Tentar login com senha errada
- [ ] Verificar mensagem de erro

#### 1.4 Logout
- [ ] Clicar em logout no perfil
- [ ] Verificar redirecionamento para ChooseType
- [ ] Verificar localStorage limpo

---

### 2. Perfis e Usuários

#### 2.1 Visualizar Perfis
- [ ] Fazer login como mulher
- [ ] Ver perfis de homens no Home
- [ ] Verificar fotos, nome, idade, bio

#### 2.2 Editar Perfil
- [ ] Ir para Profile
- [ ] Editar nome, bio, localização
- [ ] Salvar
- [ ] Verificar atualização

#### 2.3 Upload de Fotos
- [ ] Adicionar URL de foto
- [ ] Verificar foto aparecendo
- [ ] Deletar foto
- [ ] Verificar remoção

#### 2.4 Contatos de Emergência
- [ ] Adicionar contato de emergência
- [ ] Verificar salvamento
- [ ] Deletar contato
- [ ] Verificar remoção

---

### 3. Sistema de Matching

#### 3.1 Like/Pass
- [ ] Fazer login como mulher
- [ ] Dar like em um homem
- [ ] Dar pass em outro
- [ ] Verificar perfil seguinte aparece

#### 3.2 Match
- [ ] Fazer login como homem
- [ ] Dar like na mulher que deu like em você
- [ ] Verificar notificação de match
- [ ] Verificar match aparece na lista

#### 3.3 Unmatch
- [ ] Ir para lista de matches
- [ ] Desfazer match
- [ ] Verificar remoção da lista

---

### 4. Chat

#### 4.1 Enviar Mensagem
- [ ] Abrir chat com um match
- [ ] Enviar mensagem
- [ ] Verificar mensagem aparece

#### 4.2 Receber Mensagem
- [ ] Fazer login com outro usuário
- [ ] Enviar mensagem de volta
- [ ] Verificar mensagem recebida

#### 4.3 Marcar como Lida
- [ ] Abrir mensagem não lida
- [ ] Verificar marcação automática

#### 4.4 Deletar Mensagem
- [ ] Deletar uma mensagem
- [ ] Verificar remoção

#### 4.5 Moderação de Conteúdo
- [ ] Tentar enviar mensagem com palavrão
- [ ] Verificar se é bloqueada ou flagged
- [ ] Verificar log no backend

---

### 5. Segurança

#### 5.1 Denúncia
- [ ] Abrir perfil de um usuário
- [ ] Clicar em "Denunciar"
- [ ] Escolher categoria
- [ ] Adicionar descrição
- [ ] Enviar
- [ ] Verificar no Prisma Studio (tabela Report)

#### 5.2 Botão de Pânico
- [ ] Clicar no botão de pânico (canto inferior direito)
- [ ] Permitir geolocalização
- [ ] Confirmar acionamento
- [ ] Verificar no Prisma Studio (tabela PanicAlert)
- [ ] Verificar log no backend

#### 5.3 Bloquear Usuário
- [ ] Bloquear um usuário
- [ ] Verificar unmatch automático
- [ ] Verificar mensagens deletadas
- [ ] Tentar enviar mensagem (deve falhar)

#### 5.4 Desbloquear Usuário
- [ ] Desbloquear usuário
- [ ] Verificar pode dar like novamente

---

### 6. Apoio Mensal

#### 6.1 Configurar Apoio (Homem)
- [ ] Fazer login como homem
- [ ] Ir para MonthlySupport
- [ ] Configurar apoio para uma mulher
- [ ] Definir valor (ex: R$ 1000)
- [ ] Confirmar
- [ ] Verificar no Prisma Studio

#### 6.2 Visualizar Status (Mulher)
- [ ] Fazer login como mulher
- [ ] Ir para MonthlySupport
- [ ] Ver apoio recebido
- [ ] Verificar timer de 48h
- [ ] Verificar horas restantes

#### 6.3 Liberar Fundos (Mulher)
- [ ] Esperar 48h OU
- [ ] Modificar `createdAt` no banco para 3 dias atrás
- [ ] Clicar em "Liberar Fundos"
- [ ] Verificar sucesso
- [ ] Verificar `releasedAt` no banco

#### 6.4 Cancelar Apoio
- [ ] Cancelar apoio
- [ ] Verificar status = CANCELLED

---

### 7. Verificação KYC

#### 7.1 Upload de Documento
- [ ] Ir para Verification
- [ ] Upload URL de documento
- [ ] Avançar

#### 7.2 Selfie
- [ ] Upload URL de selfie
- [ ] Avançar

#### 7.3 Vídeo
- [ ] Upload URL de vídeo
- [ ] Finalizar
- [ ] Verificar no Prisma Studio

#### 7.4 Selo de Verificação
- [ ] Verificar selo "Homem de Valor" no perfil
- [ ] Verificar badge nos cards

---

### 8. Outras Funcionalidades

#### 8.1 Onboarding
- [ ] Limpar localStorage
- [ ] Acessar site
- [ ] Ver slides de onboarding
- [ ] Avançar todos
- [ ] Verificar redirecionamento

#### 8.2 Questionário de Valores
- [ ] Responder questionário
- [ ] Salvar respostas
- [ ] Verificar no banco

#### 8.3 Plano de Recomeço (Mulher)
- [ ] Fazer login como mulher
- [ ] Ir para RestartPlan
- [ ] Adicionar objetivos
- [ ] Marcar como concluído
- [ ] Deletar objetivo

#### 8.4 Encontro Seguro
- [ ] Agendar encontro
- [ ] Fazer check-in
- [ ] Verificar timer de segurança

---

## 🔍 Testes de API (Postman/Insomnia)

### Setup
1. Importar collection (criar se necessário)
2. Base URL: `http://localhost:3001/api/v1`

### Endpoints para Testar

#### Auth
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /auth/me
PUT /auth/password
```

#### Users
```
GET /users/profiles
GET /users/:id
PUT /users/profile
POST /users/photos
DELETE /users/photos/:index
POST /users/emergency-contact
DELETE /users/emergency-contact/:id
DELETE /users/account
```

#### Matching
```
POST /matching/like/:userId
POST /matching/pass/:userId
GET /matching/matches
DELETE /matching/unmatch/:userId
```

#### Chat
```
GET /chat/conversations
GET /chat/:userId/messages
POST /chat/:userId/messages
PUT /chat/messages/:messageId/read
DELETE /chat/messages/:messageId
```

#### Safety
```
POST /safety/report
POST /safety/panic
POST /safety/block/:userId
DELETE /safety/block/:userId
GET /safety/blocked
```

#### Support
```
POST /support/setup
GET /support/active
POST /support/:supportId/release
POST /support/:supportId/cancel
GET /support/:supportId/status
GET /support/history
```

---

## 🐛 Testes de Erro

### 1. Autenticação
- [ ] Tentar acessar rota protegida sem token
- [ ] Tentar usar token expirado
- [ ] Tentar usar token inválido

### 2. Validação
- [ ] Enviar dados inválidos no registro
- [ ] Enviar email duplicado
- [ ] Enviar campos vazios

### 3. Permissões
- [ ] Mulher tentar configurar apoio (deve falhar)
- [ ] Homem tentar liberar fundos (deve falhar)
- [ ] Tentar deletar mensagem de outro usuário

### 4. Moderação
- [ ] Enviar mensagem com conteúdo impróprio
- [ ] Verificar bloqueio/flag
- [ ] Verificar log

---

## ✅ Checklist Final

- [ ] Todos os endpoints funcionando
- [ ] Autenticação JWT funcionando
- [ ] Matching funcionando
- [ ] Chat funcionando
- [ ] Moderação funcionando
- [ ] Apoio mensal funcionando
- [ ] Verificação funcionando
- [ ] Segurança funcionando
- [ ] Sem erros no console
- [ ] Sem erros no backend
- [ ] Dados persistindo no banco

---

## 📊 Resultado Esperado

✅ **100% dos testes passando**  
✅ **Sistema totalmente funcional**  
✅ **Pronto para deploy**

---

**Boa sorte nos testes! 🚀**

