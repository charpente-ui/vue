---
description: How Charpente UI compares to headless widget libraries, form frameworks and styled component libraries — and when each one is the better answer.
---

# Comparison

Charpente UI is often put next to libraries it does not really compete with. It is not a smaller Reka UI, nor a lighter
VeeValidate: it sits **one layer below both**, on the native form controls the browser already ships.

This page places it against the three families it gets compared to, and says plainly where each of them wins.

## The three families

| Family                                                      | What it gives you                                                   | What it costs                                           |
|-------------------------------------------------------------|---------------------------------------------------------------------|---------------------------------------------------------|
| **Headless widgets** — [Reka UI], [Ark UI], [Headless UI]   | Widgets the platform lacks: combobox, date picker, dialog           | Composed markup, keyboard behaviour reimplemented in JS |
| **Form frameworks** — [VeeValidate], [FormKit], [Vuelidate] | Validation state: `dirty`, `touched`, schemas, submission lifecycle | A second source of truth beside the browser's           |
| **Styled libraries** — [PrimeVue], [Vuetify], [Naive UI]    | A finished look, out of the box                                     | A theme to override, CSS you did not choose             |
| **Charpente UI**                                            | The wiring around native controls, and nothing else                 | No widgets, no form state, no styles                    |

## Versus headless widget libraries

Reka UI, Ark UI and Headless UI exist because the platform has no accessible combobox, no date picker, no modal. They
build those in JavaScript — roving `tabindex`, focus traps, `aria-activedescendant`, dismissable layers — and that work
is genuinely hard, genuinely necessary, and genuinely theirs.

Charpente builds none of it, because a `<select>`, a `<input type="checkbox">` and a radio group already exist.

|                            | Charpente                        | Headless widget libraries                                 |
|----------------------------|----------------------------------|-----------------------------------------------------------|
| Markup rendered            | The native element, alone        | A composition of parts (root, trigger, content…)          |
| Keyboard behaviour         | The browser's                    | Reimplemented in JavaScript, tested across screen readers |
| API surface                | HTML attributes you already know | A component API to learn per widget                       |
| Widgets the platform lacks | **None**                         | Their entire reason to exist                              |

Concretely, this:

```vue

<CInput v-model="email" type="email" required class="my-input"/>
```

renders one `<input>` carrying `type`, `required` and `class`, plus a generated `id` linked to its label. No wrapper
`<div>`, no `<Field.Root>`, no slot to destructure.

The size follows from that rather than from optimisation work: the published bundle is **15.3 kB minified, 4.0 kB
gzipped**, with no runtime dependency at all and Vue kept external. There is no widget code in it because there are no
widgets.

::: tip They are not alternatives. Nothing stops you using Charpente for the fields and Reka UI for the combobox in the
same form. `CField` hands its id and description to a foreign control through its slot —
see [Controls the field doesn't own](/guide/ids#controls-the-field-doesn-t-own).
:::

## Versus form frameworks

This is the comparison that matters most, because the overlap is real.

VeeValidate, FormKit and Vuelidate run a validation system **beside** the browser's. They hold the errors, you write the
messages, and the native constraint validation underneath is usually switched off. Charpente does the opposite: it
[feeds your rules into the browser's own validation](/guide/validation#rules-of-your-own) so there is one source of
truth.

|                                                          | Charpente                                                                   | Form frameworks                                           |
|----------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------|
| Error messages for `required`, `type="email"`, `pattern` | The browser's, **already localized**                                        | Strings you write, and translate yourself                 |
| Where the invalid state lives                            | On the DOM node — `:invalid`, `validationMessage`                           | In the library's own state object                         |
| Cross-field rules                                        | Free: a rule is a computed, so any reactive source it reads is a dependency | A declared dependency, a `revalidate()` call, or a schema |
| `dirty`, `touched`, `isSubmitting`                       | **Not provided**                                                            | Provided                                                  |
| One schema (Zod, Yup) for a whole form                   | **Not provided** — a `rule` covers one field, synchronously                 | Provided                                                  |
| Field arrays, reset to initial values                    | **Not provided**                                                            | Provided                                                  |
| Forms generated from a schema                            | **Not provided**                                                            | [FormKit]                                                 |

The trade is straightforward. You get localized messages for free and no state to keep in sync; you give up everything
that requires remembering what the user did.

::: warning The localization argument cuts both ways. Native messages come localized. **Yours do not.** A message
returned by a [`rule`](/guide/validation#rules-of-your-own)
is a string you wrote, in one language — run it through your `t()` in a multilingual app. Charpente saves you the
translation work only for the constraints the browser understands.
:::

### They compose

Charpente is a lower layer, not a rival. Without `validate`, `CForm` intercepts nothing and another library can own the
validation entirely. And if you want both, a `rule` that returns that library's message feeds it into native
validation — so `aria-invalid`, the supporting text and the blocked submit keep working on top of it. That is the same
shape as the [server-side recipe](/guide/validation#server-side-and-async-checks).

## Versus styled component libraries

PrimeVue, Vuetify and Naive UI answer a different question: *what should this look like?* If you are happy with their
answer, they will get you to a working product faster than Charpente ever will.

Charpente refuses to answer it. No CSS ships with the package — not a reset, not a class name, not a CSS variable — so
there is no theme to override and no `!important` to fight. Every class you pass lands on the native element.

The real difference shows up on redesign day: there is nothing to migrate away from, because there was never anything to
migrate.

## Choosing

| What you need                                                | Reach for                                                                        |
|--------------------------------------------------------------|----------------------------------------------------------------------------------|
| Accessible forms, your own design system                     | **Charpente UI**                                                                 |
| The browser's localized validation messages                  | **Charpente UI**                                                                 |
| A design system's components as a base for your own wrappers | **Charpente UI** — see [Wrapping](/guide/wrapping)                               |
| `dirty`, `touched`, `isSubmitting`, field arrays             | [VeeValidate], [FormKit]                                                         |
| One Zod or Yup schema for a whole form                       | [VeeValidate], [FormKit]                                                         |
| A form generated from a schema                               | [FormKit]                                                                        |
| A combobox, a date picker, a modal                           | [Reka UI], [Ark UI]                                                              |
| A finished look with no design work                          | [PrimeVue], [Vuetify], [Naive UI]                                                |
| A form that works with JavaScript disabled                   | A plain `<form action=…>` — [`CForm` never submits](/components/form#attributes) |

## Where Charpente loses

Stated plainly, because you will hit these:

- **Thirteen components, all form controls.** There is no ecosystem around it, no table, no toast, no layout.
- **Vue 3.5+, ESM only.** A codebase that still resolves through `require()`, or that is stuck on an older Vue, cannot
  install it. See [Requirements](/guide/introduction#requirements).
- **No form state.** If you need to know whether a field was touched, Charpente will never tell you — the DOM does not
  track it.
- **`form.reset()` does not reset your models.** True of the library as a whole, and a documented trap:
  [Rules and reset](/guide/validation#rules-and-reset).
- **One control per `CField`.** A field tracks a single validation message, so two controls in one field overwrite each
  other's. Use [`CRadioGroup`](/components/radio) or [`CCheckboxGroup`](/components/checkbox) for related items.
- **A far smaller community.** VeeValidate and FormKit have years of answered questions behind them. This does not.

## See also

- [Introduction](/guide/introduction) — what headless means here, and what it is not
- [Native validation](/guide/validation) — the mechanism the comparison above rests on
- [Accessibility](/guide/accessibility) — what the platform does, what the library wires, what is left to you

[VeeValidate]: https://vee-validate.logaretm.com/
[FormKit]: https://formkit.com/
[Vuelidate]: https://vuelidate-next.netlify.app/
[Reka UI]: https://reka-ui.com/
[Ark UI]: https://ark-ui.com/
[Headless UI]: https://headlessui.com/
[PrimeVue]: https://primevue.org/
[Vuetify]: https://vuetifyjs.com/
[Naive UI]: https://www.naiveui.com/
