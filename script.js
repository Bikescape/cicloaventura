// script.js

let currentIndex = 0;
let currentScore = 0;
let startTime;
let hintsUsed = [false, false, false];
let map;
let userMarker;

const questions = [];

const supabaseUrl = 'https://ivpcempasgfwtahfcffu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGNlbXBhc2dmd3RhaGZjZmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjk0MDcsImV4cCI6MjA2ODYwNTQwN30.vb7-I3Zwc4qtns7JWJ695k7Eiwx84RP42m1WhUlsUdQ';
const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`
};

async function fetchQuestions() {
  const res = await fetch(`${supabaseUrl}/rest/v1/pruebas?select=*`, { headers });
  const data = await res.json();
  questions.push(...data);
}

function startGame() {
  startTime = Date.now();
  document.getElementById('narrative-screen').classList.add('hidden');
  document.getElementById('question-screen').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById('question-title').innerText = q.titulo;
  document.getElementById('question-text').innerText = q.descripcion;
  document.getElementById('answer-input').value = '';
  document.getElementById('response-message').innerText = '';
  document.getElementById('hints-output').innerHTML = '';
  hintsUsed = [false, false, false];

  // Media
  const mediaDiv = document.getElementById('question-media');
  mediaDiv.innerHTML = '';
  if (q.imagen_url) {
    const img = document.createElement('img');
    img.src = q.imagen_url;
    mediaDiv.appendChild(img);
  }
  if (q.audio_url) {
    const audio = document.createElement('audio');
    audio.src = q.audio_url;
    audio.controls = true;
    mediaDiv.appendChild(audio);
  }

  // Map
  if (map) map.remove();
  map = L.map('map').setView([q.latitud, q.longitud], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);
  L.marker([q.latitud, q.longitud]).addTo(map);
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    userMarker = L.marker([latitude, longitude], { color: 'blue' }).addTo(map);
  });
}

function useHint(index) {
  if (hintsUsed[index]) return;
  const q = questions[currentIndex];
  const output = document.getElementById('hints-output');
  output.innerHTML += `<p><strong>Pista ${index + 1}:</strong> ${q[`pista${index + 1}`]}</p>`;
  currentScore -= 1;
  hintsUsed[index] = true;
}

function submitAnswer() {
  const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
  const correctAnswer = questions[currentIndex].respuesta.toLowerCase();
  const responseMsg = document.getElementById('response-message');

  if (userAnswer === correctAnswer) {
    currentScore += 10;
    responseMsg.innerText = '✅ ¡Correcto!';
    setTimeout(() => {
      currentIndex++;
      if (currentIndex >= questions.length) {
        finishGame();
      } else {
        showQuestion();
      }
    }, 1000);
  } else {
    responseMsg.innerText = '❌ Respuesta incorrecta. Inténtalo de nuevo.';
    currentScore -= 2;
  }
}

function finishGame() {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('question-screen').classList.add('hidden');
  document.getElementById('final-screen').classList.remove('hidden');

  const nombre = prompt('Introduce tu nombre para la clasificación:');
  guardarJugador(nombre, currentScore, duration);

  document.getElementById('scoreboard').innerHTML = `<p>Puntuación: ${currentScore} pts</p><p>Tiempo: ${duration} segundos</p>`;
}

function restartGame() {
  currentIndex = 0;
  currentScore = 0;
  location.reload();
}

window.addEventListener('load', async () => {
  await fetchQuestions();
  document.getElementById('narrative-screen').classList.add('visible');
});

async function guardarJugador(nombre, puntuacion, duracion) {
  const res = await fetch(`${supabaseUrl}/rest/v1/jugadores`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre,
      puntuacion,
      duracion,
      fecha_juego: new Date().toISOString()
    })
  });
}
