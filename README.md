# 🧑‍🎨 PersonaGen — AI User Persona Generator

### Turn a one-line segment brief into a presentation-ready user persona infographic — complete with demographics, financials, digital habits, and an AI-generated headshot — in under 60 seconds.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6384?logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing--collaboration)

**🚀 [Try it live on AI Studio](https://ai.studio/apps/d3f3279c-c8c7-4cf3-9946-285d80001984)**

</div>

---

## ✨ Why this exists

Crafting research-grade user personas is a multi-day exercise — interviews, synthesis, art direction, decks. **Most PMs ship without it.** PersonaGen collapses that loop: describe a target segment, and Gemini produces a fully fleshed-out persona — demographics, income & expense breakdown, behaviors, motivations, pain points, digital usage, market size, and a realistic AI-generated headshot — rendered as a polished infographic you can export as JSON or PNG and drop straight into a PRD, design sprint, or pitch deck.

> Built by a PM, for PMs and builders who'd rather start a discovery sprint with concrete archetypes than a blank page.

---

## 📑 Table of contents

- [Why this exists](#-why-this-exists)
- [Live demo](#-live-demo)
- [Features](#-features)
- [Tech stack](#%EF%B8%8F-tech-stack)
- [Project layout](#-project-layout)
- [Architecture at a glance](#%EF%B8%8F-architecture-at-a-glance)
- [AI routing — how Gemini is orchestrated](#-ai-routing--how-gemini-is-orchestrated)
- [State model](#-state-model)
- [Pages & screens](#-pages--screens)
- [Components](#-components)
- [Services & utilities](#%EF%B8%8F-services--utilities)
- [Prompt history & iteration](#-prompt-history--iteration)
- [Getting started](#-getting-started)
- [Configuration](#-configuration)
- [Error handling](#-error-handling)
- [Known limitations](#%EF%B8%8F-known-limitations)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Contributing & collaboration](#-contributing--collaboration)
- [License](#-license)
- [Author](#-author)

---

## 🎬 Live demo

🔗 **Hosted app:** https://ai.studio/apps/d3f3279c-c8c7-4cf3-9946-285d80001984

> _Demo GIF and screenshots coming soon — open an issue if you'd like to contribute one._

---

## 🚀 Features

- 🧩 **End-to-end persona infographic** — Generates name, age, tagline, bio, quote, demographics, financials, behaviors, goals, pain points, digital usage, preferred support, market size, and philosophy from a single segment brief.
- 🎯 **Optional demographic anchors** — Lock the model to a specific age range, occupation, location, or income level when you need a focused archetype instead of a generic one.
- 🖼️ **AI-generated headshots** — Pipes a structured visual description into Gemini's image model so each persona ships with a realistic, presentation-ready avatar.
- 🧠 **Two-stage LLM pipeline** — Decouples narrative generation from image generation for higher fidelity on both axes, with graceful placeholder fallback if image generation fails.
- 📊 **Data visualization** — Renders digital-usage breakdown as a Recharts pie chart and income/expense as a structured economics block.
- 📥 **One-click exports** — Download as **JSON** (for spec docs, design tools, downstream pipelines) or as a **PNG infographic** (for decks, Notion, Figma) — powered by html2canvas.
- ⚡ **Sub-minute generation** — From form submit to rendered infographic in seconds on a free-tier Gemini key.
- 🛡️ **Graceful error UX** — Surfaces actionable messages for auth, quota, and parsing failures instead of opaque stack traces.

---

## 🛠️ Tech stack

| Layer | Choice | Why |
|---|---|---|
| **Language** | TypeScript ~5.8 | Type-safe persona schemas across services and components |
| **UI framework** | React 19 | Lightweight, declarative, perfect for a single-surface tool |
| **Build tool** | Vite 6 | Instant HMR, zero-config TS, tiny prod bundle |
| **Styling** | Tailwind CSS | Utility-first, ships a polished UI without a design system |
| **LLM** | Google Gemini (`@google/genai` ^1.33) | Single SDK for both text + image generation |
| **Icons** | lucide-react | Consistent open-source icon set |
| **Charts** | Recharts | Declarative pie chart for the digital-usage block |
| **PNG export** | html2canvas | DOM → canvas → PNG for "Download Infographic" |
| **Runtime** | Browser-only SPA | No backend — API key loaded at build time via Vite env |

---

## 📂 Project layout

```
User-Persona-Generator/
├── components/
│   ├── Button.tsx                # Primary CTA with loading state
│   ├── Input.tsx                 # Reusable labeled text input
│   └── PersonaCard.tsx           # Infographic — header, photo, charts, exports
├── services/
│   └── gemini.ts                 # Gemini text + image API integration
├── migrated_prompt_history/
│   └── prompt_2025-12-11T....json # Versioned prompt iteration history
├── App.tsx                       # Root — form, state, orchestration, fallbacks
├── index.tsx                     # React entry point
├── index.html                    # Vite HTML shell
├── types.ts                      # PersonaInput, PersonaData, GeneratedPersona
├── metadata.json                 # App metadata
├── vite.config.ts                # Build config + env var injection
├── tsconfig.json
├── package.json
└── package-lock.json
```

---

## 🏗️ Architecture at a glance

```
   ┌─────────────────────────────┐
   │   User segment brief        │
   │   (required: market,        │
   │    goal, frustration)       │
   │   (optional: age range,     │
   │    occupation, location,    │
   │    income level)            │
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────┐
   │        App.tsx              │
   │   • state + orchestration   │
   │   • error classification    │
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────┐
   │  generatePersonaText()      │
   │  → Gemini text model        │
   │  → JSON PersonaData         │
   │    + visualDescription      │
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────┐
   │  generatePersonaImage()     │
   │  → Gemini image model       │
   │  → base64 headshot          │
   │  → fallback placeholder     │
   │    on failure               │
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────────────────────┐
   │             <PersonaCard />                 │
   │   Header • Quote • 3-col grid               │
   │   Recharts pie • Economics block            │
   │   Export JSON | Download PNG infographic    │
   └─────────────────────────────────────────────┘
```

---

## 🧠 AI routing — how Gemini is orchestrated

The app deliberately splits one user request into **two sequential model calls**, because asking a single multimodal call to produce both rich structured copy *and* a high-quality portrait tends to compromise both.

1. **`generatePersonaText(input)`** — Sends a structured prompt to Gemini's text model, including any optional demographic anchors the user provided. Returns a typed `PersonaData` payload (demographics, financials, mindset, pain points, digital usage, market size, support preferences) **plus** a dedicated `visualDescription` field engineered for image generation (age range, ethnicity cues, attire, mood, lighting).
2. **`generatePersonaImage(visualDescription)`** — Forwards the visual description to Gemini's image model with a cinematic, photo-realistic style prompt and receives a base64-encoded headshot. **If image generation fails (rate limit, content filter, etc.), a placeholder is substituted so the persona still renders.**
3. **Composition** — `App.tsx` merges both payloads into a `GeneratedPersona` and hands it to `<PersonaCard />` for render and export.

This decoupling makes it trivial to:
- Swap the image provider (e.g. Imagen, DALL·E, FLUX) without touching the text path.
- Cache personas independently of avatars.
- Add a future "re-roll the photo" button without re-generating the text.

---

## 🔄 State model

State lives in `App.tsx` via `useState` rather than a context provider or external store — the surface is small enough that local state is the right call.

| State | Type | Purpose |
|---|---|---|
| `formData` | `PersonaInput` (3 required + 4 optional fields) | Controlled inputs across required and optional demographic sections |
| `generatedPersona` | `GeneratedPersona \| null` | Final composed result (text + image, possibly placeholder) |
| `isLoading` | `boolean` | Drives button spinner + disabled state during async work |
| `error` | `string \| null` | Surfaces classified Gemini failures (auth / quota / parsing) to the user |

> 📌 If/when the app grows multi-persona history or saved sessions, a lightweight `AppContext` or Zustand store is the natural next step — see [Roadmap](#%EF%B8%8F-roadmap).

---

## 📄 Pages & screens

PersonaGen is a single-page application — there's no router. The single surface has three visual states:

1. **Empty form** — required inputs at top, collapsible "Persona Details (Optional)" section below.
2. **Loading** — button spinner, form disabled.
3. **Result** — rendered `<PersonaCard />` infographic with Export Data and Download Infographic buttons.

---

## 🧩 Components

| Component | Responsibility |
|---|---|
| **`<Input />`** | Labeled, controlled text input — reused across all seven form fields |
| **`<Button />`** | Primary CTA — exposes `isLoading` to render a spinner and disable interaction |
| **`<PersonaCard />`** | Full infographic. Renders header (name, age, tagline, occupation, PersonaGen brand), quote block, three-column grid (photo + 6 demographic stats / about + financial behavior + economics / mindset & goals + pain points + digital-usage pie chart), and an "In a Nutshell" footer with market size and philosophy. Hosts both export actions. |

All components are stateless and prop-driven — `App.tsx` is the single orchestration point.

---

## ⚙️ Services & utilities

- **`services/gemini.ts`** — Single integration boundary with Google Gemini. Exposes `generatePersonaText` and `generatePersonaImage`. All prompt engineering, JSON parsing, base64 handling, and the image fallback live here, so the rest of the app stays UI-only. A private `getAI()` helper centralizes API-key validation and throws early on missing config.
- **`types.ts`** — Shared TypeScript contracts: `PersonaInput` (form shape), `PersonaData` (model output), `GeneratedPersona` (PersonaData + imageUrl). One source of truth for both the service layer and components.
- **`html2canvas`** — Used inline in `PersonaCard.tsx` to rasterize the infographic to PNG.

> No custom hooks today — local `useState` is enough. A `usePersonaGeneration()` hook is a clean refactor target if a second consumer ever appears.

---

## 🧪 Prompt history & iteration

The `migrated_prompt_history/` folder contains timestamped JSON snapshots of prompt iterations exported from Google AI Studio. This is intentional: prompt engineering is a discipline, and versioning prompts the same way we version code makes regressions visible and improvements reproducible. Each file captures the full prompt and configuration at a point in time.

> If you're a PM evaluating this repo: the prompt history is the artifact that shows the *iteration loop*, not just the final output.

---

## 🚦 Getting started

**Prerequisites:** Node.js 18+, a [Google Gemini API key](https://aistudio.google.com/apikey) (free tier works).

```bash
# 1. Clone
git clone https://github.com/yatinbhalla/User-Persona-Generator.git
cd User-Persona-Generator

# 2. Install
npm install

# 3. Configure — set GEMINI_API_KEY in .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Run
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

**Build for production:**
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

---

## 🔧 Configuration

| Env var | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Injected at build time via Vite. Stored in `.env.local` (gitignored). |

> ⚠️ **Security note:** Because the SPA bundles the key client-side, this build is intended for **local use and personal demos**. For a public deployment, proxy Gemini calls through a thin server.

---

## 🩺 Error handling

`App.tsx` classifies Gemini errors and renders targeted guidance instead of leaking raw stack traces:

| Trigger | Surfaced message |
|---|---|
| `PERMISSION_DENIED` / `API_KEY_INVALID` | "Check your API key in `.env.local`" |
| `RESOURCE_EXHAUSTED` (quota) | "You've hit your Gemini quota — try again later or upgrade the key" |
| JSON parse failure | "Model returned an unexpected response — please retry" |
| Image generation failure | _Silent_ — falls back to a placeholder image so the persona still renders |

---

## ⚠️ Known limitations

Being upfront about what this *doesn't* do yet:

- 🔓 **API key is client-bundled** — Fine for local use, unsafe for public hosting without a server-side proxy.
- 💾 **No persistence** — Personas live in memory only; refreshing the page wipes them. Export Data → JSON is the current workaround.
- 🧵 **Single-persona output** — One persona per submit. Batch "3–5 archetypes in one run" is on the roadmap.
- 🎨 **No avatar re-roll** — If the headshot isn't right, you regenerate the whole persona.
- 🌐 **English-only prompts** — Tuning for non-English segments hasn't been validated.
- 📱 **Mobile polish** — Built mobile-friendly but not yet QA'd across small viewports; the 3-column infographic compresses awkwardly under ~768px.
- 🧪 **No tests yet** — A Vitest + React Testing Library setup is open as the first contribution opportunity.

---

## 🗺️ Roadmap

- [x] **JSON export**
- [x] **PNG infographic export**
- [x] **Optional demographic anchors**
- [x] **Image-generation fallback**
- [ ] **Batch mode** — Generate a full 3–5 persona archetype set in one run
- [ ] **Persona library** — Save, name, and revisit generated personas (localStorage → optional Firestore)
- [ ] **Avatar re-roll** — Regenerate the headshot without re-generating the text
- [ ] **Notion / Figma / PDF export** — Beyond JSON + PNG
- [ ] **Provider abstraction** — Pluggable LLM + image-model backends (Gemini, OpenAI, Anthropic, Imagen, FLUX)
- [ ] **Server-side proxy** — Keep the API key off the client for safe public hosting
- [ ] **Responsive infographic** — Stacked layout under 768px
- [ ] **Test coverage** — Vitest for services, React Testing Library for components

---

## 🤝 Contributing & collaboration

**I'd genuinely love to collaborate on this.** Whether you're a PM with a sharper prompt, a designer who'd improve the infographic, or an engineer eyeing the roadmap — please jump in.

Ways to engage:

- 🐛 **Found a bug or weird Gemini output?** [Open an issue](https://github.com/yatinbhalla/User-Persona-Generator/issues/new) — even a screenshot helps.
- 💡 **Have an idea?** Start a [discussion](https://github.com/yatinbhalla/User-Persona-Generator/discussions) or DM me on LinkedIn (linked below).
- 🛠️ **Want to ship code?** Fork → branch → PR. Pick anything from the [Roadmap](#%EF%B8%8F-roadmap), or surprise me. First-time contributors especially welcome.
- 🧪 **PM/researcher?** Try the tool on a real segment and tell me where the personas felt thin — that feedback shapes prompt iteration directly (and may end up in `migrated_prompt_history/`).
- 🎨 **Designer?** The infographic has room to grow — alternate layouts, dark mode, brandable color tokens.

If you build something on top of this (a Notion exporter, a Figma plugin, a Slack bot), I'd love to feature it.

---

## 📄 License

Released under the MIT License — use it, fork it, ship it.

---

## 👤 Author

**Yatin Bhalla** · Product Manager & AI Builder

Currently shipping AI-powered tools at the intersection of product craft and applied LLMs. PG in Product Management @ BITS School of Management. Always open to chat about PM, AI products, or 0→1 builds.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yatin%20Bhalla-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/yatinbhalla42)
[![Gmail](https://img.shields.io/badge/Gmail-yatinbhalla42%40gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:yatinbhalla42@gmail.com)
[![X](https://img.shields.io/badge/X-@yatinbhalla42-000000?logo=x&logoColor=white)](https://x.com/yatinbhalla42)

> _If this project sparked an idea — or you're hiring a PM who builds — please reach out. I read every message._
