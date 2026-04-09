# Daily Article Auto-Generation System

Gera automaticamente **15 artigos por dia** com imagens relevantes do Unsplash.

## Como Funciona

1. **daily-articles.txt** - Lista de 15 artigos (título + categoria) a gerar diariamente
2. **automate-daily-articles.js** - Script que coordena a geração e salva logs
3. **generate-article.js** - Gera conteúdo usando Claude + imagens via Unsplash

Cada artigo gerado inclui:
- ✅ Conteúdo de 900-1300 palavras (via Claude)
- ✅ Imagens relevantes do Unsplash (correspondentes ao título e categoria)
- ✅ Frontmatter com metadata
- ✅ Tags, authors, e datas automáticas
- ✅ Conteúdo otimizado para SEO

## Setup Rápido

### 1. Definir ANTHROPIC_API_KEY

**Windows:**
```cmd
setx ANTHROPIC_API_KEY "sk-ant-seu-chave-aqui"
```
(Reinicie o computador ou prompt depois)

**Mac/Linux:**
```bash
export ANTHROPIC_API_KEY="sk-ant-seu-chave-aqui"
# Adicione a ~/.bashrc ou ~/.zshrc para persistir
```

### 2. Agendar Automação

#### Windows (Task Scheduler)
```cmd
# Execute como Administrator
setup-windows-scheduler.bat
```

Isto cria uma tarefa agendada que:
- Executa diariamente às 2:00 AM
- Gera 15 artigos com imagens
- Salva logs em `logs/articles-YYYY-MM-DD.log`

#### Mac/Linux (Cron)
```bash
chmod +x setup-linux-cron.sh
./setup-linux-cron.sh
```

Isto cria um cron job que executa diariamente às 2:00 AM.

### 3. Testar Manualmente

```bash
# Gerar 15 artigos de uma vez
node generate-article.js --batch daily-articles.txt

# Ou gerar um único artigo
node generate-article.js "Seu Título Aqui" health
```

## Personalizar Articles Diários

Edite `daily-articles.txt` para mudar os artigos gerados:

```
# Health (2 articles)
Como Melhorar a Qualidade do Sono | health
5 Suplementos Respaldados por Ciência | health

# Finance (2 articles)
Investir seus Primeiros $500 Inteligentemente | finance
Como Reduzir suas Despesas Mensais | finance

# ... mais artigos
```

Formato: `Título | Categoria`

Categorias válidas:
- health
- finance
- technology
- life-hacks
- travel
- food
- business
- science
- relationships

## Monitorar Automação

### Windows
1. Abra Task Scheduler
2. Procure por "InfoDaily Auto-Generate Articles"
3. Clique direito → "View Results"

### Mac/Linux
```bash
# Ver cron jobs
crontab -l

# Ver logs
tail -f /tmp/infodaily-cron.log
# ou
tail -f logs/articles-YYYY-MM-DD.log
```

## Estrutura de Arquivos Gerados

```
content/posts/
├── health/
│   ├── como-melhorar-sono.md
│   └── 5-suplementos-ciencia.md
├── finance/
│   ├── investir-500-dolares.md
│   └── reduzir-despesas.md
└── ... (mais categorias)

logs/
├── articles-2025-04-09.log
├── articles-2025-04-10.log
└── ... (um por dia)
```

## Exemplo de Artigo Gerado

```markdown
---
title: "Como Melhorar a Qualidade do Sono"
excerpt: "Um guia científico para dormir melhor todas as noites."
date: "2025-04-09"
author: "Dr. Sarah Collins"
coverImage: "https://images.unsplash.com/photo-xyz?w=800&q=80"
tags: ["sono", "saúde", "produtividade", "bem-estar", "hábitos"]
---

O sono é tão crítico para a saúde quanto respirar...

## Como Dormir Melhor

A qualidade do sono afeta...

### Técnica 1: Rotina Consistente

Ir para cama no mesmo horário...
```

## Variáveis de Imagem

Cada artigo recebe uma imagem Unsplash relevante baseada em:
- Palavras-chave do título
- Categoria do artigo
- Seed aleatório (mas consistente)

O sistema garante que:
- ✅ Imagens correspondem ao conteúdo
- ✅ Mesma imagem para mesmo título (útil para cache)
- ✅ Sem API key necessária (usa Unsplash Source)
- ✅ Resoluções otimizadas (800x450px)

## Troubleshooting

### "ANTHROPIC_API_KEY not set"
```
Solução: Defina a ambiente variable e reinicie o computador/terminal
```

### "daily-articles.txt not found"
```
Solução: Certifique-se que está na pasta raiz do projeto
```

### "Generator failed"
```
Verifique logs em: logs/articles-YYYY-MM-DD.log
```

### Imagens não aparecem
```
O sistema usa Unsplash Source que já retorna imagens reais.
Se falhar, exibe um gradient colorido como fallback.
```

## Performance

- ⏱️ **Tempo por artigo:** ~20-30 segundos (dependendo da API)
- 📝 **15 artigos:** ~5-7 minutos total
- 🔄 **Horário recomendado:** 2:00 AM (off-peak)
- 💾 **Espaço por artigo:** ~15-25 KB

## Próximas Melhorias

- [ ] Usar fila de processamento para distribuir load
- [ ] Integrar com RSS feed
- [ ] Dashboard de monitoramento
- [ ] Alertas de falha por email
- [ ] Versionamento de artigos

---

**Suporte:** Confira `generate-article.js` para detalhes técnicos.
