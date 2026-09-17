# Roblox Block Library Framework

Este projeto estabelece a base de uma arquitetura profissional para um editor visual de programação para Roblox, inspirado em Scratch, com produção de Luau.

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
