# 🔗 NoJob - Guia de Integração Frontend-Backend

## 📋 Visão Geral

Este guia explica como migrar do `mockAPI.js` para a API real do backend.

---

## 🚀 Como Usar a API Real

### 1. **Configuração**

O arquivo `src/services/api.js` já está pronto para uso. Ele substitui completamente o `mockAPI.js`.

**Diferenças principais:**
- ✅ Chamadas HTTP reais ao backend
- ✅ Autenticação JWT automática
- ✅ Tratamento de erros
- ✅ Mesma interface do mockAPI (fácil migração)

### 2. **Migração de Código**

**ANTES (mockAPI):**
```javascript
import { authAPI } from '../services/mockAPI';

const user = await authAPI.login(email, password);
```

**DEPOIS (API real):**
```javascript
import { authAPI } from '../services/api';

const user = await authAPI.login(email, password);
```

**É só trocar o import!** A interface é idêntica.

---

## 📝 Exemplos de Uso

### Autenticação

```javascript
import { authAPI } from '../services/api';

// Registro
const userData = {
  email: 'user@example.com',
  password: 'senha123',
  name: 'Nome Completo',
  userType: 'WOMAN', // ou 'MAN'
  age: 25,
  location: 'São Paulo, SP',
  bio: 'Minha bio',
  photos: ['url1', 'url2'],
};

const result = await authAPI.register(userData);
// Token e usuário salvos automaticamente no localStorage

// Login
const user = await authAPI.login('user@example.com', 'senha123');

// Logout
await authAPI.logout();

// Obter usuário atual
const currentUser = await authAPI.getCurrentUser();
```

### Perfis e Usuários

```javascript
import { usersAPI } from '../services/api';

// Obter perfis para matching
const profiles = await usersAPI.getProfiles();

// Atualizar perfil
await usersAPI.updateProfile({
  name: 'Novo Nome',
  bio: 'Nova bio',
});

// Upload de foto
await usersAPI.uploadPhoto('https://url-da-foto.com/foto.jpg');

// Adicionar contato de emergência
await usersAPI.addEmergencyContact({
  name: 'Maria Silva',
  phone: '11999999999',
  relation: 'Mãe',
});
```

### Matching

```javascript
import { matchingAPI } from '../services/api';

// Dar like
const result = await matchingAPI.likeUser(userId);
if (result.matched) {
  console.log('É um match! 🎉');
}

// Passar
await matchingAPI.passUser(userId);

// Obter matches
const matches = await matchingAPI.getMatches();

// Desfazer match
await matchingAPI.unmatch(userId);
```

### Chat

```javascript
import { chatAPI } from '../services/api';

// Obter conversas
const conversations = await chatAPI.getConversations();

// Obter mensagens com um usuário
const messages = await chatAPI.getMessages(userId);

// Enviar mensagem
const message = await chatAPI.sendMessage(userId, 'Olá!');

// Marcar como lida
await chatAPI.markAsRead(messageId);
```

### Segurança

```javascript
import { safetyAPI } from '../services/api';

// Denunciar usuário
await safetyAPI.reportUser({
  reportedUserId: userId,
  category: 'HARASSMENT',
  description: 'Descrição da denúncia',
  evidence: ['url1', 'url2'],
});

// Botão de pânico
await safetyAPI.triggerPanic({
  latitude: -23.5505,
  longitude: -46.6333,
  reason: 'Emergência',
});

// Bloquear usuário
await safetyAPI.blockUser(userId);
```

### Apoio Mensal

```javascript
import { supportAPI } from '../services/api';

// Configurar apoio (homens)
await supportAPI.setupSupport(recipientId, 1000); // R$ 1000

// Obter apoios ativos
const supports = await supportAPI.getActiveSupport();

// Liberar fundos (mulheres, após 48h)
await supportAPI.releaseFunds(supportId);

// Verificar status
const status = await supportAPI.getSupportStatus(supportId);
console.log(`Horas restantes: ${status.hoursRemaining}`);
```

---

## 🔧 Tratamento de Erros

```javascript
try {
  const user = await authAPI.login(email, password);
} catch (error) {
  console.error('Erro no login:', error.message);
  // Mostrar mensagem de erro para o usuário
}
```

---

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_ENV=development
```

**Produção:**
```env
VITE_API_URL=https://api.nojob.com/api/v1
VITE_ENV=production
```

---

## 🔄 Migração Passo a Passo

### Passo 1: Testar Backend

```bash
cd backend
npm run dev
```

Verifique se está rodando em `http://localhost:3001`

### Passo 2: Atualizar Imports

Em cada arquivo que usa `mockAPI`, troque:

```javascript
// ANTES
import { authAPI } from '../services/mockAPI';

// DEPOIS
import { authAPI } from '../services/api';
```

### Passo 3: Testar Funcionalidades

1. Registro de usuário
2. Login
3. Swipe de perfis
4. Match
5. Chat
6. Denúncia
7. Apoio mensal

### Passo 4: Remover mockAPI (Opcional)

Após confirmar que tudo funciona, você pode:
- Renomear `mockAPI.js` para `mockAPI.js.backup`
- Ou deletar completamente

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Causa:** Backend não está rodando ou URL incorreta.

**Solução:**
```bash
cd backend
npm run dev
```

### Erro: "Invalid or expired token"

**Causa:** Token JWT expirado.

**Solução:**
```javascript
// Fazer login novamente
await authAPI.login(email, password);
```

### Erro: CORS

**Causa:** Frontend e backend em domínios diferentes.

**Solução:** Já configurado no backend (`cors: { origin: 'http://localhost:5173' }`)

---

## 📊 Checklist de Migração

- [ ] Backend rodando (`npm run dev` em `/backend`)
- [ ] Arquivo `.env` criado com `VITE_API_URL`
- [ ] Imports atualizados de `mockAPI` para `api`
- [ ] Registro funcionando
- [ ] Login funcionando
- [ ] Perfis carregando
- [ ] Matching funcionando
- [ ] Chat funcionando
- [ ] Denúncias funcionando
- [ ] Apoio mensal funcionando

---

## 🎯 Próximos Passos

1. **Testar todas as funcionalidades** com a API real
2. **Implementar Socket.IO** para chat em tempo real
3. **Adicionar upload de imagens** (AWS S3, Cloudinary, etc.)
4. **Integrar gateway de pagamento** real
5. **Deploy** do backend e frontend

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend (terminal onde rodou `npm run dev`)
2. Verifique o Console do navegador (F12)
3. Consulte `TROUBLESHOOTING.md`

---

**Data:** 2025-11-20  
**Status:** ✅ Pronto para uso

