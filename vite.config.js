/*import { defineConfig } from 'vite';

// GitHub Actions define GITHUB_REPOSITORY como "usuario/nome-do-repositorio".
// Isso configura automaticamente o caminho correto para projetos no GitHub Pages.
// Para um repositório usuario.github.io, o site fica na raiz do domínio.
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repository && !repository.endsWith('.github.io')
  ? `/${repository}/`
  : '/';

export default defineConfig({ base });

*/
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/MyCityGame/',
});
