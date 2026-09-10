---
layout: home
# Without this, titleTemplate turns the home title into "Charpente UI | Charpente UI".
titleTemplate: false

hero:
  # The kicker above the headline, not the site name: the navbar already says
  # Charpente UI two lines up.
  name: by Front Factory
  text: The frame, not the paint.
  tagline: Headless Vue 3 components. The logic you need, without the CSS you don't.
  # The theme puts the install panel in the second column of the hero, but only
  # when no image claims it.
  command: npm install @charpente-ui/vue
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/charpente-ui/vue

features:
  - title: Zero style
    details: No CSS ships with the library. Every class you pass lands on the native element, ready for Tailwind, CSS Modules or plain stylesheets.
  - title: Transparent wrapper
    details: Native HTML is never hidden. type, placeholder, required, multiple — every attribute behaves exactly as it does in plain HTML.
  - title: Accessible by default
    details: Labels, hints and error messages are wired together through generated ids. No for/id plumbing, no ARIA to remember.
  - title: Native validation
    details: The browser already validates forms and localizes the messages. Charpente exposes that instead of reinventing it.
---

> **Charpente** /ʃaʁ.pɑ̃t/ — French for the timber frame of a building. The frame holds everything up; you decide what
> it looks like.
