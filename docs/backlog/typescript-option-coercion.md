# Typescript option coercion at meta call-sites

- **Package:** `@hexadrop/eslint-config` (meta-package)
- **Kind:** Smell — possible Primitive Obsession + duplicated call-site literal
- **Surfaced in:** Code review of PR #1047 (standards axis, findings 1 and 3).
- **Pick up when:** a third `react(...)` call-site appears, or the react package's `typescript` option stops being a plain boolean.

## The smell

The meta's `typescript` option is `boolean | string | string[]`; the react package takes `boolean`. Both meta call-sites crush it with the same literal:

```ts
// packages/eslint-config/src/factory.ts and scripts/typegen.ts
react({ peerCheck: false, react: options.react, typescript: Boolean(options.typescript) });
```

Two smells travelling together:

- **Primitive Obsession:** `Boolean(...)` reduces a domain concept ("which typescript integration is active") to a coercion, repeated at every call-site.
- **Duplicated Code:** the identical options object appears verbatim in `factory.ts` and `scripts/typegen.ts`.

## Candidate fixes

Either, not both:

1. Extract a shared `composeReact(options)` helper inside the meta-package so the mapping lives in one place.
2. Widen the react package's `typescript` option to accept the meta's tri-state and coerce internally, deleting the adapter at both call-sites.

Option 2 changes the published API of `@hexadrop/eslint-config-react`; option 1 is internal. Decide when the trigger fires, not before.

## Why deferred

Two call-sites is the borderline case for extraction, and the current mapping is provably behavior-preserving (golden snapshots stayed byte-identical). Extracting now would be Speculative Generality.
