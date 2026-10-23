# TaskFlow — Modern Checklist & Smart AI To-Do List

Um aplicativo de lista de tarefas moderno, minimalista e responsivo construído com tema clean (neutros e índigo), suporte completo a dark/light mode, persistência no LocalStorage e recurso exclusivo 'Smart Breakdown' alimentado por IA (Gemini 3.8 Flash) para decomposição de grandes objetivos em subtarefas acionáveis.

## User Review & Critical Decisions

> [!IMPORTANT]
> As seguintes escolhas de design e comportamento foram confirmadas com base nas respostas do usuário:

- **Estilo Visual**: Clean moderno com tons neutros refinados (Slate/Zinc) e acentos em índigo (`#6366F1` / `#4F46E5`), com suporte a tema Claro e Escuro (Dark/Light).
- **Comportamento do Smart Breakdown**: Ao submeter uma meta no modal/painel rápido de IA, as 3 a 5 subtarefas sugeridas pelo Gemini são adicionadas automaticamente à lista com a tag correspondente, data de entrega sugerida e prioridades calibradas.
- **Níveis de Prioridade**: Suporte a prioridades **Alta** (coral/carmesim suave), **Média** (âmbar dourado) e **Baixa** (ardósia/azul suave), complementando categorias (Trabalho, Pessoal, Urgente, Estudos, etc.) e data limite.

---

## 1. Overview & Core Concept

- **O que faz**: Gerenciamento de tarefas fluido e sem atrito para o dia a dia, permitindo criação rápida, categorização com tags customizáveis, datas limite com alerta visual de vencimento, marcação de conclusão com riscado e animação suave, filtragem dinâmica e cálculo em tempo real do progresso com barra visual e porcentagem.
- **Diferencial de IA**: A ferramenta 'Smart Breakdown' recebe um objetivo amplo (ex: *"Preparar apresentação de resultados do trimestre"*, *"Organizar viagem de férias em família"*) e usa o modelo Gemini no backend para devolver instantaneamente de 3 a 5 passos práticos, já estruturados com títulos claros, categorias adequadas e prioridades lógicas.
- **Público & Foco**: Profissionais, estudantes e qualquer pessoa que busca foco e clareza visual, sem sobrecarga de menus complexos ou distrações visuais ("anti-slop").

---

## 2. User Experience & Visual Design

### A. Paleta e Estilo (Clean Neutrals & Indigo)
- **Cores Light Mode**: Fundo limpo `#F8FAFC` (Slate-50), superfícies estruturadas `#FFFFFF` com bordas sutis de 1px (`#E2E8F0`), texto primário `#0F172A`, texto secundário `#64748B`.
- **Cores Dark Mode**: Fundo profundo `#090D16` / `#0F172A`, cartões `#131C2E`, bordas de hairline `#1E293B`, texto primário `#F8FAFC`, texto atenuado `#94A3B8`.
- **Acento Primário**: Índigo (`indigo-600` / `#4F46E5` no light; `indigo-400` / `#818CF8` no dark).
- **Prioridades Visuais**:
  - *Alta*: Carmesim suave (`#EF4444` / `rose-500`) com rótulo textual e indicador.
  - *Média*: Âmbar quente (`#F59E0B` / `amber-500`).
  - *Baixa*: Ardósia azulada (`#64748B` / `slate-500`).
- **Disciplina Anti-Slop**: Tipografia limpa, números tabulares (`tabular-nums`) para métricas e percentuais, zero badge sandwiches, separadores tipográficos sutis (`·`) para metadados de data e categoria.

### B. Fluxo de Usuário Principal
1. **Cabeçalho & Barra Superior**:
   - Wordmark do app ("TaskFlow") com ícone minimalista de checklist.
   - Resumo rápido de produtividade: total de tarefas concluídas vs pendentes.
   - Ações diretas: alternador de tema Claro/Escuro (persistido) e botão de destaque para o "Smart Breakdown (IA)".
2. **Barra de Progresso Visual**:
   - Medidor com porcentagem animada (`tabular-nums`), contagem total e fração (ex: `7 de 10 concluídas · 70%`).
   - Feedback de conclusão dinâmica quando atinge 100% com mensagem celebratória sutil.
3. **Criação Rápida de Tarefas**:
   - Campo de input rápido com atalho de teclado `Enter`.
   - Seleção de categoria (Trabalho, Pessoal, Urgente, Estudos, Saúde, ou tag personalizada).
   - Seletor de prioridade (Alta, Média, Baixa) e seletor de data limite.
4. **Filtros e Visualizações**:
   - Abas funcionais: **Todas**, **Pendentes**, **Concluídas**.
   - Filtro por Categoria via pílula interativa/seletor segmented.
   - Campo de busca em tempo real por título ou tag.
   - Ordenação inteligente: Por data limite, por prioridade ou por data de criação.
5. **Lista de Tarefas Interativa**:
   - Checkbox customizado com micro-animação satisfatória.
   - Efeito visual de riscado suave (`line-through opacity-50 transition-all`).
   - Edição rápida inline do título, data ou categoria.
   - Exclusão com confirmação rápida ou desfazimento (Undo).
6. **Smart Breakdown (Modal / Drawer de IA)**:
   - Campo para digitar o objetivo ou projeto grande.
   - Sugestões pré-fabricadas com 1 clique (ex: *"Lançar novo produto"*, *"Aprender uma nova habilidade"*, *"Faxina geral em casa"*).
   - Chamada à API segura do Gemini 3.8 Flash via backend.
   - Adição imediata das 3 a 5 subtarefas geradas com feedback visual (Toast).

---

## 3. Key Product Decisions & Trade-Offs

- **Armazenamento e Persistência**:
  - *Abordagem*: `localStorage` com chave versionada (`taskflow_tasks_v1` e `taskflow_theme_v1`).
  - *Motivo*: Atende 100% ao requisito de nunca perder dados ao recarregar a página, funciona offline e tem latência zero.
- **Chamada Segura ao Gemini (Server-Side Proxy)**:
  - *Abordagem*: Rota de API no servidor `/api/breakdown` usando `@google/genai` com `gemini-3.8-flash` e resposta estruturada (`responseSchema` JSON com lista de tarefas, categorias e prioridades).
  - *Motivo*: Protege a chave de API no servidor sem expô-la ao navegador do cliente, conforme diretrizes do AI Studio.
- **Estado Reativo e Acessibilidade**:
  - *Abordagem*: React 19 com hooks desacoplados (`useLocalStorage`, `useTaskManager`), suporte a navegação por teclado e leitor de tela com atributos `aria-checked` e `aria-label`.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      TaskFlow Client                        │
├──────────────────────────────┬──────────────────────────────┤
│  Header & Theme Toggle       │  Progress Bar (tabular-nums) │
├──────────────────────────────┼──────────────────────────────┤
│  Task Form / Quick Add       │  Smart Breakdown Button (AI) │
├──────────────────────────────┴──────────────────────────────┤
│  Filter Bar (All / Pending / Done / By Category / Search)   │
├─────────────────────────────────────────────────────────────┤
│  Task List (Checkboxes, Strikethrough, Due Dates, Tags)      │
│  - Task Card (Edit, Toggle, Delete, Priority Tag)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
       ┌──────────────┐               ┌─────────────────┐
       │ LocalStorage │               │ POST /api/break │
       │ Persistence  │               │      down       │
       └──────────────┘               └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │ Gemini 3.8 Flash│
                                      │  (@google/genai)│
                                      └─────────────────┘
```

### Estrutura dos Dados (TypeScript)

```ts
interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}
```

### Endpoints da API

- `POST /api/breakdown`:
  - Body: `{ goal: string, category?: string }`
  - Response: `{ tasks: Array<{ title: string; priority: 'low'|'medium'|'high'; category: string; daysFromNow: number }> }`
