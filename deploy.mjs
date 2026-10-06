// Builds the app and publishes dist/ to the gh-pages branch of the origin repo (GitHub Pages).
// Usage: npm run deploy
import { execSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = root + 'dist';
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

const remote = execSync('git remote get-url origin', { cwd: root }).toString().trim();
run('npm run build', root);
writeFileSync(dist + '/.nojekyll', '');
if (existsSync(dist + '/.git')) rmSync(dist + '/.git', { recursive: true, force: true });
run('git init -q', dist);
run('git checkout -q -b gh-pages', dist);
run('git add -A', dist);
run('git -c core.autocrlf=false commit -q -m "Deploy"', dist);
run('git push -q -f ' + remote + ' gh-pages', dist);
rmSync(dist + '/.git', { recursive: true, force: true });
console.log('Deployed. GitHub Pages rebuilds in about a minute.');
