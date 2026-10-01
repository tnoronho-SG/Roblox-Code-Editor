# Roblox Block Library Framework

Este projeto estabelece a base de uma arquitetura profissional para um editor visual de programação para Roblox, inspirado em Scratch, com produção de Luau.

## Editor online

Acesse o editor publicado no [GitHub Pages](https://tnoronho-sg.github.io/Roblox-Code-Editor/).

## Visão geral

A biblioteca foi estruturada em fases, começando pela Fase 1:

- arquitetura central
- registro de blocos
- sistema de tipos
- sistema de referências
- sistema de contexto
- sistema de escopo
- CodeBuilder
- gerador inicial de Luau
- testes automatizados

Para o mapa completo da interface, do fluxo de dados e da estrutura atual do repositorio, consulte [Documentação do site](docs/estrutura-do-site.md). O manifesto estruturado para planejar a integracao MCP esta em [docs/mcp-site-map.json](docs/mcp-site-map.json).

O editor usa React para renderizar cada bloco e o painel de código, mantendo a árvore visual, o catálogo e os geradores modulares em `src/`. O Express serve a aplicação e o bundle de navegador, compilado com esbuild.

```bash
npm install
npm start
```

Abra `http://localhost:3000`. Execute `npm test` para validar os módulos de arquitetura e os componentes React.

## Estrutura

```text
src/
  blocks/
    movement/
      moveObjectBy.js
  core/
    BlockRegistry.js
    TypeSystem.js
    ContextSystem.js
    ReferenceSystem.js
    ScopeSystem.js
    CodeBuilder.js
  generators/
    luau/
      movement/
        moveObjectBy.js

tests/
  framework.test.js
```

## Componentes criados

### BlockRegistry
Registra blocos de forma centralizada e reutilizável.

### TypeSystem
Valida compatibilidade entre tipos e regras de conversão seguras.

### ContextSystem
Controla compatibilidade entre client/server/shared/both.

### ReferenceSystem
Centraliza referências globais do Roblox, como Player, Workspace e Character.

### ScopeSystem
Controla visibilidade e escopo de variáveis.

### CodeBuilder
Cria código Luau indentado e legível sem concatenação caótica de strings.

### Generator da categoria movement
Inclui geração para mover objetos por distância.

## Como testar

```bash
npm test
```

## Fase 2 planejada

- Eventos
- Aparência
- Controle
- Lógica
- Variáveis
- Matemática

## Observação

Esta base foi criada de forma modular para crescer para 100+ blocos sem exigir reescrita da arquitetura.
