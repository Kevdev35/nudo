<!-- at-mos:start -->
## at-mos — generador de @theme para Tailwind v4

Este proyecto usa **at-mos** para generar y mantener el bloque `@theme` de Tailwind v4.
Si no está instalado: `npx @kevdev35/at-mos` o `pnpm add -g @kevdev35/at-mos`.

### Uso en modo headless (recomendado para agentes)

Todos los comandos responden JSON (`{"ok":true|false,...}`). Añade `--json`.
Para el contrato completo: `at-mos ai --json`.

```bash
at-mos env --json                                          # reconocer el proyecto
at-mos init --from tokens.json --output <css> --yes --json # generar el @theme
at-mos list --json                                         # listar variables
at-mos update --add --name --color-x --value "#fff" --json # agregar variable
at-mos update --edit --name --color-x --value "#fff" --json # editar variable
at-mos update --delete --names --color-x --json            # eliminar variable
```

### Reglas

- `stdout` = solo JSON; `stderr` = mensajes humanos (usa `2>/dev/null` para parsear limpio).
- Errores con categoría para saber si fue culpa del agente o de la herramienta:
  - `caller` → el comando/datos fueron incorrectos. Corrige y reintenta.
  - `environment` → estado del proyecto (sin CSS, package.json inválido). Adaptate.
  - `tool` → bug interno de at-mos. No reintentes; reporta con el stack incluido.
<!-- at-mos:end -->
