# 📰 Sistema de Geração Automática de Artigos

**Gera automaticamente 15 artigos diários com imagens relevantes do Unsplash**

## ⚡ Setup Rápido (5 minutos)

### Passo 1: Configurar Chave de API
```bash
# Windows
setx ANTHROPIC_API_KEY "sk-ant-sua-chave-aqui"

# Mac/Linux
export ANTHROPIC_API_KEY="sk-ant-sua-chave-aqui"
```

### Passo 2: Testar Geração
```bash
node test-generation.js
```

Isto gera 3 artigos de teste com imagens e verifica se está tudo funcionando.

### Passo 3: Agendar Automação

**Windows:**
```bash
# Execute como Administrator
setup-windows-scheduler.bat
```

**Mac/Linux:**
```bash
chmod +x setup-linux-cron.sh
./setup-linux-cron.sh
```

## 🎯 Resultado

✅ A cada dia às 2:00 AM:
- 15 artigos são gerados automaticamente
- Cada um inclui uma imagem relevante do Unsplash
- Conteúdo de 900-1300 palavras via Claude
- Optimizado para SEO
- Tudo salvo em `content/posts/`

## 📁 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `daily-articles.txt` | Lista de 15 artigos a gerar diariamente |
| `generate-article.js` | Gerador de artigos individual |
| `automate-daily-articles.js` | Coordenador de automação |
| `setup-windows-scheduler.bat` | Setup para Windows |
| `setup-linux-cron.sh` | Setup para Mac/Linux |
| `test-generation.js` | Teste o sistema |
| `DAILY-GENERATION.md` | Documentação completa |

## 📊 Exemplo de Resultado

```
content/posts/health/como-dormir-melhor.md
├── Título: "Como Melhorar a Qualidade do Sono"
├── Imagem: https://images.unsplash.com/photo-xyz?w=800&q=80
├── Conteúdo: 1200 palavras
├── Tags: ["sono", "saúde", "produtividade", ...]
└── Data: Automática

content/posts/finance/investir-500-dolares.md
├── Título: "Investir seus Primeiros $500 Inteligentemente"
├── Imagem: https://images.unsplash.com/photo-abc?w=800&q=80
├── Conteúdo: 1150 palavras
├── Tags: ["investimento", "finanças", ...]
└── Data: Automática
```

## 🛠️ Scripts Disponíveis

```bash
# Gerar um artigo manual
npm run generate:article "Seu Título" health

# Gerar os 15 artigos diários
npm run generate:daily

# Iniciar automação agora
npm run automate:start

# Testar o sistema
node test-generation.js

# Ver logs
tail -f logs/articles-*.log
```

## 🔄 Fluxo Automático

```
2:00 AM
   ↓
automate-daily-articles.js executa
   ↓
Lê daily-articles.txt (15 artigos)
   ↓
Para cada artigo:
  • Claude gera conteúdo (900-1300 palavras)
  • Unsplash fornece imagem relevante
  • Frontmatter criado automaticamente
  • Arquivo MD salvo em content/posts/
   ↓
Log criado em logs/articles-2025-04-09.log
   ↓
✅ Completo
```

## 📸 Imagens Automáticas

O sistema garante que cada artigo receba uma imagem relevante:

- **Unsplash Source API**: +100 milhões de fotos
- **Correspondência de conteúdo**: Baseado no título e categoria
- **Resolução**: 800x450px (otimizado)
- **Sem API key**: Usa URLs diretas
- **Consistência**: Mesma imagem para mesmo título (ótimo para cache)

## 🐛 Troubleshooting

**"ANTHROPIC_API_KEY not set"**
```
Defina a variável de ambiente e reinicie
```

**"daily-articles.txt not found"**
```
Certifique-se que está na pasta raiz do projeto
```

**Imagens não aparecem**
```
O sistema tem fallback com gradients coloridos
Verifique os logs: logs/articles-YYYY-MM-DD.log
```

**Task Scheduler não executa**
```
Windows: Use "Run as Administrator"
Verifique que ANTHROPIC_API_KEY está em System variables
```

## 📈 Monitoramento

**Windows Task Scheduler:**
1. Abra Task Scheduler
2. Procure "InfoDaily Auto-Generate Articles"
3. Clique direito → "View Results"

**Mac/Linux:**
```bash
# Ver cron jobs
crontab -l

# Ver últimos logs
tail -f logs/articles-*.log
```

## 💡 Dicas

1. **Customize daily-articles.txt** com seus tópicos favoritos
2. **Execute testes frequentemente** com `node test-generation.js`
3. **Monitore logs** para garantir que tudo está funcionando
4. **Acompanhe o build** com `npm run build` para verificar erros

## 📖 Próximos Passos

1. ✅ Fazer setup das variáveis de ambiente
2. ✅ Executar `node test-generation.js`
3. ✅ Revisar artigos gerados em `content/posts/`
4. ✅ Executar setup do scheduler
5. ✅ Monitorar logs diários

---

**Documentação completa:** Veja `DAILY-GENERATION.md`
