document.addEventListener("DOMContentLoaded", () => {
  const pruebaForm = document.getElementById("crear-prueba");
  const preview = document.getElementById("preview");

  pruebaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevaPrueba = {
      orden: pruebaForm.orden.value,
      lat: parseFloat(pruebaForm.lat.value),
      lng: parseFloat(pruebaForm.lng.value),
      pregunta: pruebaForm.pregunta.value,
      opcion1: pruebaForm.opcion1.value,
      opcion2: pruebaForm.opcion2.value,
      opcion3: pruebaForm.opcion3.value,
      correcta: pruebaForm.correcta.value,
      img: pruebaForm.img.value,
      audio: pruebaForm.audio.value
    };

    await guardarPrueba(nuevaPrueba);
    mostrarPreview(nuevaPrueba);
    pruebaForm.reset();
  });

  async function guardarPrueba(data) {
    const { data: result, error } = await supabase.from('pruebas').insert([data]);
    if (error) {
      alert("Error al guardar la prueba: " + error.message);
    }
  }

  function mostrarPreview(prueba) {
    preview.innerHTML = `
      <h3>Prueba creada:</h3>
      <p><strong>Pregunta:</strong> ${prueba.pregunta}</p>
      <ul>
        <li>A: ${prueba.opcion1}</li>
        <li>B: ${prueba.opcion2}</li>
        <li>C: ${prueba.opcion3}</li>
      </ul>
      <p><strong>Correcta:</strong> ${prueba.correcta}</p>
      ${prueba.img ? `<img src="${prueba.img}" alt="Imagen prueba" style="max-width: 100%; height: auto;">` : ""}
      ${prueba.audio ? `<audio controls src="${prueba.audio}"></audio>` : ""}
    `;
  }
});
