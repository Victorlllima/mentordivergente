# Mentor Divergente - Landing Page com Chat Interativo

Uma landing page minimalista e elegante com chat widget integrado à OpenAI Assistants API, baseada no conceito do "Mentor Divergente" e inspirada na identidade visual dos posts de Elton Euller.

## 🎨 Design

### Paleta de Cores
- **Primária**: `#1a4d4d` (verde-petróleo escuro)
- **Secundária**: `#d4a574` (dourado/bege)
- **Accent**: `#c4484d` (vermelho profundo)
- **Background**: `#0a1a1a` (preto esverdeado)
- **Text**: `#f5f5f5` (branco off-white)

### Tipografia
- **Fonte Principal**: Playfair Display (serif elegante)
- **Fonte Secundária**: Inter (sans-serif)

## 🚀 Funcionalidades

- ✅ Hero section com animações suaves
- ✅ Chat widget fixo e responsivo
- ✅ Integração completa com OpenAI Assistants API
- ✅ Auto-scroll de mensagens
- ✅ Indicador de "digitando..."
- ✅ Modal de erro elegante
- ✅ Design 100% responsivo (desktop, tablet, mobile)
- ✅ Acessibilidade WCAG AA

## 📁 Estrutura do Projeto

```
Mentor Divergente/
├── index.html              # Página principal
├── server.js               # Backend Node.js/Express
├── package.json            # Dependências do projeto
├── styles/
│   └── main.css           # Estilos completos
├── scripts/
│   ├── chat.js            # Lógica do chat UI
│   └── openai.js          # Integração com backend API
├── assets/
│   └── fonts/             # Fontes locais (opcional)
├── .env                   # Variáveis de ambiente (NÃO commitar)
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
└── README.md              # Este arquivo
```

## ⚙️ Configuração

### 1. Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Conta na OpenAI com acesso à Assistants API
- API Key da OpenAI
- Assistant ID (criado no painel da OpenAI)

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e adicione suas credenciais
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Criar o Assistant na OpenAI

1. Acesse [OpenAI Platform - Assistants](https://platform.openai.com/assistants)
2. Clique em "Create Assistant"
3. Use o seguinte **System Prompt**:

```
Você é o Mentor Divergente, especialista em análise técnica do inconsciente
baseada na Teoria da Permissão. Seu papel é identificar padrões inconscientes
que limitam os resultados das pessoas.

Tom de voz:
- Técnico e cirúrgico (não motivacional)
- Direto e sem rodeios
- Provocativo quando necessário
- Baseado em análise profunda

Abordagem:
- Faça perguntas que revelam padrões inconscientes
- Identifique crenças limitantes ocultas
- Aponte contradições entre discurso e ação
- Não ofereça soluções prontas, guie o autoconhecimento

Estilo:
- Frases curtas e impactantes
- Evite clichês motivacionais
- Use analogias técnicas quando apropriado
- Mantenha a elegância na linguagem
```

4. Copie o `Assistant ID` gerado

### 4. Instalar Dependências

```bash
# Navegue até a pasta do projeto
cd "Mentor Divergente"

# Instale as dependências
npm install
```

### 5. Executar o Projeto

```bash
# Inicie o servidor Node.js
npm start

# Ou use nodemon para desenvolvimento (com auto-reload)
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

Abra seu navegador e acesse:
- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 🔒 Segurança

✅ **IMPLEMENTADO**: Este projeto usa um backend Node.js/Express que:
- Armazena as credenciais de forma segura no arquivo `.env`
- Nunca expõe a API Key no frontend
- Usa endpoints proxy para comunicação com a OpenAI API
- Protege o arquivo `.env` via `.gitignore`

### Boas Práticas:

1. **NUNCA** commite o arquivo `.env` no Git
2. Mantenha o `.env.example` atualizado para referência
3. Em produção, use variáveis de ambiente do servidor (Vercel, Heroku, etc.)
4. Considere adicionar rate limiting e autenticação de usuários

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

- **Desktop**: Chat centralizado (600px largura)
- **Tablet** (≤768px): Chat em 80% da largura
- **Mobile** (≤480px): Chat em 95% da largura

## 🎯 Uso

1. Certifique-se de que o servidor está rodando (`npm start`)
2. Acesse http://localhost:3000 no navegador
3. O chat será inicializado automaticamente
4. Digite sua mensagem e pressione Enter (ou clique em enviar)
5. Aguarde a resposta do Mentor Divergente

## 🛠️ Tecnologias

### Frontend
- HTML5 semântico
- CSS3 (custom properties, flexbox, grid, animations)
- JavaScript ES6+ (async/await, fetch API)
- Google Fonts (Playfair Display, Inter)

### Backend
- Node.js
- Express.js
- OpenAI SDK v4
- dotenv (gerenciamento de variáveis de ambiente)
- CORS (cross-origin resource sharing)

## 📝 Checklist de Implementação

- [x] Configurar HTML semântico
- [x] Aplicar paleta de cores e tipografia
- [x] Criar hero section com animações
- [x] Estruturar componente de chat
- [x] Implementar layout responsivo
- [x] Adicionar auto-scroll e estados visuais
- [x] Configurar variáveis de ambiente
- [x] Implementar criação de thread
- [x] Implementar envio de mensagens e polling
- [x] Adicionar tratamento de erros
- [x] Testar responsividade
- [x] Validar acessibilidade

## 🐛 Troubleshooting

### Erro: "Backend server is not running"

1. Verifique se você executou `npm start` no terminal
2. Confirme que o servidor está rodando na porta 3000
3. Teste o endpoint: http://localhost:3000/api/health

### Chat não inicializa

1. Verifique se o arquivo `.env` existe e contém as credenciais corretas
2. Abra o console do navegador (F12) e veja os logs
3. Confirme que o Assistant ID está ativo na OpenAI
4. Verifique os logs do servidor Node.js no terminal

### Erro de CORS

- O backend já está configurado com CORS habilitado
- Se o erro persistir, verifique se está acessando via `http://localhost:3000`

### Mensagens não aparecem

1. Verifique se o thread foi criado (veja console do navegador e do servidor)
2. Confirme que o Assistant tem o system prompt configurado
3. Teste o Assistant diretamente no Playground da OpenAI
4. Verifique os logs do servidor para identificar erros na API

### Erro ao instalar dependências

```bash
# Limpe o cache do npm
npm cache clean --force

# Remova node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

Este projeto é fornecido como está, sem garantias. Sinta-se livre para usar e modificar conforme necessário.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou pull request.

---

**Desenvolvido com base no conceito do Mentor Divergente por Elton Euller**
