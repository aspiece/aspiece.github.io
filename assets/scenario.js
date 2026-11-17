"use strict";
// Original formative customer-service simulation; no persistent storage or analytics.
const steps = [
  {
    context:"Moment 1 · The handoff",
    title:"An unexpected delay",
    prompt:"A customer arrives for a scheduled vehicle handoff. The vehicle is not ready at the promised time, and the customer is visibly frustrated. What should you do first?",
    options:[
      {text:"Acknowledge the delay, verify the current status, and give the customer a realistic update and choice of next steps.",points:2,feedback:"Strong response. You own the communication, verify facts before promising a timeline, and let the customer make an informed choice."},
      {text:"Promise the vehicle will be ready in five minutes to reassure the customer.",points:0,feedback:"A confident promise can sound comforting, but an unverified estimate risks a second disappointment. Check the status before committing."},
      {text:"Explain that another department caused the delay and ask the customer to wait.",points:0,feedback:"Passing blame does not help the customer. Begin with empathy and a verifiable next step, then coordinate internally."}
    ]
  },
  {
    context:"Moment 2 · Guided setup",
    title:"A feature won't connect",
    prompt:"During the walkthrough, the customer's phone does not connect to a feature as expected. They are worried they won't remember the steps. What is the best learning-focused response?",
    options:[
      {text:"Walk through the approved steps together, let the customer try them, and confirm what worked or still needs support.",points:2,feedback:"Exactly. Guided practice, a check for understanding, and a clear escalation path build confidence without inventing a fix."},
      {text:"Give the customer a help article and tell them to try it after they get home.",points:1,feedback:"A reference resource helps, but it misses the opportunity for supported practice and immediate feedback while you're together."},
      {text:"Take the phone and quickly complete the whole process yourself so the customer doesn't have to think about it.",points:0,feedback:"Doing everything for someone may save a minute, but they leave without a repeatable skill. Demonstrate, then let them practice with consent."}
    ]
  },
  {
    context:"Moment 3 · Leaving with confidence",
    title:"One question remains",
    prompt:"The customer has to leave soon and asks a technical question you cannot yet verify. Which close-out best protects trust and supports a confident next step?",
    options:[
      {text:"Separate what you know from what needs checking, capture the open question, and agree on a specific follow-up channel and next step.",points:2,feedback:"Strong finish. Transparency, a documented question, and an agreed follow-up prevent guesswork and give the customer a dependable plan."},
      {text:"Offer a likely answer so the customer can leave without more delays.",points:0,feedback:"Guessing a technical answer can undermine trust or create unsafe expectations. Be clear about uncertainty and how you'll verify."},
      {text:"Tell the customer to read the manual later because the handoff is already running long.",points:0,feedback:"Self-service material can be useful, but dismissing the question misses the chance to clarify responsibility and follow-up."}
    ]
  }
];
let index=0,total=0,choices=[];
const $=(id)=>document.getElementById(id);
function render(){
  const step=steps[index];
  $('scenario').hidden=false;$('scenario-end').hidden=true;
  $('scene-counter').textContent=`Scenario ${index+1} of ${steps.length}`;
  $('scenario-progress').style.width=`${index/steps.length*100}%`;
  $('scene-context').textContent=step.context;$('scene-title').textContent=step.title;
  $('scene-question').textContent=step.prompt;
  $('scene-feedback').hidden=true;$('next-scene').hidden=true;
  const area=$('scene-options');area.replaceChildren();
  step.options.forEach((opt,j)=>{const btn=document.createElement('button');btn.type='button';btn.className='scene-option';btn.textContent=`${String.fromCharCode(65+j)}. ${opt.text}`;btn.addEventListener('click',()=>choose(j));area.append(btn);});
}
function choose(j){
  const step=steps[index],opt=step.options[j];
  total+=opt.points;choices.push({step:step.title,points:opt.points,feedback:opt.feedback});
  const bs=[...document.querySelectorAll('.scene-option')];bs.forEach((b,k)=>{b.disabled=true;b.setAttribute('aria-pressed',String(k===j));if(k===j)b.classList.add('selected');});
  const label=opt.points===2?'Effective choice':opt.points===1?'Partly effective':'Consider a stronger approach';
  $('scene-feedback').replaceChildren();
  let strong=document.createElement('strong');strong.textContent=label;
  let p=document.createElement('p');p.textContent=opt.feedback;
  $('scene-feedback').append(strong,p);$('scene-feedback').hidden=false;
  const next=$('next-scene');next.hidden=false;next.textContent=index===steps.length-1?'Review my decisions →':'Continue to next situation →';
  next.focus();
}
function advance(){index++;if(index<steps.length){render();$('scene-title').focus?.();}else{complete();}}
function complete(){
  $('scenario').hidden=true;$('scenario-end').hidden=false;$('result-score').textContent=`${total} / 6`;
  $('result-headline').textContent=total===6?'You demonstrated strong customer-centered judgment.':total>=4?'You identified several strong service decisions.':'You have a useful opportunity to refine your approach.';
  $('result-interpretation').textContent='Review how each decision affects clarity, trust, practice, and follow-through. This is coaching for a simulated conversation, not a real-world evaluation.';
  const area=$('result-review');area.replaceChildren();
  choices.forEach((x,i)=>{const div=document.createElement('div');div.className='review-entry';const title=document.createElement('strong');title.textContent=`${i+1}. ${x.step} · ${x.points}/2`;const p=document.createElement('p');p.textContent=x.feedback;div.append(title,p);area.append(div);});
  $('scenario-progress').style.width='100%';$('scenario-end').focus();
}
$('next-scene').addEventListener('click',advance);
$('restart-scene').addEventListener('click',()=>{index=0;total=0;choices=[];render();$('scene-options').querySelector('button')?.focus();});
render();
