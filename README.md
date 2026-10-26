# Browser Game MVC

MVP web de um jogo, construído com JavaScript, Vite e MVC. A versão web é a prioridade; a estrutura deixa a lógica principal independente para que Electron (desktop) e Capacitor (Android) possam ser adicionados depois.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço local mostrado pelo Vite.

## Testes e build

```bash
npm test
npm run build
npm run preview
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. No repositório, entre em **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. A cada `push` na branch `main`, o workflow `.github/workflows/pages.yml` executa os testes, gera o build e publica no Pages apenas se os testes passarem.
5. Acesse a URL indicada em **Settings → Pages** ou na execução do workflow.

### Importante sobre URLs de repositório

O Vite precisa saber se o site será publicado em `https://USUARIO.github.io/` ou em `https://USUARIO.github.io/NOME-DO-REPOSITORIO/`.

- Para um repositório chamado `USUARIO.github.io`, o padrão `/` funciona.
- Para qualquer outro repositório, abra `vite.config.js` e defina `base` como `'/NOME-DO-REPOSITORIO/'` antes de publicar.

## Arquitetura

- `src/models/`: estado e regras do jogo, sem dependência do DOM.
- `src/views/`: renderização e eventos da interface.
- `src/controllers/`: coordena Model e View.
- `src/styles/`: estilos.
- `tests/`: testes automatizados do Model.
- `.github/workflows/pages.yml`: testes, build e deploy automático.

**Regra para manter portabilidade:** não coloque APIs do navegador, Electron ou Capacitor dentro do Model. Quando precisarmos de armazenamento, áudio, notificações ou recursos nativos, criaremos interfaces/serviços separados para cada plataforma.
