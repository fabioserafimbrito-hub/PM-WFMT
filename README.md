# Walter FMT | Plant Manager Command Cockpit

App iOS/PWA para GitHub Pages baseada na Bíblia do Plant Manager Walter FMT V4.

A app não é apenas um gerador de prompts. É um cockpit de checkpoints que obriga a comandar por:

**Número → Desvio → Ação → Dono → Prazo → Fecho**

## Funcionalidades

- Agenda semanal estilo Outlook.
- Checkpoints diários: check-in, Daily KPI, recalibração, fecho do dia e fecho semanal.
- Reuniões guiadas por playbook: PMO/Planeamento, Engenharia, Desenho, Operações, Soft/Hard/PCD, Manutenção, Tool Management, Tool Services & Logistics, VP e Alinhamento Walter FMT.
- Tópicos fixos da Bíblia + tópicos recorrentes editáveis.
- KPIs com validação Lázaro: KPI vermelho exige ação, dono e prazo.
- Ações com dono, prazo, prioridade, estado e impacto.
- Fecho obrigatório: decisão, dono nominal, prazo, indicador de fecho e próxima revisão.
- Ata Lázaro automática.
- Relatório executivo automático.
- Email/follow-up automático.
- Radar cultural: ownership, dados primeiro, direção única, “não é comigo”, vermelho sem plano, conflitos, dependência de heróis.
- Exportação/importação JSON para guardar histórico.
- Funcionamento offline após primeira abertura.

## Como publicar no GitHub Pages

1. Cria um repositório no GitHub, por exemplo: `fmt-command-cockpit`.
2. Faz upload de todos os ficheiros deste ZIP para a raiz do repositório.
3. Vai a **Settings → Pages**.
4. Em **Build and deployment**, escolhe **Deploy from a branch**.
5. Seleciona o branch `main` e a pasta `/root`.
6. Aguarda o link público do GitHub Pages.

## Como instalar no iPhone

1. Abre o link do GitHub Pages no Safari do iPhone.
2. Toca no botão **Partilhar**.
3. Escolhe **Adicionar ao ecrã principal**.
4. Dá o nome `FMT Cockpit`.
5. Abre pelo ícone criado.

## Como atualizar tópicos fixos da Bíblia

Editar o ficheiro:

```text
data/bible-config.js
```

Dentro deste ficheiro podes alterar:

- agenda semanal;
- checkpoints;
- perguntas de comando;
- tópicos fixos;
- áreas de responsabilidade;
- sinais culturais;
- regras de validação.

## Como adicionar tópicos sem mexer no código

Dentro da app:

1. Abre o separador **Config**.
2. Escolhe o checkpoint.
3. Escreve o tópico recorrente.
4. Clica em **Adicionar tópico**.

Esse tópico passa a aparecer automaticamente quando abrires esse checkpoint.

## Dados e segurança

Esta versão guarda dados no **localStorage** do browser do dispositivo. Ou seja:

- os dados ficam no iPhone/browser;
- não há servidor;
- não há base de dados externa;
- não há API key;
- não envia dados para fora.

Para uso empresarial avançado, a próxima versão pode ligar a SharePoint, Outlook, Teams, iCloud, Supabase, Firebase ou um backend interno.

## Estrutura dos ficheiros

```text
index.html
styles.css
app.js
manifest.webmanifest
service-worker.js
data/bible-config.js
icons/icon-192.png
icons/icon-512.png
icons/apple-touch-icon.png
.nojekyll
README.md
```

## Próxima versão recomendada

- Exportação PDF/Word nativa.
- Sincronização com iCloud/SharePoint.
- Notificações de ações atrasadas.
- Ligação ao Outlook/Teams.
- Login por utilizador.
- Dashboard mensal de cultura e execução.
- Integração com ChatGPT/OpenAI para análise automática das atas.
