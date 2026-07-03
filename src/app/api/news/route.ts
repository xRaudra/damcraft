import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const GENERAL_QUERIES = [
  'startup India tech AI 2026',
  'UX design product fintech India',
  'IPO market business India 2026',
]

const MARKET_QUERIES = [
  'NSE BSE India stock market buy sell recommendation 2026',
  'IPO India 2026 subscribe grey market premium GMP',
  'Nifty Sensex market outlook analyst Economic Times',
  'India stock market CNBC Moneycontrol top picks',
]

interface NewsItem {
  title: string
  source: string
  pubDate: string
  link: string
}

async function fetchRSS(queries: string[]): Promise<NewsItem[]> {
  const allItems: NewsItem[] = []
  const seen = new Set<string>()

  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!r.ok) continue
      const xml = await r.text()

      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      let m
      while ((m = itemRegex.exec(xml)) !== null) {
        const block = m[1]
        const titleRaw =
          (/<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(block) ||
            /<title>(.*?)<\/title>/.exec(block))?.[1] || ''
        const link = /<link>(.*?)<\/link>/.exec(block)?.[1] || ''
        const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(block)?.[1] || ''
        const sourceName = /<source[^>]*>(.*?)<\/source>/.exec(block)?.[1] || ''

        const parts = titleRaw.split(' - ')
        const title = parts.length > 1 ? parts.slice(0, -1).join(' - ') : titleRaw
        const source = sourceName || (parts.length > 1 ? parts[parts.length - 1] : '')

        const clean = title
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .trim()
        const key = clean.toLowerCase().slice(0, 60)

        if (clean.length > 15 && !seen.has(key)) {
          seen.add(key)
          allItems.push({ title: clean, source, pubDate, link })
        }
      }
    } catch {
      // skip failed feeds
    }
  }

  return allItems
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'general'
  const queries = type === 'market' ? MARKET_QUERIES : GENERAL_QUERIES
  const items = await fetchRSS(queries)

  return NextResponse.json({ items: items.slice(0, 25) }, { headers: CORS_HEADERS })
}
