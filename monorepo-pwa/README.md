# Contador de Cliques — Entrega Final (PWA + API • Docker • CI)

Projeto exemplo para a entrega final do Bootcamp II — contador de cliques global.

## Como rodar local (desenvolvimento)

### API
```
cd apps/api
npm ci
npm run dev
# API em http://localhost:3000
```

### Web (dev)
```
cd apps/web
npm ci
npm run dev
# App em http://localhost:5173
```

## Rodar com Docker Compose
```
docker compose up --build
# web: http://localhost:8080
# api: http://localhost:3000/api/count
```

## Testes
- API unit: `cd apps/api && npm test`
- Playwright E2E: `cd apps/web && npx playwright test` (ou via CI)

## CI/CD
Workflows em `.github/workflows` fazem build, testes E2E e publicam `apps/web/dist` no GitHub Pages.

## Entrega
- Repositório público com esta estrutura
- Link do Pages (GitHub Pages)
- Link do run do CI (última execução)
- Artefatos: `web-dist`, `playwright-report`
