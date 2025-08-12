/* State */
const state = {
  step: 1,
  billing: 'month', // 'month' or 'year'
  selectedPlan: { name: 'Arcade', month: 9, year: 90 },
  addons: []
};

/* Helpers */
const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

/* UI elements */
const panels = qsa('.panel');
const sidebarSteps = qsa('.step-indicator');
const btnNext = qsa('[data-next]');
const btnBack = qsa('[data-back]');
const billingToggle = qs('#billingToggle');
const planCards = qsa('.plan-card');
const addonCards = qsa('.addon-card');
const summaryCard = qs('.summary-card');
const btnConfirm = qs('.btn-confirm');
const infoForm = qs('#infoForm');
const nameInput = qs('#name');
const emailInput = qs('#email');
const phoneInput = qs('#phone');
const errName = qs('#err-name');
const errEmail = qs('#err-email');
const errPhone = qs('#err-phone');

/* Initialize */
function init(){
  // default select first plan
  planCards.forEach((c, i) => {
    updatePlanPriceText(c);
    if(i === 0){ selectPlanCard(c); }
  });

  addonCards.forEach(a => updateAddonPriceText(a));
  showStep(1);
  attachEvents();
}

/* Show step (number or 'thankyou') */
function showStep(n){
  // hide all
  panels.forEach(p => p.hidden = true);
  // show
  const sel = qsa(`.panel[data-step]`).find(p => String(p.dataset.step) === String(n));
  if(sel) sel.hidden = false;

  // update sidebar active (only for numeric steps 1..4)
  sidebarSteps.forEach(li => {
    li.classList.toggle('active', Number(li.dataset.step) === Number(n));
  });

  // update state to numeric if given numeric
  if(!isNaN(Number(n))) state.step = Number(n);
}

/* NAV handlers */
btnNext.forEach(btn => btn.addEventListener('click', () => {
  // if currently on step 1 validate
  if(state.step === 1){
    if(!validateStep1()) return;
  }
  if(state.step < 4){ state.step += 1; showStep(state.step); }
  else if(state.step === 4){ /* stay */ }
}));

btnBack.forEach(btn => btn.addEventListener('click', () => {
  if(state.step > 1){ state.step -= 1; showStep(state.step); }
}));

/* plan selection */
function selectPlanCard(card){
  planCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  state.selectedPlan = {
    name: card.dataset.name,
    month: Number(card.dataset.month),
    year: Number(card.dataset.year)
  };
}

/* attach event listeners */
function attachEvents(){
  // click plan
  planCards.forEach(card => {
    card.addEventListener('click', () => {
      selectPlanCard(card);
    });
  });

  // billing toggle
  billingToggle.addEventListener('change', (e) => {
    state.billing = e.target.checked ? 'year' : 'month';
    // update UI prices
    planCards.forEach(updatePlanPriceText);
    addonCards.forEach(updateAddonPriceText);
  });

  // addon toggles
  addonCards.forEach(card => {
    const input = card.querySelector('.addon-input');
    input.addEventListener('change', () => {
      const name = card.dataset.name;
      const price = state.billing === 'month' ? Number(card.dataset.month) : Number(card.dataset.year);
      if(input.checked){
        state.addons.push({ name, price });
      } else {
        state.addons = state.addons.filter(a => a.name !== name);
      }
    });
  });

  // confirm -> show summary then thankyou
  btnConfirm.addEventListener('click', () => {
    renderSummary();
    // final step: show summary panel already visible; now show thank you after short delay or immediately per screenshot
    showStep('thankyou');
  });

  // when the user reaches step 4 we should render the summary
  // observe step changes by overriding showStep? We'll render on entering step 4
  const originalShowStep = showStep;
  window.showStep = function(n){
    originalShowStep(n);
    if(Number(n) === 4){
      renderSummary();
    }
  };

  // Add ability to click "Change" in summary (will be added dynamically)
}

/* update plan price text */
function updatePlanPriceText(card){
  const p = card.querySelector('.plan-price');
  if(state.billing === 'month'){
    p.textContent = `$${card.dataset.month}/mo`;
  } else {
    p.textContent = `$${card.dataset.year}/yr`;
  }
}

/* update addon price text */
function updateAddonPriceText(card){
  const p = card.querySelector('.addon-price');
  if(state.billing === 'month'){
    p.textContent = `+$${card.dataset.month}/mo`;
  } else {
    p.textContent = `+$${card.dataset.year}/yr`;
  }
}

/* render summary */
function renderSummary(){
  if(!state.selectedPlan) return;
  const planPrice = state.billing === 'month' ? state.selectedPlan.month : state.selectedPlan.year;
  let html = '';
  html += `<div class="summary-top">
            <div>
              <div class="summary-plan-name">${escapeHtml(state.selectedPlan.name)} (${state.billing === 'month' ? 'Monthly' : 'Yearly'})</div>
              <a class="summary-change" id="summaryChange">Change</a>
            </div>
            <div class="summary-plan-price">$${planPrice}/${state.billing === 'month' ? 'mo' : 'yr'}</div>
           </div>`;

  if(state.addons.length){
    state.addons.forEach(a => {
      html += `<div class="summary-addon">
                <div>${escapeHtml(a.name)}</div>
                <div>+$${a.price}/${state.billing === 'month' ? 'mo' : 'yr'}</div>
               </div>`;
    });
  }

  const total = state.addons.reduce((s,a) => s + a.price, planPrice);
  html += `<div class="summary-total">
            <div class="total-label">Total (per ${state.billing === 'month' ? 'month' : 'year'})</div>
            <div class="total-value">$${total}/${state.billing === 'month' ? 'mo' : 'yr'}</div>
           </div>`;

  summaryCard.innerHTML = html;

  // attach change handler
  const changeLink = qs('#summaryChange', summaryCard);
  if(changeLink){
    changeLink.addEventListener('click', (e) => {
      e.preventDefault();
      // go to step 2 (select plan)
      state.step = 2;
      showStep(2);
    });
  }
}

/* validation step 1 */
function validateStep1(){
  let ok = true;
  clearErrors();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if(name.length < 2){
    errName.textContent = 'Please enter your name';
    ok = false;
  }
  if(!/^\S+@\S+\.\S+$/.test(email)){
    errEmail.textContent = 'Please enter a valid email';
    ok = false;
  }
  if(phone.length < 6){
    errPhone.textContent = 'Please enter a valid phone';
    ok = false;
  }

  // store in state if ok
  if(ok){
    state.user = { name, email, phone };
  }
  return ok;
}
function clearErrors(){ errName.textContent=''; errEmail.textContent=''; errPhone.textContent=''; }

/* Utility: escape HTML */
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }

/* init page */
init();
