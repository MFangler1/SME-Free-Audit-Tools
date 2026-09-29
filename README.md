# FREE SEO / AI Visibility Audit Tool

Source mirror of the AI Visibility Audit web application built for **AiConsultancy.org.uk**.

Live app: https://seo.aiconsultancy.org.uk

## What this is

A Next.js 14 (App Router) + TypeScript application that:
- Runs a free AI Visibility "snapshot" of any website (crawls up to 15 pages)
- Scores AI discoverability 0-100 using an LLM analysis
- Captures leads (email) and stores audits in PostgreSQL (Prisma)
- Sends email notifications: visitor confirmation, admin new-audit alert, admin purchase request
- Promotes the paid **Full AI Visibility Action Plan** (£197, or £138 within 7 days)

Sole consultant & founder: **Mark Fenty** · Support@AiConsultancy.org.uk

## Tech stack

- Next.js 14, React, TypeScript
- Tailwind CSS + shadcn/ui components
- Prisma ORM + PostgreSQL
- Abacus.AI APIs for LLM analysis and email notifications

## Running locally

```bash
cd nextjs_space
cp .env.example .env      # then fill in real values
yarn install
yarn prisma generate
yarn dev                 # http://localhost:3000
```

## Notes

- The `.env` file is intentionally excluded. Populate it from `.env.example`.
- This is a code mirror only. The live site is built and hosted on the Abacus.AI platform; pushing here does not redeploy the live site.