---
description: How Charpente UI generates the ids behind label[for] and aria-describedby, and how to take them over.
---

# Ids

Accessible wiring is held together by ids: `label[for]` points at `input[id]`, `aria-describedby` lists the ids of
every hint. Charpente generates those ids so you never write them — and steps aside the moment you do.

One rule covers the whole library: **explicit always beats generated.**

## Where ids come from

Each component resolves its id through the same cascade, stopping at the first value it finds.

| Component                          | Cascade                                                     |
|------------------------------------|-------------------------------------------------------------|
| `CInput`, `CTextarea`, `CSelect`, `CFile`, `CCheckbox`, `CRadio` | your `id` → the parent `CField`'s id → generated |
| [`CField`](/components/field)      | your `id` → generated                                        |
| [`CLabel`](/components/label)      | your `for` → the injected field id                           |
| [`CSupportingText`](/components/supporting-text) | your `id` → generated                          |
| [`CForm`](/components/form)        | your `id` → generated                                        |

So this markup needs no id at all:

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
    <CSupportingText>We never share it.</CSupportingText>
</CField>
```

```html
<div>
    <label for="cui-v-0">Email</label>
    <input id="cui-v-0" type="email" aria-describedby="cui-v-1"/>
    <p id="cui-v-1">We never share it.</p>
</div>
```

## Taking over

Pass an `id` anywhere and it is used as-is — the components around it adapt instead of overriding you.

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput id="signup-email" v-model="email" type="email"/>
</CField>
```

The label follows the control, not the reverse: it renders `for="signup-email"`. The same holds for a partial
takeover — set the id on the control and leave the hint generated, or the other way round. Nothing needs to be
consistent, because nothing is hardcoded.

Setting it on the field is usually what you want, since it names the pairing in one place:

```vue
<CField id="signup-email">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
</CField>
```

::: warning
`id` on `CField` does **not** land on the wrapper `<div>`. It names the label/control pairing — the same id on two
elements would be invalid HTML. Target the wrapper with `class` instead. See
[Field › Precedence](/components/field#precedence).
:::

## The `cui-` prefix

Generated ids are prefixed `cui-` so they can never collide with an id from your app or from another library sharing
the page. Yours are never touched: `id="email"` stays `email`.

If you render several Vue apps on one page, give each one an id prefix so their generated ids stay distinct — Vue's
`useId()` sits underneath ours, so the setting flows through:

```ts
app.config.idPrefix = 'checkout';
```

## Ids are reactive

An id can change at runtime and the wiring follows. `CSupportingText` unregisters its previous id and registers the new
one, so `aria-describedby` never keeps a stale reference:

```vue
<CSupportingText :id="`hint-${locale}`">{{ t('hint') }}</CSupportingText>
```

This is worth knowing mainly because it makes the opposite safe: hints that mount and unmount conditionally drop out of
`aria-describedby` on their own.

## Controls the field doesn't own

`CField` shares its id through provide/inject, which only reaches Charpente components. A plain `<input>` or a
third-party date picker gets nothing — the field's slot hands you the values to bind by hand:

```vue
<CField v-slot="{ id, describedBy, invalid }">
    <CLabel>Starts on</CLabel>
    <ThirdPartyDatePicker :input-id="id" :aria-describedby="describedBy" :aria-invalid="invalid || undefined"/>
</CField>
```

::: tip
A third-party component is only accessible if it forwards that id to its real `<input>`. Check its API
(`uid`, `input-id`, `inputProps`…) rather than assuming a plain `id` lands on the right element.
:::

## Groups use `name`, not `id`

A single id cannot name a set of radios, so [`CRadioGroup`](/components/radio) and
[`CCheckboxGroup`](/components/checkbox) generate a shared `name` instead — that is what keeps native arrow-key
navigation working. Same cascade: your `name` wins.

```vue
<CRadioGroup v-model="plan" name="plan">
    <legend>Plan</legend>
    <!-- … -->
</CRadioGroup>
```

Inside a group, the items receive **no** field id: a `CField` wrapping the whole group describes it as a whole, so the
`<fieldset>` carries `aria-describedby` and `aria-invalid` and the items carry neither. Wrap each item in its own
`CField` when it needs its own label.

::: warning
Because there is no field id inside a group, `CLabel` has nothing to bind to and renders a `<label>` attached to
nothing — silently. Name a group with `<legend>`. This applies to a `CLabel` placed between the `CField` and the group
too: it picks up an id that ends up on no element.
:::

## Server-side rendering

Generated ids are stable across server and client, so nothing changes on hydration. Do not derive ids from a counter,
`Math.random()` or `crypto.randomUUID()` in your own components — that is exactly the mismatch `useId()` exists to
avoid.

## See also

- [Accessibility](/guide/accessibility) — what the platform does, what the library wires, what is left to you
- [Field › Precedence](/components/field#precedence) — the same rules, per attribute
