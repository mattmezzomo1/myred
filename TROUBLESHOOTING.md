# 🔧 NoJob - Troubleshooting Guide

## Problemas Comuns e Soluções

### 🔄 Loop Infinito entre Páginas

**Problema:** A aplicação fica alternando entre Home e Onboarding automaticamente.

**Causa:** Conflito entre verificações de autenticação e onboarding.

**Solução:**
1. Abra o Console do navegador (F12)
2. Vá para a aba "Application" > "Local Storage"
3. Limpe todos os dados do localStorage
4. Recarregue a página (F5)

**Ou use o Console:**
```javascript
localStorage.clear();
location.reload();
```

---

### 🚫 Não Consigo Acessar a Home

**Problema:** Sempre sou redirecionado para Onboarding ou ChooseType.

**Causa:** Não há usuário logado no sistema.

**Solução:**
1. Complete o fluxo de registro:
   - Onboarding (slides introdutórios)
   - ChooseType (escolher tipo de usuário)
   - RegisterWoman ou RegisterMan (preencher dados)
2. Após o registro, você será redirecionado para Home

**Para testar rapidamente:**
```javascript
// No Console do navegador
localStorage.setItem('hasSeenOnboarding', 'true');
localStorage.setItem('currentUser', JSON.stringify({
  id: '1',
  name: 'Teste',
  email: 'teste@teste.com',
  userType: 'woman', // ou 'man'
  age: 25,
  location: 'São Paulo, SP'
}));
localStorage.setItem('authToken', 'mock-token-123');
location.reload();
```

---

### 📱 Página em Branco

**Problema:** A página não carrega nada, apenas tela branca.

**Solução:**
1. Abra o Console (F12) e verifique erros
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Limpe o localStorage:
```javascript
localStorage.clear();
location.reload();
```

---

### 🔐 Logout Não Funciona

**Problema:** Após fazer logout, ainda vejo dados do usuário.

**Solução:**
O logout deve limpar os dados corretamente. Se não funcionar:
```javascript
localStorage.removeItem('currentUser');
localStorage.removeItem('authToken');
location.href = '/ChooseType';
```

---

### 🎨 Estilos Não Carregam

**Problema:** A página aparece sem estilos, apenas texto.

**Solução:**
1. Verifique se o servidor está rodando: `npm run dev`
2. Limpe o cache: Ctrl+Shift+Delete
3. Reinstale dependências:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### 🔄 Hot Reload Não Funciona

**Problema:** Mudanças no código não aparecem automaticamente.

**Solução:**
1. Pare o servidor (Ctrl+C)
2. Limpe o cache do Vite:
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### 📊 Dados Mockados Não Aparecem

**Problema:** Perfis, matches ou mensagens não aparecem.

**Solução:**
1. Verifique se está logado
2. Verifique o Console por erros
3. Verifique se `mockAPI.js` e `mockData.js` existem em `src/services/`

---

### 🚀 Erro ao Iniciar o Projeto

**Problema:** `npm run dev` retorna erro.

**Solução:**
```bash
# Limpar tudo
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Verificar versão do Node (deve ser 18+)
node --version

# Se necessário, atualizar Node.js
```

---

### 🗄️ Erro no Backend (Prisma)

**Problema:** Erro ao rodar migrations ou gerar Prisma Client.

**Solução:**
```bash
cd backend

# Limpar Prisma
rm -rf node_modules/.prisma
rm -rf prisma/migrations

# Reinstalar
npm install

# Gerar Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate
```

---

### 🔍 Como Debugar

**Console do Navegador:**
1. Pressione F12
2. Vá para a aba "Console"
3. Veja erros em vermelho
4. Use `console.log()` no código para debugar

**React DevTools:**
1. Instale a extensão React DevTools
2. Abra F12 > aba "Components"
3. Inspecione estado dos componentes

**Network Tab:**
1. F12 > aba "Network"
2. Veja requisições HTTP
3. Verifique erros de API

---

## 🧪 Comandos Úteis para Testes

### Resetar Tudo
```javascript
// No Console do navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Criar Usuário de Teste (Mulher)
```javascript
localStorage.setItem('hasSeenOnboarding', 'true');
localStorage.setItem('currentUser', JSON.stringify({
  id: 'test-woman-1',
  name: 'Maria Teste',
  email: 'maria@teste.com',
  userType: 'woman',
  age: 25,
  location: 'São Paulo, SP',
  bio: 'Perfil de teste',
  photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400']
}));
localStorage.setItem('authToken', 'mock-token-woman');
location.href = '/Home';
```

### Criar Usuário de Teste (Homem)
```javascript
localStorage.setItem('hasSeenOnboarding', 'true');
localStorage.setItem('currentUser', JSON.stringify({
  id: 'test-man-1',
  name: 'João Teste',
  email: 'joao@teste.com',
  userType: 'man',
  age: 30,
  location: 'São Paulo, SP',
  bio: 'Perfil de teste',
  photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
  verified: true
}));
localStorage.setItem('authToken', 'mock-token-man');
location.href = '/Home';
```

### Ver Dados Salvos
```javascript
console.log('Current User:', JSON.parse(localStorage.getItem('currentUser')));
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('Has Seen Onboarding:', localStorage.getItem('hasSeenOnboarding'));
```

---

## 📞 Ainda com Problemas?

1. Verifique os arquivos de documentação:
   - `README.md` - Instruções gerais
   - `PROGRESS_SUMMARY.md` - Status do projeto
   - `NEXT_STEPS.md` - Próximos passos

2. Verifique os logs:
   - Console do navegador (F12)
   - Terminal onde o `npm run dev` está rodando

3. Tente o fluxo completo do zero:
   - Limpe localStorage
   - Acesse `/` (Landing)
   - Complete Onboarding
   - Escolha tipo de usuário
   - Complete registro
   - Acesse Home

---

**Última atualização:** 2025-11-20

