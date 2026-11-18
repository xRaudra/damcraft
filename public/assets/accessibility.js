// Native semantics remain available before JavaScript loads.
document.querySelector('.skip-link')?.addEventListener('click',()=>document.querySelector('main')?.focus({preventScroll:true}));
for(const form of document.querySelectorAll('.contact-form')){
  const fields=[...form.querySelectorAll('input:not([name="_hp_website"]),textarea')];
  const showError=field=>{
    const error=document.getElementById(`${field.id}-error`);
    const messages={name:'Enter your name.',email:field.validity.valueMissing?'Enter your email address.':'Enter a valid email address, such as name@example.com.',message:'Tell us about your project.'};
    const valid=field.validity.valid;
    field.setAttribute('aria-invalid',String(!valid));
    if(error)error.textContent=valid?'':messages[field.name]||field.validationMessage;
  };
  form.addEventListener('invalid',event=>{showError(event.target);},true);
  for(const field of fields)field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')showError(field)});
  form.addEventListener('reset',()=>{for(const field of fields){field.removeAttribute('aria-invalid');const error=document.getElementById(`${field.id}-error`);if(error)error.textContent=''}});
}
