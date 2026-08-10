---
description: Every Charpente UI component, each a thin layer over a native element that forwards $attrs so any HTML attribute keeps working.
---

# Components

Thirteen components, each one a thin layer over a native element. Every one of them forwards `$attrs`, so any HTML
attribute keeps working exactly as it does in plain markup.

## Form controls

| Component                                    | Renders             | What it adds                                                        |
|----------------------------------------------|---------------------|---------------------------------------------------------------------|
| [Input](/components/input)                   | `<input>`           | Generated id, label linking, `v-model` modifiers                     |
| [Textarea](/components/textarea)             | `<textarea>`        | Same, on a multiline control                                         |
| [Select](/components/select)                 | `<select>`          | Options from markup, from data, or both                              |
| [Checkbox](/components/checkbox)             | `<input checkbox>`  | Boolean or array models, and the `indeterminate` DOM property        |
| [CheckboxGroup](/components/checkbox#ccheckboxgroup) | `<fieldset>` | One array model, and an opt-in `name`, across every checkbox  |
| [Radio](/components/radio)                   | `<input radio>`     | Value of any type, shared `name` when grouped                        |
| [RadioGroup](/components/radio#cradiogroup)  | `<fieldset>`        | One model and one shared `name` across every radio                   |
| [File](/components/file)                     | `<input file>`      | A `v-model` that works, resets included                              |
| [Button](/components/button)                 | `<button>` or `as`  | Safe `type="button"` default, polymorphic tag                        |

## Grouping and structure

| Component                                        | Renders      | What it adds                                                |
|--------------------------------------------------|--------------|-------------------------------------------------------------|
| [Field](/components/field)                       | `<div>`      | One id shared by the label, the control and its hints        |
| [Label](/components/label)                       | `<label>`    | A `for` it resolves on its own                               |
| [SupportingText](/components/supporting-text)    | `<p>`        | Hint or error text, referenced by `aria-describedby`         |
| [Form](/components/form)                         | `<form>`     | No page reload, opt-in native validation                     |

## Where to start

Most forms are three components deep:

```vue
<CForm validate @submit="onSubmit">
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email" required/>
        <CSupportingText validation>We never share your email.</CSupportingText>
    </CField>

    <CButton type="submit">Subscribe</CButton>
</CForm>
```

Read [Field](/components/field) for the id wiring, then [Native validation](/guide/validation) for the rest.
