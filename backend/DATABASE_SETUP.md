# 🗄️ NoJob - Database Setup Complete

## ✅ Status: CONFIGURADO E FUNCIONANDO

O banco de dados MariaDB remoto foi configurado com sucesso!

---

## 📊 Informações do Banco de Dados

**Servidor Remoto:**
- **Host:** 185.213.81.154
- **Porta:** 3306
- **Database:** u164938089_myred
- **Usuário:** u164938089_myred
- **Senha:** Myred123# (o # faz parte da senha)

**Connection String:**
```
mysql://u164938089_myred:Myred123%23@185.213.81.154:3306/u164938089_myred
```
*Nota: O # na senha é URL-encoded como %23*

---

## 🏗️ Tabelas Criadas

O schema Prisma criou as seguintes tabelas no banco:

1. **User** - Usuários (homens e mulheres)
2. **Verification** - Verificações KYC
3. **Like** - Likes e matches
4. **Message** - Mensagens do chat
5. **MonthlySupport** - Apoio mensal (custódia 48h)
6. **Report** - Denúncias
7. **Meeting** - Encontros seguros
8. **Goal** - Metas de recomeço
9. **Questionnaire** - Questionários de onboarding
10. **EmergencyContact** - Contatos de emergência
11. **PanicAlert** - Alertas de pânico

---

## 🌱 Dados de Teste (Seed)

O banco foi populado com dados de teste:

### Usuários Mulheres:
- **Marina Silva** (marina@teste.com)
  - 24 anos, São Paulo
  - Senha: senha123

- **Juliana Costa** (juliana@teste.com)
  - 28 anos, São Paulo
  - Senha: senha123

### Usuários Homens:
- **Carlos Eduardo** (carlos@teste.com)
  - 35 anos, São Paulo
  - Verificado ✅
  - Senha: senha123

- **Roberto Alves** (roberto@teste.com)
  - 42 anos, Rio de Janeiro
  - Verificado ✅
  - Senha: senha123

### Dados Adicionais:
- 1 match entre Juliana e Carlos
- 2 mensagens trocadas
- 1 contato de emergência
- 1 verificação completa (Carlos)

---

## 🔧 Comandos Úteis

### Visualizar Banco de Dados
```bash
cd backend
npm run prisma:studio
# Abre em http://localhost:5555
```

### Atualizar Schema
```bash
# Após modificar prisma/schema.prisma
npm run prisma:push
```

### Resetar Banco (CUIDADO!)
```bash
# Apaga todos os dados
npx prisma db push --force-reset
```

### Popular Novamente
```bash
npm run prisma:seed
```

### Gerar Prisma Client
```bash
npm run prisma:generate
```

---

## 📝 Notas Importantes

### Shadow Database
O Prisma Migrate precisa de um "shadow database" para validar migrations, mas o usuário do banco não tem permissão para criar databases.

**Solução:** Usamos `prisma db push` ao invés de `prisma migrate dev`.

**Diferenças:**
- `prisma migrate dev` - Cria arquivos de migration, usa shadow database
- `prisma db push` - Aplica mudanças diretamente, sem shadow database

### Quando Usar Cada Comando

**Use `prisma db push`:**
- Durante desenvolvimento
- Quando não tem permissão para shadow database
- Para prototipagem rápida

**Use `prisma migrate dev`:**
- Em produção
- Quando precisa de histórico de migrations
- Quando tem controle total do banco

---

## 🔐 Segurança

### Senha no .env
A senha contém o caractere `#` que precisa ser URL-encoded:
- **Senha real:** `Myred123#`
- **Na URL:** `Myred123%23`

### Arquivo .env
O arquivo `.env` está no `.gitignore` e **NÃO** deve ser commitado.

---

## 🧪 Testando a Conexão

### Via Prisma Studio
```bash
npm run prisma:studio
```
Se abrir sem erros, a conexão está OK!

### Via Código
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco!');
    
    const users = await prisma.user.findMany();
    console.log(`📊 ${users.length} usuários no banco`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testConnection();
```

---

## 📊 Próximos Passos

Agora que o banco está configurado, podemos:

1. ✅ Criar APIs de autenticação (JWT)
2. ✅ Criar APIs de usuários
3. ✅ Criar APIs de matching
4. ✅ Criar APIs de chat
5. ✅ Integrar frontend com backend real

---

## 🆘 Troubleshooting

### Erro de Conexão
```
Error: P1001: Can't reach database server
```
**Solução:** Verifique se o host e porta estão corretos no .env

### Erro de Autenticação
```
Error: P1000: Authentication failed
```
**Solução:** Verifique usuário e senha no .env (lembre do %23 para #)

### Erro de Permissão
```
Error: P3014: Shadow database error
```
**Solução:** Use `prisma db push` ao invés de `prisma migrate dev`

---

**Data de Setup:** 2025-11-20  
**Status:** ✅ Operacional  
**Prisma Version:** 5.22.0

