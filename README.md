# Gateway Confluence

A community platform for East Portland's Gateway district — transit-centered, culturally plural, anti-displacement.

**Location:** 1708 NE 106th Avenue, Portland, Oregon 97220
**Status:** In development — [Strategic Plan (PDF)](docs/Gateway-Confluence-Strategic-Plan-EN.pdf)

---

## What Is This?

Gateway Confluence is a community-driven initiative serving one of the most diverse neighborhoods in Oregon:

- **40+ languages** spoken
- **80+ countries** of origin represented
- **50,000+** residents
- **500+** small businesses, 60% immigrant-owned

This platform supports community organizing, mutual aid, and shared decision-making for the people already here. It is not a revitalization plan. It is a plan for staying.

## Values

- **Anti-Displacement** — Development must not displace existing residents or businesses
- **Cultural Plurality** — Gateway's diversity is a foundation to build on
- **Community Governance** — Residents make decisions about their own neighborhood
- **Infrastructure as Dignity** — Childcare, food access, and workforce training are rights
- **Transit-Centered Equity** — Public transit should connect people to opportunity

## Features

| Feature | Status |
|---|---|
| Strategic plan viewer (8 MDX sections) | Done |
| Community resources directory | Done |
| Events calendar with RSVP | Done |
| About, Contact, Get Involved, News pages | Done |
| User auth (email, Google, phone) | Done |
| Community forum with categories | Done |
| Mutual aid board (offer/request) | Done |
| User profiles | Done |
| Messaging & groups | Planned |
| Admin dashboard & leadership handoff | Planned |

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Content:** MDX via [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Backend:** [Supabase](https://supabase.com) (Auth, PostgreSQL, Realtime)
- **Maps:** [Leaflet.js](https://leafletjs.com) + OpenStreetMap
- **Deploy:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/devinmacarthur/gateway-confluence.git
cd gateway-confluence
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

The site runs without Supabase — all interactive features (auth, forum, mutual aid) gracefully degrade and show placeholder content.

### Supabase setup (optional)

To enable auth and community features, create a [Supabase project](https://supabase.com) and add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
  app/                  # Next.js pages (App Router)
    about/              # About page
    auth/               # Login, signup, password reset
    community/          # Forum, mutual aid hub
    contact/            # Contact page
    events/             # Events calendar
    get-involved/       # Volunteer & participate
    news/               # Community news
    plan/               # Strategic plan viewer
    profile/            # User profile
    resources/          # Community resources directory
  components/
    auth/               # Auth forms, OAuth, user menu
    community/          # Forum, mutual aid, event cards
    layout/             # Header, footer
    plan/               # Plan navigation
    ui/                 # shadcn/ui primitives
  content/
    plan/en/            # Strategic plan MDX content (8 sections)
  lib/
    auth/               # Server actions for auth
    mdx/                # MDX utilities
    supabase/           # Supabase client helpers
docs/                   # Strategic plan translations & PDFs
```

## Strategic Plan Documents

The full strategic plan is available in 6 languages:

| Language | Markdown | PDF |
|---|---|---|
| English | [EN.md](docs/Gateway-Confluence-Strategic-Plan-EN.md) | [EN.pdf](docs/Gateway-Confluence-Strategic-Plan-EN.pdf) |
| Spanish | [ES.md](docs/Gateway-Confluence-Strategic-Plan-ES.md) | [ES.pdf](docs/Gateway-Confluence-Strategic-Plan-ES.pdf) |
| Vietnamese | [VI.md](docs/Gateway-Confluence-Strategic-Plan-VI.md) | [VI.pdf](docs/Gateway-Confluence-Strategic-Plan-VI.pdf) |
| Chinese | [ZH.md](docs/Gateway-Confluence-Strategic-Plan-ZH.md) | [ZH.pdf](docs/Gateway-Confluence-Strategic-Plan-ZH.pdf) |
| Russian | [RU.md](docs/Gateway-Confluence-Strategic-Plan-RU.md) | [RU.pdf](docs/Gateway-Confluence-Strategic-Plan-RU.pdf) |
| Lebanese Arabic | [LB.md](docs/Gateway-Confluence-Strategic-Plan-LB.md) | [LB.pdf](docs/Gateway-Confluence-Strategic-Plan-LB.pdf) |

An [interactive HTML version](docs/Gateway-Confluence-Strategic-Plan.html) with maps is also available.

## Contributing

This is a community project and we welcome contributors. Here's how you can help:

- **Developers** — Pick up an issue, improve accessibility, add features
- **Translators** — Help translate content into more languages
- **Designers** — Improve UI/UX, especially for multilingual and mobile users
- **Community members** — Test the platform, report issues, suggest features

### How to contribute

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` to verify everything compiles
5. Open a pull request

### Areas where we need help

- Database schema and Supabase migrations
- Accessibility audit (WCAG 2.1 AA)
- Mobile responsive testing
- Additional language translations
- Community content and resource data
- Deployment and CI/CD setup

## License

This project is open source. Community-built, community-owned.

## Contact

Open an issue on this repo or reach out through the contact page once the site is deployed.
