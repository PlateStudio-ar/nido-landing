const screenImage = document.querySelector('#screen');
const theme = document.querySelector('#theme');
const descriptions = {inicio:'Una sugerencia concreta para empezar a estudiar.',materia:'Unidades, apuntes y entregas de una materia.',semana:'Clases y entregas en la misma semana.'};
let view = 'inicio', dark = false;
function animate(element){element.classList.remove('in');void element.offsetWidth;element.classList.add('in');}
function show(){
 const file = view === 'inicio' && dark ? 'noche' : view;
 screenImage.src = 'assets/'+file+'.png';
 screenImage.alt = descriptions[view];
 document.querySelector('#zoom').href = screenImage.src;
 document.querySelector('#description').textContent = descriptions[view];
 theme.hidden = view !== 'inicio';
 theme.textContent = dark ? 'Ver claro' : 'Ver oscuro';
 theme.setAttribute('aria-pressed',String(dark));
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 animate(screenImage);
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;show()});
theme.onclick=()=>{dark=!dark;show()};
const flip=document.querySelector('#flip'), question=document.querySelector('#question'), front=question.textContent;
flip.onclick=()=>{const back=flip.getAttribute('aria-pressed')==='false';flip.setAttribute('aria-pressed',String(back));question.textContent=back?'El amarillo. En el círculo tradicional de pigmentos, queda frente al violeta.':front;document.querySelector('#turn').textContent=back?'Volver a la pregunta ↻':'Ver respuesta ↻';animate(question)};
