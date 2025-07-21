// ⚠️ Sustituye por tus claves reales de Supabase
const SUPABASE_URL = 'https://ivpcempasgfwtahfcffu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGNlbXBhc2dmd3RhaGZjZmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjk0MDcsImV4cCI6MjA2ODYwNTQwN30.vb7-I3Zwc4qtns7JWJ695k7Eiwx84RP42m1WhUlsUdQ';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const pruebaForm = document.getElementById("prueba-form");
  const cancelarBtn = document.getElementById("cancelar");
  const lista = document.getElementById("pruebas-lista");

  if (!pruebaForm) {
    console.error("No se encontró el formulario con id 'prueba-form'");
    return;
  }

  pruebaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevaPrueba = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      latitud: parseFloat(document.getElementById("latitud").value),
      longitud: parseFloat(document.getElementById("longitud").value),
      imagen_url: document.getElementById("imagen_url").value,
      audio_url: document.getElementById("audio_url").value,
      pista1: document.getElementById("pista1").value,
      pista2: document.getElementById("pista2").value,
      pista3: document.getElementById("pista3").value,
      respuesta: document.getElementById("respuesta").value
    };

    const idExistente = document.getElementById("prueba-id").value;

    let resultado;
    if (idExistente) {
      resultado = await supabase.from("pruebas").update(nuevaPrueba).eq("id", idExistente);
    } else {
      resultado = await supabase.from("pruebas").insert([nuevaPrueba]);
    }

    if (resultado.error) {
      alert("❌ Error al guardar la prueba: " + resultado.error.message);
    } else {
      alert("✅ Prueba guardada correctamente");
      pruebaForm.reset();
      cargarPruebas();
    }
  });

  cancelarBtn.addEventListener("click", () => {
    pruebaForm.reset();
  });

  async function cargarPruebas() {
    const { data, error } = await supabase.from("pruebas").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error al cargar pruebas:", error.message);
      return;
    }

    lista.innerHTML = "";
    data.forEach((prueba) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${prueba.id}</td>
        <td>${prueba.titulo}</td>
        <td>
          <button onclick="editarPrueba(${prueba.id})">✏️</button>
          <button onclick="eliminarPrueba(${prueba.id})">🗑️</button>
        </td>
      `;
      lista.appendChild(row);
    });
  }

  window.editarPrueba = async (id) => {
    const { data, error } = await supabase.from("pruebas").select("*").eq("id", id).single();
    if (error) {
      alert("Error al obtener prueba");
      return;
    }

    document.getElementById("prueba-id").value = data.id;
    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.descripcion;
    document.getElementById("latitud").value = data.latitud;
    document.getElementById("longitud").value = data.longitud;
    document.getElementById("imagen_url").value = data.imagen_url;
    document.getElementById("audio_url").value = data.audio_url;
    document.getElementById("pista1").value = data.pista1;
    document.getElementById("pista2").value = data.pista2;
    document.getElementById("pista3").value = data.pista3;
    document.getElementById("respuesta").value = data.respuesta;
  };

  window.eliminarPrueba = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta prueba?")) return;

    const { error } = await supabase.from("pruebas").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar la prueba: " + error.message);
    } else {
      cargarPruebas();
    }
  };

  cargarPruebas();
});
