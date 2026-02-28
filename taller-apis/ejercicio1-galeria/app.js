const galleryEl = document.querySelector("#gallery");
const statusEl = document.querySelector("#status");
const btnLoad = document.querySelector("#btnLoad");
const albumInput = document.querySelector("#albumId");


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

  
    const img = document.createElement("img");
    img.src = p.thumbnailUrl;
    img.alt = `Foto ${p.id}`; 

   
    img.onerror = () => {
      img.onerror = null; 
      img.src = `https://picsum.photos/seed/${p.id}/300/200`;
    };

   
    const shortTitle = p.title.length > 45 ? p.title.slice(0, 45) + "..." : p.title;

    card.innerHTML = `
      <h3>${shortTitle}</h3>
      <div class="meta">
        <div><b>ID:</b> ${p.id}</div>
        <div><b>Álbum:</b> ${p.albumId}</div>
      </div>
      <a href="${p.url}" target="_blank" rel="noreferrer">Ver imagen grande</a>
    `;

   
    card.insertBefore(img, card.firstChild);

    fragment.appendChild(card);
  });

  galleryEl.appendChild(fragment);
}



async function loadPhotosAsyncAwait() {
  try {
    const albumId = Number(albumInput.value || 1);
    statusEl.textContent = "Cargando fotos...";

    
    const url = `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`;
    const data = await fetchJSON(url);

   
    const firstTen = data.slice(0, 10);
    renderGallery(firstTen);

    statusEl.textContent = `Listo ✅ (mostrando ${firstTen.length} fotos del álbum ${albumId})`;
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
}


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
  
  loadPhotosAsyncAwait();

  
});


loadPhotosAsyncAwait();