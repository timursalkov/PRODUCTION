const hero=document.getElementById('hero');
const game=document.getElementById('accepted');
const final=document.getElementById('final');
const acceptBtn=document.getElementById('acceptBtn');
const laterBtn=document.getElementById('laterBtn');
const rollBtn=document.getElementById('rollBtn');
const dice=document.getElementById('dice');
const result=document.getElementById('result');
const choice=document.getElementById('choice');
const backBtn=document.getElementById('backBtn');
const restartBtn=document.getElementById('restartBtn');
const toast=document.getElementById('toast');
const messageBox=document.getElementById('messageBox');
const finalText=document.getElementById('finalText');
const copyBtn=document.getElementById('copyBtn');
const telegramBtn=document.getElementById('telegramBtn');
const timeButtons=[...document.querySelectorAll('[data-time]')];

let selectedTime='';
let rolling=false;
let rollTimer=null;
const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];

function top(){window.scrollTo({top:0,left:0,behavior:'auto'});}
function clearHash(){if(location.hash)history.replaceState(null,document.title,location.pathname+location.search);}
function toastMessage(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);}
function face(n){return faces[n-1];}
function makeMessage(time){return `Маша, я в деле 🎲\n\nТогда играем в Катан — ${time.toLowerCase()} ❤️\n\nОстров уже собран. Осталось только встретиться и начать нашу партию.`;}

async function copyText(text){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(err){}
  try{const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';area.style.pointerEvents='none';document.body.appendChild(area);area.focus();area.select();const ok=document.execCommand('copy');area.remove();return ok;}catch(err){return false;}
}
function telegramUrl(text){return `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;}

function stopRolling(){
  if(rollTimer){clearInterval(rollTimer);rollTimer=null;}
  rolling=false;
  if(rollBtn){rollBtn.dataset.rolling='0';rollBtn.disabled=false;}
}
function showGame(){stopRolling();clearHash();hero.hidden=true;final.hidden=true;game.hidden=false;top();}
function showHero(){stopRolling();clearHash();game.hidden=true;final.hidden=true;hero.hidden=false;top();}
function resetGame(){
  stopRolling();clearHash();selectedTime='';game.hidden=false;hero.hidden=true;final.hidden=true;choice.hidden=true;
  result.innerHTML='Нажми на кнопку — кубик решит,<br>с чего начнётся наша партия.';
  dice.textContent='⚄';dice.style.transform='rotate(0) scale(1)';rollBtn.textContent='⚄ БРОСИТЬ КУБИК';
  timeButtons.forEach(btn=>btn.removeAttribute('aria-pressed'));
  copyBtn.textContent='СКОПИРОВАТЬ ЕЩЁ РАЗ';
  telegramBtn.href='#';
}

function rollDice(){
  if(rolling||!rollBtn||rollBtn.disabled||!dice||!result||!choice)return;
  rolling=true;rollBtn.dataset.rolling='1';rollBtn.disabled=true;choice.hidden=true;
  if(rollTimer){clearInterval(rollTimer);rollTimer=null;}
  let ticks=0;
  dice.style.transform='rotate(720deg) scale(1.08)';
  rollTimer=setInterval(()=>{
    dice.textContent=face(Math.floor(Math.random()*6)+1);
    ticks++;
    if(ticks>=9){
      clearInterval(rollTimer);rollTimer=null;
      const n=Math.floor(Math.random()*6)+1;
      dice.textContent=face(n);dice.style.transform='rotate(0) scale(1)';
      result.innerHTML=`<span style="letter-spacing:.12em;font-size:.75em;color:#a98c69">ВЫПАЛО</span> <strong>${n}</strong>.<br>${n>=4?'Хороший знак. Остров уже на нашей стороне.':'Ничего страшного. Настоящая партия только начинается.'}`;
      choice.hidden=false;rollBtn.textContent='✓ КУБИК БРОШЕН';rollBtn.dataset.rolling='0';rollBtn.disabled=false;rolling=false;
    }
  },90);
}
window.rollDice=rollDice;

acceptBtn.onclick=event=>{event.preventDefault();showGame();};
laterBtn.onclick=()=>{laterBtn.textContent='ЛАДНО, Я ПОДОЖДУ ♡';toastMessage('Хорошо. Но кубики уже приготовлены 🎲');};

timeButtons.forEach(btn=>btn.onclick=async()=>{
  if(rolling)return;
  selectedTime=btn.dataset.time;
  const text=makeMessage(selectedTime);
  timeButtons.forEach(item=>item.removeAttribute('aria-pressed'));
  btn.setAttribute('aria-pressed','true');
  messageBox.textContent=text;finalText.textContent=`Ты выбрала «${selectedTime}». Текст уже скопирован.`;
  telegramBtn.href=telegramUrl(text);game.hidden=true;final.hidden=false;clearHash();top();
  const copied=await copyText(text);
  if(copied){copyBtn.textContent='✓ СКОПИРОВАНО';toastMessage('Готово — текст скопирован. Теперь можно открыть Telegram.');}
  else{copyBtn.textContent='СКОПИРОВАТЬ ЕЩЁ РАЗ';toastMessage('Автокопирование не сработало. Нажми «Скопировать ещё раз».');}
});
copyBtn.onclick=async()=>{if(!selectedTime)return;const ok=await copyText(makeMessage(selectedTime));if(ok){copyBtn.textContent='✓ СКОПИРОВАНО';toastMessage('Текст скопирован в буфер обмена 💌');}else toastMessage('Не удалось скопировать. Попробуй ещё раз.');};
telegramBtn.onclick=()=>{if(selectedTime)telegramBtn.href=telegramUrl(makeMessage(selectedTime));};
backBtn.onclick=showHero;
restartBtn.onclick=()=>{resetGame();top();};
if(location.hash==='#accepted')showGame();