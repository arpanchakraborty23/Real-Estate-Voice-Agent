# User Website — Plan

## Overview

A public-facing website for **New House Real Estate** where users can interact with the AI voice agent, browse property listings, and learn about the company.

**Stack:** Vite + React + TypeScript + shadcn/ui + Agents UI  
**Theme:** Warm ivory/cream, terracotta, deep gold — inviting and premium  
**Location:** `user-website/` (new project)

**Recommended Skills:**

| Skill | Why |
|---|---|
| `shadcn` | Core — Agents UI is built on shadcn; component installation, styling rules, forms, cn() utility |
| `frontend-design` | Brand identity — warm ivory/terracotta/gold premium real estate look; avoids generic AI aesthetics |
| `frontend-ui-animator` | UX — audio visualizer response, agent state transitions, property card reveals, page transitions |
| `ui-components` | Custom patterns — CVA variants, OKLCH theming for warm palette, Radix accessible overlays/dialogs |

---

## Pages

### 1. Voice Agent (`/`)

| Feature | Implementation |
|---|---|
| Session + room connection | `useSession(TokenSource.sandboxTokenServer(id), { agentName })` wrapped in `AgentSessionProvider` |
| Token | LiveKit Cloud Sandbox Token Server (dev) or custom token endpoint (prod) |
| Mic toggle + disconnect | `AgentControlBar controls={{ microphone: true, leave: true }}` |
| Audio visualizer | `AgentAudioVisualizerBar` (or Radial/Aura) — driven by `useAgent()` → `audioTrack` + `state` |
| Chat transcript | `AgentChatTranscript` — renders session messages (speech + text) |
| Agent state indicator | `AgentChatIndicator` — auto-responds to agent state |
| Start audio button | `StartAudioButton` — handles browser autoplay restriction |
| Agent-sent images | `registerByteStreamHandler("agent-images", ...)` → renders in ImageGallery (property photos sent by agent) |
| Property recommendations | Agent calls RPC method `showPropertyRecommendations` → frontend renders cards |

#### Layout

```
┌──────────────────────────────────────────────┐
│  Nav Bar (logo, links)                       │
├──────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────┐  │
│  │  AgentAudioVis...  │  │  Chat          │  │
│  │  (agent voice)     │  │  Transcript    │  │
│  │                    │  │                │  │
│  │  AgentControlBar   │  │  Image Gallery │  │
│  │  [🎤] [📞]         │  │  (agent sent)  │  │
│  └────────────────────┘  └────────────────┘  │
│                                               │
│  Property Recommendations (horizontal cards)  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ Card │ │ Card │ │ Card │ │ Card │  →      │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
│                                               │
├──────────────────────────────────────────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

### 2. Property Listings (`/properties`)

| Feature | Detail |
|---|---|
| Grid view | Property cards with image placeholder, price, type, location, bedrooms |
| Filters | Property type (dropdown), bedrooms (range), location (text), price range (min/max) |
| Search | Text search on project name / location |
| Data source | Recomm-API `GET /api/properties` |
| Empty state | "No properties match your criteria" with illustration |

### 3. About Us (`/about`)

| Section | Content |
|---|---|
| Hero | "New House Real Estate — Your Dream Home Awaits" with warm hero image |
| Story | Company origin, mission, values (placeholder or real content) |
| Team | Team member cards (name, role, photo placeholder) |
| Stats | Years in business, properties sold, cities covered, happy clients |
| CTA | "Talk to Anjali" button → navigates to `/` |

### 4. Contact (`/contact`)

| Feature | Detail |
|---|---|
| Info | Phone, email, office address with icons |
| Form | Name, email, phone, message → `POST /api/inquiries` |
| Validation | Required fields, email format, 10-digit phone |
| Success | Toast/confirmation message on submit |

---

## Dependencies

```json
{
  "react": "^19",
  "react-dom": "^19",
  "react-router-dom": "^7",
  "@livekit/components-react": "^4",
  "@livekit/components-styles": "^4",
  "livekit-client": "^4",
  "class-variance-authority": "^0.7",
  "lucide-react": "^0.400",
  "motion": "^11",
  "react-dropzone": "^14"
}
```

Agents UI components are installed via shadcn CLI (not npm directly) — see Installation section.

---

## Installation

```bash
npm create vite@latest user-website -- --template react-ts
cd user-website
npm install
npx shadcn@latest init
npx shadcn@latest registry add @agents-ui
```

Then install specific Agents UI components:

```bash
npx shadcn@latest add @agents-ui/agent-session-provider
npx shadcn@latest add @agents-ui/agent-control-bar
npx shadcn@latest add @agents-ui/start-audio-button
npx shadcn@latest add @agents-ui/agent-audio-visualizer-bar
npx shadcn@latest add @agents-ui/agent-chat-transcript
npx shadcn@latest add @agents-ui/agent-chat-indicator
```

Or install all at once:

```bash
npx shadcn@latest add @agents-ui/all
```

This generates components under `src/components/agents-ui/` with full source code.

---

## Theme Colors

```css
:root {
  --bg-primary: #faf5ed;
  --bg-secondary: #fffcf7;
  --bg-card: #ffffff;
  --bg-card-hover: #fdf8f0;
  --border: #e8ddd0;
  --border-light: #f0e8dc;
  --text-primary: #2d2418;
  --text-secondary: #6b5d4e;
  --text-muted: #a0917e;
  --accent: #c1694f;
  --accent-hover: #a8553f;
  --accent-dim: rgba(193, 105, 79, 0.08);
  --success: #2d8a4e;
  --danger: #c13f3f;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 2px 16px rgba(45, 36, 24, 0.06);
}

/* Headings: Playfair Display */
/* Body: Inter */
```

Pass `color` prop to visualizers matching accent: `<AgentAudioVisualizerBar color="#c1694f" />`

---

## Project Structure

```
user-website/
├── index.html
├── package.json
├── components.json              # shadcn config
├── vite.config.ts               # proxy /api → localhost:8000
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # BrowserRouter + Routes + Layout
│   ├── index.css                # Warm theme + global styles + shadcn vars
│   ├── lib/
│   │   └── shadcn/
│   │       └── utils.ts        # cn() helper (installed by shadcn init)
│   ├── api/
│   │   └── client.ts           # Recomm-API client (properties, inquiries)
│   ├── components/
│   │   ├── agents-ui/          # Installed by shadcn (full source)
│   │   │   ├── agent-session-provider.tsx
│   │   │   ├── agent-control-bar.tsx
│   │   │   ├── agent-disconnect-button.tsx
│   │   │   ├── start-audio-button.tsx
│   │   │   ├── agent-audio-visualizer-bar.tsx
│   │   │   ├── agent-chat-transcript.tsx
│   │   │   └── agent-chat-indicator.tsx
│   │   ├── ui/                 # shadcn base components (installed as needed)
│   │   ├── NavBar.tsx          # Top navigation
│   │   ├── Footer.tsx          # Site footer
│   │   ├── VoiceSession.tsx    # Session lifecycle + provider wiring
│   │   ├── VoiceChat.tsx       # Transcript + indicator + controls layout
│   │   ├── AudioVisualizer.tsx # Thin wrapper around AgentAudioVisualizerBar
│   │   ├── ImageGallery.tsx    # Grid of images from byte stream "agent-images"
│   │   ├── PropertyRecommendations.tsx  # RPC handler → horizontal cards
│   │   ├── RecommendationCard.tsx       # Single property card
│   │   ├── PropertyCard.tsx    # Public listing card
│   │   └── InquiryForm.tsx     # Contact form
│   ├── pages/
│   │   ├── HomePage.tsx        # Voice agent page
│   │   ├── PropertiesPage.tsx  # Public property listings
│   │   ├── AboutPage.tsx       # Company content
│   │   └── ContactPage.tsx     # Contact form + info
│   └── types.ts                # Shared TypeScript types
```

---

## Key Patterns

### Session Wiring (App.tsx)

```tsx
const tokenSource = TokenSource.sandboxTokenServer("your-sandbox-id");
const session = useSession(tokenSource, { agentName: "new-house-agent" });

useEffect(() => {
  session.start();
  return () => session.end();
}, []);

<AgentSessionProvider session={session}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    ...
  </Routes>
</AgentSessionProvider>
```

### VoiceAgent Page (HomePage.tsx)

```tsx
const { audioTrack, state } = useAgent();
const { messages } = useSessionMessages();

// Image gallery state built from byte stream handler
// RPC handler registered for showPropertyRecommendations
```

### Agent → Images (Gallery)

```ts
room.registerByteStreamHandler("agent-images", async (reader, participant) => {
  const blob = new Blob(await reader.readAll(), { type: reader.info.mimeType });
  const url = URL.createObjectURL(blob);
  setImages((prev) => [...prev, url]);
});
```

### Property Recommendations (RPC)

```ts
room.registerRpcMethod("showPropertyRecommendations", async (data) => {
  const properties = JSON.parse(data.payload);
  setRecommendations(properties);
  return "ok";
});
```

### Agent State Getters

```ts
const agent = useAgent();
agent.state          // "listening" | "thinking" | "speaking" | ...
agent.canListen      // true when user can speak
agent.isFinished     // true on disconnect/fail
agent.failureReasons // errors if failed
```

---

## Agent Modifications Required

| Change | File | Detail |
|---|---|---|
| Image-sending tool | `voice-Agent/src/tasks/task_agent.py` | New `@function_tool` that sends a property image via `room.local_participant.send_file()` on `topic: "agent-images"` |
| Connect `PropertySearchTask` to Recomm-API | `voice-Agent/src/tasks/task_agent.py` | Replace hardcoded recommendations with real `POST /api/search` call; return via RPC |
| RPC method registration | `voice-Agent/src/agent/base_agent.py` | Register `showPropertyRecommendations` RPC that agent calls to push property cards to frontend |
| Web search tool for property images | New tool | Allow agent to search the web for a property photo given project name/location |

---

## Implementation Order

1. `npm create vite` → `user-website/` with React + TypeScript
2. `npx shadcn@latest init` → shadcn setup
3. `npx shadcn@latest registry add @agents-ui` + install needed components
4. Install remaining deps (react-router-dom, react-dropzone, motion)
5. Write `types.ts`, `api/client.ts`, `index.css`
6. Build `NavBar`, `Footer`, `Layout`
7. Build `AboutPage` (static content)
8. Build `ContactPage` (form → API)
9. Build `PropertiesPage` (data from API + filters)
10. Build `VoiceSession` (session lifecycle + provider)
11. Build `VoiceChat` (transcript + indicator + AgentControlBar)
12. Build `AudioVisualizer` (wrapper around AgentAudioVisualizerBar)
13. Build `ImageGallery` (byte stream handler → topic:"agent-images")
14. Build `PropertyRecommendations` + `RecommendationCard` (RPC handler → cards)
15. Build `HomePage` (compose all agent components)
16. Test full flow with running agent + API
