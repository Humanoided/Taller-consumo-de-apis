const galleryEl = document.querySelector("#gallery");
const statusEl = document.querySelector("#status");
const btnLoad = document.querySelector("#btnLoad");
const albumInput = document.querySelector("#albumId");

// Helper para fetch + errores HTTP
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json();
}

function renderGallery(photos) {
  galleryEl.innerHTML = "";

  const fragment = document.createDocumentFragment();

  photos.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    // ✅ Imagen como elemento (para manejar onerror)
    const img = document.createElement("img");
    img.src = p.thumbnailUrl;
    img.alt = `Foto ${p.id}`; // 👈 mejor que poner el título largo aquí

    // ✅ Si via.placeholder.com está bloqueado, usamos Picsum como respaldo
    img.onerror = () => {
      img.onerror = null; // evita loop infinito
      img.src = `https://picsum.photos/seed/${p.id}/300/200`;
    };

    // ✅ Título recortado para que no se vea “raro”/largo
    const shortTitle = p.title.length > 45 ? p.title.slice(0, 45) + "..." : p.title;

    card.innerHTML = `
      <h3>${shortTitle}</h3>
      <div class="meta">
        <div><b>ID:</b> ${p.id}</div>
        <div><b>Álbum:</b> ${p.albumId}</div>
      </div>
      <a href="${p.url}" target="_blank" rel="noreferrer">Ver imagen grande</a>
    `;

    // Insertamos la imagen arriba del contenido
    card.insertBefore(img, card.firstChild);

    fragment.appendChild(card);
  });

  galleryEl.appendChild(fragment);
}


/**
 * Versión con ASYNC/AWAIT (recomendada)
 */
async function loadPhotosAsyncAwait() {
  try {
    const albumId = Number(albumInput.value || 1);
    statusEl.textContent = "Cargando fotos...";

    // Ruta anidada (más liviana): /albums/1/photos :contentReference[oaicite:1]{index=1}
    const url = `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`;
    const data = await fetchJSON(url);

    // mínimo 10 fotos
    const firstTen = data.slice(0, 10);
    renderGallery(firstTen);

    statusEl.textContent = `Listo ✅ (mostrando ${firstTen.length} fotos del álbum ${albumId})`;
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
}

/**
 * Versión con PROMESAS (.then/.catch)
 * (por si tu profe quiere ver explícitamente promesas)
 */
function loadPhotosThenCatch() {
  const albumId = Number(albumInput.value || 1);
  statusEl.textContent = "Cargando fotos...";

  const url = `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const firstTen = data.slice(0, 10);
      renderGallery(firstTen);
      statusEl.textContent = `Listo ✅ (mostrando ${firstTen.length} fotos del álbum ${albumId})`;
    })
    .catch((err) => {
      statusEl.textContent = `Error: ${err.message}`;
    });
}

btnLoad.addEventListener("click", () => {
  // Usa UNA de las dos (yo dejo async/await):
  loadPhotosAsyncAwait();

  // Si quieres mostrar promesas en vivo, comenta la anterior y descomenta:
  // loadPhotosThenCatch();
});

// carga inicial
loadPhotosAsyncAwait();