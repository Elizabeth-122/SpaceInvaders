const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');
let nave = { x: 160, y: 270, w: 40, h: 15 };
let proyectiles = [];
let enemigos = [];
let puntaje=0;
let velocidadEnemigos = 1;
let  direccionEnemigos =1;
let idAnim = null;
let vidas=3;
let juegoTerminado=false;
let victoria=false;

// TEMPORIZADOR
let tiempoInicio = 0;
let tiempoFinal = 0;

function initEnemigos() {
enemigos = [];
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 6; c++) {
enemigos.push({ x: c * 50 + 30, y: r * 30 + 30, w: 30, h: 20, vivo: true });
}
}
}

function perderVida() {
vidas--;

if (vidas <= 0) {
vidas=0;
juegoTerminado=true;

// DETENER EL TIEMPO
tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
}
}

function bucle() {
ctx.clearRect(0, 0, lienzo.width, lienzo.height);


// Dibujar nave
ctx.fillStyle = '#d62700';
ctx.fillRect(nave.x, nave.y, nave.w, nave.h);

// Actualizar y dibujar proyectiles
ctx.fillStyle = '#f9bc2d';
proyectiles.forEach((p, idx) => {
p.y -= 5;
ctx.fillRect(p.x, p.y, p.w, p.h);
if (p.y < 0) proyectiles.splice(idx, 1);
});

// Movimiento de los enemigos
let cambiarDireccion = false;

enemigos.forEach(e => {
if (e.vivo && !juegoTerminado) {
let siguienteX = e.x + (velocidadEnemigos * direccionEnemigos);

if (e.vivo && e.y + e.h >= lienzo.height) {

e.vivo = false;
perderVida();
}

if (
  e.vivo &&
e.x < nave.x + nave.w &&
e.x + e.w > nave.x &&
e.y < nave.y + nave.h &&
e.y + e.h > nave.y
) {
e.vivo = false;
perderVida();
}
if (siguienteX < 0 || siguienteX + e.w > lienzo.width) {
cambiarDireccion = true;
}
}
});

ctx.fillStyle="#ffffff";
ctx.font='18px Arial';
ctx.fillText('Puntaje:'+ puntaje, 10,25);
ctx.fillText('Vidas: '+vidas, 290,25);

// MOSTRAR TEMPORIZADOR
let tiempo = juegoTerminado ? tiempoFinal : Math.floor((Date.now() - tiempoInicio) / 1000);
let minutos = Math.floor(tiempo / 60);
let segundos = tiempo % 60;

ctx.fillText('Tiempo: ' + String(minutos).padStart(2,'0') + ':' + String(segundos).padStart(2,'0'), 145,25);

// MENSAJE CUANDO SE TERMINAN LAS VIDAS
if (juegoTerminado) {
ctx.fillStyle="#ffffff";
ctx.font="25px Arial";

if (victoria) {
ctx.fillText("¡GANASTE!", 110, 150);
} else {
ctx.fillText("¡PERDISTE!", 110, 150);
}

return;
}

if (cambiarDireccion) {
direccionEnemigos *= -1;

enemigos.forEach(e => {
if (e.vivo) {
e.y += 10;
}
});
}
// Dibujar y detectar colisiones con enemigos

ctx.fillStyle = '#35c305';
enemigos.forEach(e => {
if (e.vivo) {
e.x+= velocidadEnemigos * direccionEnemigos;
ctx.fillRect(e.x, e.y, e.w, e.h);
proyectiles.forEach((p, pIdx) => {
if (p.x > e.x && p.x < e.x + e.w && p.y > e.y && p.y < e.y + e.h) {
e.vivo = false;
puntaje +=100;
proyectiles.splice(pIdx, 1);

}  
  });  
}

});

// COMPROBAR SI TODOS LOS ENEMIGOS FUERON DERROTADOS
if (enemigos.every(e => !e.vivo)) {
juegoTerminado=true;
victoria=true;
tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
}

idAnim = requestAnimationFrame(bucle);
}

window.addEventListener('keydown', e => {
if (e.key === 'ArrowLeft' && nave.x > 0) nave.x -= 15;
if (e.key === 'ArrowRight' && nave.x < lienzo.width - nave.w) nave.x += 15;
if (e.code === 'Space') proyectiles.push({ x: nave.x + 18, y: nave.y, w: 4, h: 10 });
});

document.getElementById('boton-iniciar').addEventListener('click', () => {
if (idAnim) cancelAnimationFrame(idAnim);
nave.x = 160; proyectiles = []; puntaje=0; initEnemigos();
juegoTerminado=false;
victoria=false;
vidas=3;

// REINICIAR TEMPORIZADOR
tiempoInicio = Date.now();
tiempoFinal = 0;

bucle();
});