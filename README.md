

# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

* [Overview](#overview)

  * [The challenge](#the-challenge)
  * [Screenshot](#screenshot)
  * [Links](#links)
* [My process](#my-process)

  * [Built with](#built-with)
  * [What I learned](#what-i-learned)
  * [Continued development](#continued-development)
  * [Useful resources](#useful-resources)
* [Author](#author)

---

## Overview

### The challenge

Users should be able to:

* Complete each step of the sequence
* Go back to a previous step to update their selections
* See a summary of their selections on the final step and confirm their order
* View the optimal layout for the interface depending on their device's screen size
* See hover and focus states for all interactive elements on the page
* Receive form validation messages if:

  * A field has been missed
  * The email address is not formatted correctly
  * A step is submitted, but no selection has been made

### Screenshot

![Multi-step form screenshot](preview.jpg)

### Links

* **Solution URL:** [Your solution link here]()
* **Live Site URL:** [Your live site link here](https://multi-process-form.netlify.app/)

---

## My process

### Built with

* Semantic HTML5 markup
* CSS custom properties
* Flexbox
* CSS Grid
* Mobile-first workflow
* Vanilla JavaScript (DOM manipulation & form validation)

### What I learned

While working on this project, I learned how to:

* Manage form state across multiple steps without losing user data
* Dynamically update UI elements (plan prices, add-ons, totals) based on user selections and billing cycles
* Implement client-side validation to prevent moving to the next step without valid inputs
* Only show the “Thank you” screen after the final confirmation step

Example snippet for dynamically updating prices:

```js
function updatePlanPriceText(card) {
  const p = card.querySelector('.plan-price');
  if (state.billing === 'month') {
    p.textContent = `$${card.dataset.month}/mo`;
  } else {
    p.textContent = `$${card.dataset.year}/yr`;
  }
}
```

### Continued development

In future projects, I’d like to:

* Add keyboard navigation for accessibility
* Save form state in `localStorage` so users can resume where they left off
* Add animations for smoother step transitions

### Useful resources

* [MDN Web Docs - querySelector & querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) – Helped with DOM selection and manipulation.
* [CSS Tricks - Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) – Made responsive layouts much easier to manage.

---

## Author

* Frontend Mentor – [@yourusername](https://www.frontendmentor.io/profile/yourusername)
* Twitter – [@yourusername](https://twitter.com/yourusername)


If you want, I can also write **two short “challenges & lessons learned” blurbs** that you can directly paste into the **Frontend Mentor submission form** so you don’t have to think about it later. That would save you some time.

Do you want me to do that next?
