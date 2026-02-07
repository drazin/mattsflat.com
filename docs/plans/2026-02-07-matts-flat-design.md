# Matt's Flat — Brand & Website Design Document

**Date:** 2026-02-07
**Status:** Approved
**Project:** mattsflat.com

---

## 1. Brand Overview

### Concept
Matt's Flat is a new category of soft drink — significantly less carbonated than traditional sodas. The "flat" isn't a defect, it's the entire point. Less fizz means more flavor, a gentler drinking experience, and no more carbonation-related discomfort.

### Purpose
This is a market test disguised as a premium brand launch. The goal is to:
- Generate genuine consumer interest and measure demand
- Build a brand compelling enough to attract buyers or investors
- Create a web presence that looks and feels like an established beverage company

### Brand Personality
**Playful & irreverent.** Self-aware, witty, a bit cheeky. We poke fun at the absurdity of aggressive carbonation. The humor is confident but never mean. Think Liquid Death's energy applied to the opposite concept.

### Taglines & Slogans
- **Primary:** *"Less fizz. More flavor. Way more fun."*
- "Aggressively chill."
- "The soda that won't fight back."
- "Finally, a drink that doesn't assault your taste buds."
- "Flat is the new fizz."

---

## 2. The Founder Story

Matt has waged a lifelong war against carbonation. While the rest of the world chugs fizzy drinks without a second thought, Matt has been performing a secret ritual: crack the cap, pour some out to create headroom, shake vigorously, slowly release the gas, and repeat — sometimes four or five times — just to get a drink he can actually enjoy.

At barbecues. At restaurants. In his car (don't try this). The man has ruined shirts. He's gotten looks. He once de-fizzed a Coke at a first date. There was no second date.

Carbonation hurts his mouth. Makes him gassy. Makes him burp. Every soda is a battle he didn't sign up for.

One day he thought: *"Why am I the one doing all the work? Why doesn't someone just... make it this way?"*

So he did.

**Matt's presence on the site:**
- Hero section: First-person voice — "I spent years shaking bottles so you don't have to."
- About/Story section: Full embellished origin story told with humor and warmth
- Throughout copy: Matt's personality bleeds into everything — product descriptions, error pages, waitlist confirmations
- Matt serves as the spokesperson/voice of the brand — not a faceless corporation, but a guy who got tired of burping

---

## 3. Visual Identity

### Color Palette

**Base colors:**
- Soft cream/off-white backgrounds
- Light pastels per flavor (see Section 5)

**Accent:**
- Punchy coral or electric violet for CTAs and emphasis

**Text:**
- Deep charcoal (#2D2D2D range) — not pure black, for readability with personality

### Typography
- **Headings:** Rounded, friendly display font — playful but legible
- **Body:** Clean sans-serif — readable, modern
- Nothing too serious. The typography should feel approachable.

### Overall Aesthetic
Pastel & soft with pops of bold color. The palette mirrors the product concept — the drink is softer than regular soda, so the visual identity is softer too, but with enough punch to stay playful and irreverent. Stands out against the loud, aggressive branding typical of the soda market.

---

## 4. Target Audience

Broad appeal across multiple segments:
1. **Health-conscious millennials/Gen-Z** — Find heavy carbonation uncomfortable, associate "flat" with a more natural, gentle experience
2. **Premium/artisan beverage enthusiasts** — Appreciate unique positioning and branding over mass-market appeal
3. **Broad mainstream** — Positioning as the next big thing, like how LaCroix carved out sparkling water
4. The market test will reveal which demographic responds strongest

---

## 5. Product Lineup (7 Flavors)

### Hero/Flagship
| # | Name | Flavor Profile | Tagline | Pastel Color |
|---|------|---------------|---------|-------------|
| 1 | **The Original Flat** | Classic cola | *"All the taste. None of the assault."* | Soft cream/gold |

### Supporting Lineup
| # | Name | Flavor Profile | Tagline | Pastel Color |
|---|------|---------------|---------|-------------|
| 2 | **Barely Berry** | Mixed berry | *"Bursting with flavor. Not your stomach."* | Soft lavender |
| 3 | **Citrus Mistress** | Lemon-lime | *"She's smooth and she knows it."* | Pale yellow |
| 4 | **Peach, Please** | Smooth peach | *"So smooth it's almost suspicious."* | Soft peach/coral |
| 5 | **Mint to Be** | Spearmint + lime | *"The drink you were destined for."* | Mint green |
| 6 | **Summit Chill** | Extreme citrus | *"We climbed to the top and took a nap."* | Neon green pastel |
| 7 | **Grape Escape** | Bold grape | *"Finally free from the fizz."* | Soft purple |

Each flavor gets:
- Its own pastel colorway
- A punny name in the display font
- A one-liner in Matt's voice
- An AI-generated can/bottle render
- A dedicated color scheme carrying through hover states and animations

---

## 6. Site Architecture

### Launch: Single-Page Scrolling Site

**Sections (top to bottom):**

1. **Hero** — Big, bold, impossible to ignore. Flagship flavor front and center with a punny headline, Matt's voice, and a "Join the Waitlist" CTA. Pastel background with bold accent on the button. Heavy liquid animation (WebGL/Three.js).

2. **The Problem** — Quick, funny section about carbonation being overrated. "Your drink shouldn't hurt." Short, punchy copy. Tongue-in-cheek comparison: regular soda vs. Matt's Flat.

3. **The Lineup** — All 7 flavors in a horizontal scroll or grid. Each flavor gets its own pastel color, punny name, and one-liner. Hero flavor slightly larger/featured. Scroll-triggered GSAP animations.

4. **The Story** — Matt's origin story. Conversational, funny, human. The emotional hook that makes people care and share.

5. **How It Works** — Brief explainer on what "less carbonated" means. Not science-heavy — keep it playful. "Just enough fizz to know it's there. Not enough to fight back."

6. **Waitlist/Newsletter CTA** — Email capture form. Simple, witty microcopy. "Be the first to taste the future of flat." Stored in Railway Postgres.

7. **Footer** — Social links (placeholder OK), legal bits, one last Matt quip.

### Future Pages (Architected, Not Built at Launch)
- `/about` — Expanded founder story
- `/flavors` — Individual flavor detail pages (SEO value)
- `/faq` — "Yes, it's supposed to be flat."

---

## 7. Technical Architecture

### Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Astro | Zero JS by default, islands architecture, perfect for content/marketing sites |
| **Interactive Islands** | React | Used only where needed (animations, forms) |
| **Styling** | Tailwind CSS | Fast to build, easy to maintain, great for the pastel palette |
| **Animation (Core)** | GSAP + ScrollTrigger | Industry standard for complex scroll-based web animation |
| **Animation (Hero)** | Three.js / WebGL | Real-time liquid simulation for the hero section |
| **Animation (Details)** | Lottie | Pre-rendered micro-animations (bubbles, can rotations) |
| **Database** | PostgreSQL (Railway) | Waitlist email storage, fully owned data |
| **ORM** | Drizzle ORM | Lightweight, TypeScript-first, no codegen, fast cold starts |
| **Analytics** | Google Analytics 4 | Industry standard, familiar reporting |
| **Deployment** | Railway | Auto-deploy from GitHub main branch |
| **Source Control** | GitHub | CI/CD via Railway GitHub integration |

### SEO & Performance
- Static site generation (SSG) for all marketing content
- Image optimization via Astro's built-in image handling
- Proper semantic HTML throughout
- Meta tags, Open Graph, Twitter Cards
- `sitemap.xml` and `robots.txt` auto-generated
- JSON-LD structured data (Organization, Product schemas)

### AI Discoverability
- `llms.txt` at root — tells AI crawlers about the brand
- Structured data parseable by AI systems
- Clean semantic markup for LLM comprehension

### Waitlist API
- `POST /api/waitlist` — accepts email, validates, stores in Postgres
- Basic duplicate detection
- Returns confirmation with Matt-flavored copy
- Future: admin export endpoint

---

## 8. Animation Vision

The site should feel alive. The playful brand demands motion.

### Hero Section
- **Liquid simulation** via Three.js/WebGL — real-time, interactive, responds to scroll or mouse movement
- The flagship product sits in or emerges from flowing liquid
- Parallax depth effects

### Scroll Storytelling (GSAP + ScrollTrigger)
- Flavor cards animate in as you scroll through the lineup
- Text reveals with character-by-character or word-by-word animation
- Section transitions with smooth parallax
- The "Problem" section could animate a fizzy drink shaking violently, then cut to a calm Matt's Flat

### Micro-Interactions (Lottie + CSS)
- Subtle bubble animations throughout (but gentle — on brand)
- Hover effects on flavor cards (color shifts, gentle float)
- CTA button interactions
- Loading states with brand personality

### Performance Guardrails
- Animations only load in their respective Astro islands
- Respect `prefers-reduced-motion` for accessibility
- Lazy-load heavy animation sections
- Mobile-optimized versions (simpler animations for smaller screens/lower GPU)

---

## 9. AI Product Imagery Strategy

Since there is no physical product, all product imagery will be AI-generated.

### What We Need
- Hero product shot (flagship "The Original Flat" can/bottle)
- Individual renders for all 7 flavors
- Lifestyle/context shots (product on a table, in hand, at a barbecue)
- Flavor-specific ingredient/vibe imagery (berries, peaches, mint leaves, etc.)

### Approach
- Craft detailed prompts for AI image generators (Midjourney, DALL-E, etc.)
- Establish consistent can/bottle design across all flavors
- Each flavor gets its pastel colorway applied to the packaging
- Build a prompt library in `docs/prompts/` for reproducibility

---

## 10. Deployment & Infrastructure

### GitHub Repository
- Repo: `mattsflat.com` (or `matts-flat`)
- Branch strategy: `main` = production
- GitHub Actions for linting/type checking (optional)

### Railway Setup
- **Web service:** Astro SSG build, served as static site
- **Database:** PostgreSQL instance for waitlist
- **Auto-deploy:** Connected to GitHub `main` branch
- **Domain:** mattsflat.com (to be configured)

---

## 11. Success Metrics

For the market test:
- Waitlist signups (primary KPI)
- Time on site
- Scroll depth (how far do people get?)
- Social shares / referral traffic
- Direct inquiries about the brand or investment
- GA4 event tracking on all CTAs
