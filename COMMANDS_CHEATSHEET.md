# 📝 NoJob - Comandos Úteis

## 🎨 Frontend (React + Vite)

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Acessar
- **Dev:** http://localhost:5173
- **Preview:** http://localhost:4173

---

## ⚙️ Backend (Node.js + TypeScript + Prisma)

### Setup Inicial
```bash
# Navegar para pasta do backend
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas credenciais
# DATABASE_URL, JWT_SECRET, etc.
```

### Prisma (Banco de Dados)
```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Abrir Prisma Studio (GUI do banco)
npm run prisma:studio

# Reset do banco (CUIDADO!)
npx prisma migrate reset

# Seed do banco (se configurado)
npx prisma db seed
```

### Desenvolvimento
```bash
# Rodar em modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start

# Lint
npm run lint

# Testes
npm test
```

### Acessar
- **API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Docs:** http://localhost:3001/api/v1
- **Prisma Studio:** http://localhost:5555

---

## 🗄️ MariaDB / MySQL

### Comandos Locais
```bash
# Conectar ao banco
mysql -u usuario -p

# Criar banco de dados
CREATE DATABASE nojob_db;

# Usar banco
USE nojob_db;

# Ver tabelas
SHOW TABLES;

# Ver estrutura de tabela
DESCRIBE User;

# Backup
mysqldump -u usuario -p nojob_db > backup.sql

# Restore
mysql -u usuario -p nojob_db < backup.sql
```

---

## 🐳 Docker (Opcional)

### MariaDB com Docker
```bash
# Rodar MariaDB em container
docker run --name nojob-mariadb \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=nojob_db \
  -e MYSQL_USER=nojob_user \
  -e MYSQL_PASSWORD=nojob_pass \
  -p 3306:3306 \
  -d mariadb:latest

# Ver logs
docker logs nojob-mariadb

# Parar container
docker stop nojob-mariadb

# Iniciar container
docker start nojob-mariadb

# Remover container
docker rm nojob-mariadb
```

### Backend com Docker
```bash
# Build da imagem
docker build -t nojob-backend .

# Rodar container
docker run -p 3001:3001 --env-file .env nojob-backend
```

---

## 🔧 Git

### Comandos Úteis
```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adiciona autenticação JWT"

# Push
git push origin main

# Pull
git pull origin main

# Criar branch
git checkout -b feature/nome-da-feature

# Merge
git checkout main
git merge feature/nome-da-feature

# Ver histórico
git log --oneline
```

### Convenção de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas gerais
```

---

## 📦 NPM / Package Management

### Adicionar Dependências
```bash
# Produção
npm install nome-do-pacote

# Desenvolvimento
npm install -D nome-do-pacote

# Global
npm install -g nome-do-pacote

# Remover
npm uninstall nome-do-pacote

# Atualizar
npm update

# Limpar cache
npm cache clean --force
```

---

## 🧪 Testes

### Jest (Backend)
```bash
# Rodar todos os testes
npm test

# Rodar com coverage
npm test -- --coverage

# Rodar em watch mode
npm test -- --watch

# Rodar teste específico
npm test -- userController.test.ts
```

---

## 🚀 Deploy

### Vercel (Frontend)
```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Railway (Backend)
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Deploy
railway up
```

---

## 🔍 Debug

### Backend
```bash
# Rodar com debug
node --inspect dist/index.js

# Com tsx
tsx --inspect src/index.ts
```

### Logs
```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log

# Limpar logs
rm logs/*.log
```

---

## 📊 Monitoramento

### PM2 (Produção)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start dist/index.js --name nojob-backend

# Ver status
pm2 status

# Ver logs
pm2 logs

# Restart
pm2 restart nojob-backend

# Stop
pm2 stop nojob-backend

# Monitoramento
pm2 monit
```

---

## 🛠️ Troubleshooting

### Limpar tudo e recomeçar
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Resetar banco de dados
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

### Porta em uso
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📚 Recursos Úteis

- **Prisma Docs:** https://www.prisma.io/docs
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Socket.IO Docs:** https://socket.io/docs

