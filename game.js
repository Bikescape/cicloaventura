document.addEventListener("DOMContentLoaded", () => {
  let pruebas = [];
  let current = 0;
  const preguntaEl = document.getElementById("pregunta");
  const opcionesEl = document.getElementById("opciones");
  const imgEl = document.getElementById("imagen");
  const audioEl = document.getElementById("audio");

  async function cargarPruebas() {
    const { data, error } = await supabase.from('pruebas').select("*").order('orden', { ascending: true });
    if (error) {
      alert("Error al cargar las pruebas: " + error.message);
    } else {
      pruebas = data;
      mostrarPrueba(current);
    }
  }

  function mostrarPrueba(index) {
    if (index >= pruebas.length) {
      preguntaEl.textContent = "¡Has completado todas las pruebas!";
      opcionesEl.innerHTML = "";
      imgEl.innerHTML = "";
      audioEl.innerHTML = "";
      return;
    }

    const prueba = pruebas[index];
    preguntaEl.textContent = prueba.pregunta;
    opcionesEl.innerHTML = "";

    ["opcion1", "opcion2", "opcion3"].forEach((clave, i) => {
      const btn = document.createElement("button");
      btn.textContent = prueba[clave];
      btn.onclick = () => comprobarRespuesta(prueba[clave], prueba.correcta);
      opcionesEl.appendChild(btn);
    });

    imgEl.innerHTML = prueba.img ? `<img src="${prueba.img}" alt="Imagen de la prueba">` : "";
    audioEl.innerHTML = prueba.audio ? `<audio controls src="${prueba.audio}"></audio>` : "";
  }

  function comprobarRespuesta(seleccionada, correcta) {
    if (seleccionada === correcta) {
      alert("¡Correcto!");
      current++;
      mostrarPrueba(current);
    } else {
      alert("Incorrecto. Inténtalo de nuevo.");
    }
  }

  cargarPruebas();
});
