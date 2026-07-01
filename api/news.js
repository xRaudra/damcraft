export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const queries = [
    'startup India tech AI 2026',
    'UX design product fintech India',
    'IPO market business India 2026'
  ];

  const allItems = [];
  const seen = new Set();

  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) continue;
      const xml = await r.text();

      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let m;
      while ((m = itemRegex.exec(xml)) !== null) {
        const block = m[1];
        const titleRaw = (/<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(block) || /<title>(.*?)<\/title>/.exec(block))?.[1] || '';
        const link = /<link>(.*?)<\/link>/.exec(block)?.[1] || '';
        const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(block)?.[1] || '';
        const sourceName = /<source[^>]*>(.*?)<\/source>/.exec(block)?.[1] || '';

        // Google News titles are "Headline - Source Name"
        const parts = titleRaw.split(' - ');
        const title = parts.length > 1 ? parts.slice(0, -1).join(' - ') : titleRaw;
        const source = sourceName || (parts.length > 1 ? parts[parts.length - 1] : '');

        const clean = title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
        const key = clean.toLowerCase().slice(0, 60);

        if (clean.length > 15 && !seen.has(key)) {
          seen.add(key);
          allItems.push({ title: clean, source, pubDate, link });
        }
      }
    } catch (_) {}
  }

  return res.status(200).json({ items: allItems.slice(0, 25) });
}
