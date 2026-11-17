import fs from 'node:fs';
import path from 'node:path';

function pageRewrites(directory = path.join(process.cwd(), 'public')) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return pageRewrites(file);
    if (entry.name !== 'index.html') return [];
    const relative = path.relative(path.join(process.cwd(), 'public'), file).split(path.sep).join('/');
    const source = '/' + relative.replace(/(?:^|\/)index\.html$/, '');
    return [{ source, destination: '/' + relative }];
  });
}

export default {
  async rewrites() {
    return { beforeFiles: pageRewrites() };
  },
  async redirects() {
    return [
      { source: '/portfolio', destination: '/approach', permanent: true },
      { source: '/portfolio/:path*', destination: '/approach', permanent: true },
      { source: '/analysis.html', destination: '/about', permanent: true },
    ];
  },
};
