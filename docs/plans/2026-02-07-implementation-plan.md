# Matt's Flat Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page marketing website for Matt's Flat — a playful, animation-heavy soft drink brand site with a waitlist signup, deployed on Railway from GitHub.

**Architecture:** Astro 5 with React islands for interactive/animated components. Static pages served via Node standalone adapter on Railway. GSAP + ScrollTrigger for scroll animations, Three.js for hero liquid effect, Drizzle ORM + PostgreSQL for waitlist storage. All marketing content is statically generated; only the waitlist API endpoint is server-rendered.

**Tech Stack:** Astro 5, React 19, Tailwind CSS v4, GSAP + ScrollTrigger, Three.js / React Three Fiber, Drizzle ORM, PostgreSQL (Railway), Google Analytics 4, @astrojs/node adapter, @astrojs/sitemap

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.mjs`
- Create: `src/pages/index.astro`
- Create: `src/layouts/Layout.astro`
- Create: `.gitignore`
- Create: `Dockerfile`

**Step 1: Initialize Astro project**

```bash
cd /Users/mattdrazin/projects/mattsflat.com
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

**Step 2: Add integrations**

```bash
npx astro add react tailwind sitemap node -y
```

**Step 3: Install animation and database dependencies**

```bash
npm install gsap @gsap/react three @react-three/fiber @react-three/drei drizzle-orm postgres dotenv
npm install -D drizzle-kit @types/three
```

**Step 4: Configure astro.config.mjs**

Replace the generated config with:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://mattsflat.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
});
```

**Step 5: Create base Layout.astro**

Create `src/layouts/Layout.astro`:

```astro
---
interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Matt's Flat | The World's First Intentionally Flat Soft Drink",
  description = "Less fizz. More flavor. Way more fun. Matt's Flat is a new kind of soft drink — deliberately less carbonated so you can actually taste what you're drinking.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url.href} />
    <meta property="og:site_name" content="Matt's Flat" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <title>{title}</title>

    <!-- Google Analytics 4 -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Matt's Flat",
        "url": "https://mattsflat.com",
        "description": "The world's first intentionally flat soft drink. Less fizz. More flavor. Way more fun.",
        "foundingDate": "2026",
        "founder": {
          "@type": "Person",
          "name": "Matt"
        }
      }
    </script>
  </head>
  <body class="bg-cream text-charcoal antialiased">
    <slot />
  </body>
</html>
```

**Step 6: Create minimal index.astro**

Create `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <main>
    <h1>Matt's Flat</h1>
    <p>Less fizz. More flavor. Way more fun.</p>
  </main>
</Layout>
```

**Step 7: Create Dockerfile for Railway**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

**Step 8: Create .gitignore**

```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
```

**Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Astro dev server running at http://localhost:4321

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with React, Tailwind, GSAP, Three.js"
```

---

## Task 2: Set Up Tailwind Theme & Global Styles

**Files:**
- Modify: `tailwind.config.mjs`
- Create: `src/styles/global.css`

**Step 1: Configure Tailwind with Matt's Flat brand colors**

Update `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Base
        cream: '#FFF8F0',
        charcoal: '#2D2D2D',

        // Accent
        coral: '#FF6B6B',
        'electric-violet': '#7C3AED',

        // Flavor pastels
        'flat-gold': '#F5E6C8',
        'flat-lavender': '#DDD0F0',
        'flat-yellow': '#FFF3C4',
        'flat-peach': '#FDDCB5',
        'flat-mint': '#C8F0E0',
        'flat-neon': '#D4F5C0',
        'flat-purple': '#D8C4F0',
      },
      fontFamily: {
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

**Step 2: Create global styles**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Nunito', system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-coral text-white font-display font-bold px-8 py-4 rounded-full
           hover:bg-coral/90 transition-all duration-300 text-lg;
  }

  .section-padding {
    @apply px-6 py-20 md:px-12 lg:px-24 lg:py-32;
  }
}
```

**Step 3: Import global styles in Layout.astro**

Add to the `<head>` of `src/layouts/Layout.astro`:

```astro
<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 4: Verify styles load**

```bash
npm run dev
```

Expected: Page shows with cream background, Inter/Nunito fonts loading.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind brand theme with pastels and typography"
```

---

## Task 3: Set Up Database (Drizzle + PostgreSQL)

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/lib/schema.ts`
- Create: `drizzle.config.ts`
- Create: `.env.example`
- Create: `src/pages/api/waitlist.ts`

**Step 1: Create database schema**

Create `src/lib/schema.ts`:

```typescript
import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Step 2: Create database connection singleton**

Create `src/lib/db.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

**Step 3: Create Drizzle config**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Step 4: Create .env.example**

```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Step 5: Create waitlist API endpoint**

Create `src/pages/api/waitlist.ts`:

```typescript
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { waitlist } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "That doesn't look like an email. Matt's not mad, just disappointed.",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicates
    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email.toLowerCase().trim()));

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "You're already on the list! Matt appreciates the enthusiasm.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(waitlist).values({
      email: email.toLowerCase().trim(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "You're on the list. Matt personally noted your email. On a napkin. Just kidding — it's in a database. But he's still excited.",
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong. Even Matt's drink is smoother than this.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

**Step 6: Add database scripts to package.json**

Add to `package.json` scripts:

```json
"db:generate": "drizzle-kit generate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Drizzle ORM schema and waitlist API endpoint"
```

---

## Task 4: Build Hero Section

**Files:**
- Create: `src/components/HeroSection.astro`
- Create: `src/components/LiquidHero.tsx` (React island — Three.js)
- Modify: `src/pages/index.astro`

**Step 1: Create the Three.js liquid background component**

Create `src/components/LiquidHero.tsx`:

```tsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#FFF8F0') },
      uColor2: { value: new THREE.Color('#FF6B6B') },
      uColor3: { value: new THREE.Color('#F5E6C8') },
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = sin(pos.x * 3.0 + uTime * 0.5) * 0.15
                      + sin(pos.y * 2.0 + uTime * 0.3) * 0.1
                      + sin((pos.x + pos.y) * 2.5 + uTime * 0.7) * 0.08;
      pos.z += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uTime;

    void main() {
      float mixStrength = (vElevation + 0.2) * 2.5;
      vec3 color = mix(uColor1, uColor2, vUv.y);
      color = mix(color, uColor3, mixStrength);
      float alpha = smoothstep(0.0, 0.3, vUv.y) * 0.6;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 6, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiquidHero() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <LiquidMesh />
      </Canvas>
    </div>
  );
}
```

**Step 2: Create HeroSection.astro wrapper**

Create `src/components/HeroSection.astro`:

```astro
---
import LiquidHero from './LiquidHero.tsx';
---

<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <LiquidHero client:load />

  <div class="relative z-10 text-center max-w-4xl mx-auto px-6">
    <h1
      class="font-display font-900 text-5xl md:text-7xl lg:text-8xl text-charcoal leading-tight mb-6"
      data-hero-title
    >
      Less fizz.<br />
      More flavor.<br />
      <span class="text-coral">Way more fun.</span>
    </h1>

    <p
      class="font-body text-xl md:text-2xl text-charcoal/70 mb-10 max-w-2xl mx-auto"
      data-hero-subtitle
    >
      I spent years shaking bottles so you don't have to.
    </p>

    <a
      href="#waitlist"
      class="btn-primary inline-block"
      data-hero-cta
    >
      Join the Waitlist
    </a>
  </div>
</section>
```

**Step 3: Wire hero into index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/HeroSection.astro';
---

<Layout>
  <main>
    <HeroSection />
  </main>
</Layout>
```

**Step 4: Verify hero renders**

```bash
npm run dev
```

Expected: Hero section with animated liquid background, headline text, and CTA button.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add hero section with Three.js liquid animation"
```

---

## Task 5: Build Problem Section with GSAP Scroll Animation

**Files:**
- Create: `src/components/ProblemSection.astro`
- Create: `src/components/ScrollReveal.tsx` (React island — GSAP)
- Modify: `src/pages/index.astro`

**Step 1: Create GSAP ScrollReveal component**

Create `src/components/ScrollReveal.tsx`:

```tsx
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'fade';
  delay?: number;
  stagger?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  stagger = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.children;
    const from: gsap.TweenVars = { opacity: 0 };

    if (direction === 'up') from.y = 60;
    if (direction === 'left') from.x = -60;
    if (direction === 'right') from.x = 60;

    gsap.from(elements, {
      ...from,
      duration: 1,
      ease: 'power3.out',
      delay,
      stagger: stagger || 0.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
```

**Step 2: Create ProblemSection.astro**

Create `src/components/ProblemSection.astro`:

```astro
---
import ScrollReveal from './ScrollReveal.tsx';
---

<section id="problem" class="section-padding bg-white">
  <div class="max-w-4xl mx-auto">
    <ScrollReveal client:visible className="space-y-8">
      <h2 class="font-display font-800 text-4xl md:text-6xl text-charcoal text-center">
        Your drink shouldn't <span class="text-coral">hurt.</span>
      </h2>

      <p class="text-lg md:text-xl text-charcoal/70 text-center max-w-2xl mx-auto leading-relaxed">
        Let's be honest. Carbonation is a bully. It burns your throat. Assaults your taste buds.
        Makes you burp at the worst possible moments. And for what? Some bubbles?
      </p>
    </ScrollReveal>

    <ScrollReveal client:visible delay={0.3} className="mt-16">
      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div class="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
          <h3 class="font-display font-700 text-xl mb-4 text-red-500">Regular Soda</h3>
          <ul class="space-y-2 text-charcoal/70">
            <li>Burns your throat</li>
            <li>Explodes when shaken</li>
            <li>Assaults your taste buds</li>
            <li>Will fight you</li>
          </ul>
        </div>

        <div class="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
          <h3 class="font-display font-700 text-xl mb-4 text-green-600">Matt's Flat</h3>
          <ul class="space-y-2 text-charcoal/70">
            <li>Smooth and flavorful</li>
            <li>Shake it all you want</li>
            <li>Actually lets you taste things</li>
            <li>Aggressively chill</li>
          </ul>
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>
```

**Step 3: Add to index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/HeroSection.astro';
import ProblemSection from '../components/ProblemSection.astro';
---

<Layout>
  <main>
    <HeroSection />
    <ProblemSection />
  </main>
</Layout>
```

**Step 4: Verify scroll animations work**

```bash
npm run dev
```

Expected: Problem section fades/slides in as you scroll to it.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add problem section with GSAP scroll-triggered animations"
```

---

## Task 6: Build Flavor Lineup Section

**Files:**
- Create: `src/components/FlavorLineup.astro`
- Create: `src/components/FlavorCard.tsx` (React island — GSAP hover)
- Create: `src/data/flavors.ts`
- Modify: `src/pages/index.astro`

**Step 1: Create flavor data**

Create `src/data/flavors.ts`:

```typescript
export interface Flavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  profile: string;
  color: string;
  bgClass: string;
  isHero: boolean;
}

export const flavors: Flavor[] = [
  {
    id: 'original-flat',
    name: 'The Original Flat',
    tagline: 'All the taste. None of the assault.',
    description: 'Classic cola the way it was meant to be tasted — without the carbonation getting in the way. Bold. Smooth. Revolutionary in its simplicity.',
    profile: 'Classic Cola',
    color: '#F5E6C8',
    bgClass: 'bg-flat-gold',
    isHero: true,
  },
  {
    id: 'barely-berry',
    name: 'Barely Berry',
    tagline: 'Bursting with flavor. Not your stomach.',
    description: 'A lush mix of berries that actually lets you taste them. Wild, sweet, and impossibly smooth.',
    profile: 'Mixed Berry',
    color: '#DDD0F0',
    bgClass: 'bg-flat-lavender',
    isHero: false,
  },
  {
    id: 'citrus-mistress',
    name: 'Citrus Mistress',
    tagline: "She's smooth and she knows it.",
    description: "Lemon meets lime in a drink that's confident, refreshing, and won't make you wince.",
    profile: 'Lemon-Lime',
    color: '#FFF3C4',
    bgClass: 'bg-flat-yellow',
    isHero: false,
  },
  {
    id: 'peach-please',
    name: 'Peach, Please',
    tagline: "So smooth it's almost suspicious.",
    description: 'Ripe peach flavor that glides. No burn. No bite. Just pure, velvety peach.',
    profile: 'Smooth Peach',
    color: '#FDDCB5',
    bgClass: 'bg-flat-peach',
    isHero: false,
  },
  {
    id: 'mint-to-be',
    name: 'Mint to Be',
    tagline: 'The drink you were destined for.',
    description: 'Cool spearmint with a whisper of lime. Refreshing in a way that carbonation could never be.',
    profile: 'Spearmint + Lime',
    color: '#C8F0E0',
    bgClass: 'bg-flat-mint',
    isHero: false,
  },
  {
    id: 'summit-chill',
    name: 'Summit Chill',
    tagline: 'We climbed to the top and took a nap.',
    description: 'Extreme citrus flavor, maximum intensity, zero eruption. All the rush of the peak without the turbulence.',
    profile: 'Extreme Citrus',
    color: '#D4F5C0',
    bgClass: 'bg-flat-neon',
    isHero: false,
  },
  {
    id: 'grape-escape',
    name: 'Grape Escape',
    tagline: 'Finally free from the fizz.',
    description: "Bold, unapologetic grape flavor liberated from the carbonation that's been holding it hostage.",
    profile: 'Bold Grape',
    color: '#D8C4F0',
    bgClass: 'bg-flat-purple',
    isHero: false,
  },
];
```

**Step 2: Create FlavorCard React component**

Create `src/components/FlavorCard.tsx`:

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Flavor } from '../data/flavors';

interface Props {
  flavor: Flavor;
}

export default function FlavorCard({ flavor }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mouseleave', handleLeave);

    return () => {
      card.removeEventListener('mouseenter', handleEnter);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl p-8 cursor-pointer transition-shadow duration-300 hover:shadow-xl ${
        flavor.isHero ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      style={{ backgroundColor: flavor.color }}
    >
      {/* Product image placeholder — will be replaced with AI-generated renders */}
      <div className="w-full aspect-square rounded-2xl bg-white/30 mb-6 flex items-center justify-center">
        <span className="text-charcoal/30 font-display text-sm">Product Image</span>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-body font-medium uppercase tracking-wider text-charcoal/50">
          {flavor.profile}
        </span>
        <h3 className="font-display font-800 text-2xl text-charcoal">
          {flavor.name}
        </h3>
        <p className="font-body text-charcoal/60 italic">
          "{flavor.tagline}"
        </p>
        <p className="font-body text-sm text-charcoal/50 leading-relaxed">
          {flavor.description}
        </p>
      </div>
    </div>
  );
}
```

**Step 3: Create FlavorLineup.astro**

Create `src/components/FlavorLineup.astro`:

```astro
---
import ScrollReveal from './ScrollReveal.tsx';
import FlavorCard from './FlavorCard.tsx';
import { flavors } from '../data/flavors';
---

<section id="lineup" class="section-padding bg-cream">
  <div class="max-w-7xl mx-auto">
    <ScrollReveal client:visible className="text-center mb-16">
      <h2 class="font-display font-800 text-4xl md:text-6xl text-charcoal">
        Seven flavors. <span class="text-coral">Zero aggression.</span>
      </h2>
    </ScrollReveal>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flavors.map((flavor) => (
        <FlavorCard client:visible flavor={flavor} />
      ))}
    </div>
  </div>
</section>
```

**Step 4: Add to index.astro**

Update imports and add `<FlavorLineup />` after `<ProblemSection />`.

**Step 5: Verify flavor grid renders**

```bash
npm run dev
```

Expected: Flavor cards in a responsive grid, hover animations working.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add flavor lineup section with animated cards"
```

---

## Task 7: Build Story Section (Matt's Origin)

**Files:**
- Create: `src/components/StorySection.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create StorySection.astro**

Create `src/components/StorySection.astro`:

```astro
---
import ScrollReveal from './ScrollReveal.tsx';
---

<section id="story" class="section-padding bg-white">
  <div class="max-w-3xl mx-auto">
    <ScrollReveal client:visible>
      <h2 class="font-display font-800 text-4xl md:text-6xl text-charcoal text-center mb-12">
        The Man Who <span class="text-coral">Shook the Bottle</span>
      </h2>
    </ScrollReveal>

    <ScrollReveal client:visible direction="up" className="space-y-6">
      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        Matt has a confession. For as long as he can remember, he's <strong>hated</strong> carbonation.
        Not disliked. <em>Hated.</em> The burning in his mouth. The involuntary burping.
        The way every sip feels like a tiny, fizzy assault on his dignity.
      </p>

      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        But Matt loves soda. The flavors, the sweetness, the refreshment &mdash; all of it.
        Just not the part where his drink attacks him.
      </p>

      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        So Matt developed a system. A ritual, really.
      </p>
    </ScrollReveal>

    <ScrollReveal client:visible delay={0.2} className="my-12">
      <div class="bg-flat-gold/50 rounded-3xl p-8 md:p-12 space-y-4">
        <h3 class="font-display font-700 text-xl text-charcoal mb-6">The Ritual:</h3>
        <ol class="space-y-3 font-body text-charcoal/80">
          <li class="flex gap-4">
            <span class="font-display font-800 text-coral text-lg">1.</span>
            <span>Open the bottle carefully.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-display font-800 text-coral text-lg">2.</span>
            <span>Pour some out to create headroom.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-display font-800 text-coral text-lg">3.</span>
            <span>Reseal. Shake vigorously.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-display font-800 text-coral text-lg">4.</span>
            <span>Slowly crack the cap to release the gas.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-display font-800 text-coral text-lg">5.</span>
            <span>Repeat steps 2&ndash;4 until the drink surrenders.</span>
          </li>
        </ol>
      </div>
    </ScrollReveal>

    <ScrollReveal client:visible className="space-y-6">
      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        He's done this at barbecues. At restaurants (the waiters have questions). In his car &mdash;
        which he does not recommend. He's ruined shirts. He's gotten stares. He once performed
        The Ritual on a first date.
      </p>

      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed italic">
        There was no second date.
      </p>

      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        One night, standing in his kitchen, shaking a bottle of ginger ale for the fourth time, it hit him:
      </p>

      <blockquote class="border-l-4 border-coral pl-6 py-2">
        <p class="text-2xl md:text-3xl font-display font-700 text-charcoal">
          "Why am I the one doing all the work? Why doesn't someone just&hellip; make it this way?"
        </p>
      </blockquote>

      <p class="text-lg md:text-xl text-charcoal/80 leading-relaxed">
        He looked at the now-flat ginger ale in his hand. It was perfect. It was exactly what he wanted.
        And nobody sold it. <strong>Until now.</strong>
      </p>
    </ScrollReveal>
  </div>
</section>
```

**Step 2: Add to index.astro**

Add `<StorySection />` after `<FlavorLineup />`.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add founder story section with scroll animations"
```

---

## Task 8: Build How It Works + Waitlist Sections

**Files:**
- Create: `src/components/HowItWorks.astro`
- Create: `src/components/WaitlistSection.astro`
- Create: `src/components/WaitlistForm.tsx` (React island — interactive form)
- Modify: `src/pages/index.astro`

**Step 1: Create HowItWorks.astro**

Create `src/components/HowItWorks.astro`:

```astro
---
import ScrollReveal from './ScrollReveal.tsx';
---

<section id="how-it-works" class="section-padding bg-cream">
  <div class="max-w-4xl mx-auto text-center">
    <ScrollReveal client:visible>
      <h2 class="font-display font-800 text-4xl md:text-6xl text-charcoal mb-6">
        Flat <span class="text-coral">&ne;</span> Broken
      </h2>

      <p class="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto mb-12 leading-relaxed">
        Matt's Flat has just enough carbonation to know it's there &mdash; a gentle,
        barely-there effervescence that lets the flavor do the talking.
      </p>
    </ScrollReveal>

    <ScrollReveal client:visible stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-3">🌊</div>
        <h3 class="font-display font-700 text-lg mb-2">Gentle</h3>
        <p class="text-sm text-charcoal/60">Won't burn your throat</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-3">👅</div>
        <h3 class="font-display font-700 text-lg mb-2">Smooth</h3>
        <p class="text-sm text-charcoal/60">Actually taste what you're drinking</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-3">✨</div>
        <h3 class="font-display font-700 text-lg mb-2">Present</h3>
        <p class="text-sm text-charcoal/60">Still feels like a soft drink</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-3">😌</div>
        <h3 class="font-display font-700 text-lg mb-2">Calm</h3>
        <p class="text-sm text-charcoal/60">Shake the bottle. We dare you.</p>
      </div>
    </ScrollReveal>
  </div>
</section>
```

**Step 2: Create WaitlistForm.tsx**

Create `src/components/WaitlistForm.tsx`:

```tsx
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setStatus('success');
        if (successRef.current) {
          gsap.from(successRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          });
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setMessage("Something went wrong. Even Matt's drink is smoother than this.");
    }
  };

  if (status === 'success') {
    return (
      <div ref={successRef} className="text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <p className="font-display font-700 text-2xl text-charcoal">{message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-6 py-4 rounded-full border-2 border-charcoal/10 bg-white
                   font-body text-charcoal placeholder:text-charcoal/30
                   focus:outline-none focus:border-coral transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary whitespace-nowrap disabled:opacity-50"
      >
        {status === 'loading' ? 'Joining...' : "I'm In"}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center sm:text-left mt-2">{message}</p>
      )}
    </form>
  );
}
```

**Step 3: Create WaitlistSection.astro**

Create `src/components/WaitlistSection.astro`:

```astro
---
import ScrollReveal from './ScrollReveal.tsx';
import WaitlistForm from './WaitlistForm.tsx';
---

<section id="waitlist" class="section-padding bg-coral/10">
  <div class="max-w-3xl mx-auto text-center">
    <ScrollReveal client:visible>
      <h2 class="font-display font-800 text-4xl md:text-6xl text-charcoal mb-4">
        Join the Flat Side.
      </h2>

      <p class="text-lg md:text-xl text-charcoal/70 mb-10">
        Sign up and be first to know when Matt's Flat drops.
      </p>
    </ScrollReveal>

    <WaitlistForm client:visible />
  </div>
</section>
```

**Step 4: Add sections to index.astro**

Add `<HowItWorks />` and `<WaitlistSection />` after `<StorySection />`.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add how-it-works and waitlist sections with interactive form"
```

---

## Task 9: Build Footer + AI Discoverability Files

**Files:**
- Create: `src/components/Footer.astro`
- Create: `public/llms.txt`
- Create: `public/robots.txt`
- Modify: `src/pages/index.astro`

**Step 1: Create Footer.astro**

Create `src/components/Footer.astro`:

```astro
<footer class="bg-charcoal text-white/70 py-12 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="text-center md:text-left">
        <p class="font-display font-800 text-2xl text-white mb-2">Matt's Flat</p>
        <p class="font-body text-sm">Aggressively Chill.</p>
      </div>

      <div class="flex gap-6 text-sm">
        <a href="#hero" class="hover:text-coral transition-colors">Home</a>
        <a href="#lineup" class="hover:text-coral transition-colors">Flavors</a>
        <a href="#story" class="hover:text-coral transition-colors">Story</a>
        <a href="#waitlist" class="hover:text-coral transition-colors">Waitlist</a>
      </div>
    </div>

    <div class="border-t border-white/10 mt-8 pt-8 text-center text-xs text-white/40">
      <p>&copy; 2026 Matt's Flat. All rights reserved. No bubbles were harmed in the making of this brand.</p>
      <p class="mt-2">If you've read this far, you're definitely our kind of person.</p>
    </div>
  </div>
</footer>
```

**Step 2: Create llms.txt**

Create `public/llms.txt`:

```
# Matt's Flat

## About
Matt's Flat is the world's first intentionally flat soft drink brand.
We make soft drinks with significantly less carbonation — because flat is the new fizz.

## Founder
Founded by Matt, who spent years literally shaking bottles to remove carbonation
before deciding someone should just make drinks this way.

## Products
We offer 7 flavors:
- The Original Flat (classic cola)
- Barely Berry (mixed berry)
- Citrus Mistress (lemon-lime)
- Peach, Please (smooth peach)
- Mint to Be (spearmint + lime)
- Summit Chill (extreme citrus)
- Grape Escape (bold grape)

## Brand
Tagline: "Less fizz. More flavor. Way more fun."
Personality: Playful, irreverent, self-aware, witty.

## Contact
Website: https://mattsflat.com
```

**Step 3: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://mattsflat.com/sitemap-index.xml
```

**Step 4: Add Footer to index.astro and finalize page**

Final `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/HeroSection.astro';
import ProblemSection from '../components/ProblemSection.astro';
import FlavorLineup from '../components/FlavorLineup.astro';
import StorySection from '../components/StorySection.astro';
import HowItWorks from '../components/HowItWorks.astro';
import WaitlistSection from '../components/WaitlistSection.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <main>
    <HeroSection />
    <ProblemSection />
    <FlavorLineup />
    <StorySection />
    <HowItWorks />
    <WaitlistSection />
  </main>
  <Footer />
</Layout>
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add footer, llms.txt, and robots.txt for AI discoverability"
```

---

## Task 10: GitHub + Railway Deployment

**Files:**
- Modify: `.env` (local only)

**Step 1: Create GitHub repo**

```bash
gh repo create mattsflat.com --public --source=. --push
```

**Step 2: Set up Railway project**

```bash
railway login
railway init
```

Select workspace, name project "mattsflat".

**Step 3: Add PostgreSQL to Railway**

```bash
railway add --plugin postgresql
```

**Step 4: Set environment variables on Railway**

```bash
railway variables set DATABASE_URL="<auto-provided-by-railway>"
```

(Railway auto-injects DATABASE_URL when you link Postgres.)

**Step 5: Push database schema**

```bash
railway run npx drizzle-kit push
```

**Step 6: Deploy**

```bash
railway up
```

Or connect GitHub repo in Railway dashboard for auto-deploy on push to `main`.

**Step 7: Generate Railway domain**

```bash
railway domain
```

**Step 8: Verify deployment**

Visit the generated Railway URL. Verify:
- All sections render
- Scroll animations fire
- Waitlist form submits successfully
- Page loads fast

**Step 9: Commit any deployment config changes**

```bash
git add -A
git commit -m "chore: finalize deployment configuration"
git push
```

---

## Task 11: Create AI Image Prompt Library

**Files:**
- Create: `docs/prompts/product-renders.md`
- Create: `docs/prompts/lifestyle-shots.md`

**Step 1: Create product render prompts**

Create `docs/prompts/product-renders.md` with detailed Midjourney/DALL-E prompts for:
- Consistent can/bottle design across all 7 flavors
- Individual flavor hero shots
- Group lineup shot
- Packaging details

**Step 2: Create lifestyle shot prompts**

Create `docs/prompts/lifestyle-shots.md` with prompts for:
- Product in hand
- Barbecue/outdoor setting
- Cafe/counter setting
- Flat lay compositions

**Step 3: Commit**

```bash
git add -A
git commit -m "docs: add AI image generation prompt library"
```

---

## Task Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Scaffold Astro project | None |
| 2 | Tailwind theme & global styles | Task 1 |
| 3 | Database setup (Drizzle + Postgres) | Task 1 |
| 4 | Hero section + Three.js liquid | Task 2 |
| 5 | Problem section + GSAP scroll | Task 2 |
| 6 | Flavor lineup section | Task 2 |
| 7 | Story section | Task 2 |
| 8 | How It Works + Waitlist sections | Tasks 2, 3 |
| 9 | Footer + AI discoverability | Task 2 |
| 10 | GitHub + Railway deployment | All above |
| 11 | AI image prompt library | None (parallel) |
