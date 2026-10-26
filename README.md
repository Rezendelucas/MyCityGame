# Color Grid — Browser Game MVC

Protótipo web de um jogo de colocação de blocos em um tabuleiro isométrico. A versão web é o MVP; a lógica principal permanece independente de plataforma para permitir adicionar Electron (desktop) e Capacitor (Android) futuramente.

## Requisitos
- Node.js 20.19+ ou 22.12+
- npm

## Executar localmente
```bash
npm install
npm run dev
```
Abra o endereço local indicado pelo Vite.

## Testar e gerar build
```bash
npm test
npm run build
npm run preview
```

## Publicar no GitHub Pages
1. Envie os arquivos para a branch `main` do repositório.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. O workflow `.github/workflows/pages.yml` roda testes, faz o build e publica no Pages somente se os testes passarem.

### Caminho de publicação do Vite
Se o repositório for `https://USUARIO.github.io/NOME-DO-REPOSITORIO/`, edite `vite.config.js` e configure `base: '/NOME-DO-REPOSITORIO/'`. Para um repositório especial chamado `USUARIO.github.io`, o caminho padrão `/` funciona.

## Arquitetura
- `src/models/`: estado e regras de colocação de blocos.
- `src/views/`: telas e desenho do tabuleiro em Canvas.
- `src/controllers/`: coordena eventos, estado e renderização.
- `src/styles/`: estilos responsivos.
- `tests/`: testes automatizados do Model.
- `.github/workflows/pages.yml`: testes, build e publicação automática.

**Portabilidade:** mantenha as regras do jogo dentro de `models`. Recursos específicos de navegador, Electron ou Capacitor devem ser adicionados por serviços separados quando forem necessários.
