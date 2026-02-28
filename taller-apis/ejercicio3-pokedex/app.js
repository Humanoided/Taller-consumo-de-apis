const form = document.querySelector("#pokeForm");
const input = document.querySelector("#pokeInput");
const statusEl = document.querySelector("#status");
const resultEl = document.querySelector("#result");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json();
}

async function getPokemon(nameOrId) {
  const value = String(nameOrId).trim().toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(value)}`;
  return fetchJSON(url);
}


async function getAbilityDetails(abilities) {
  const firstTwo = abilities.slice(0, 2).map(a => a.ability.url);
  const requests = firstTwo.map((url) => fetchJSON(url));
  return Promise.all(requests);
}

function renderPokemonCard(poke, abilityDetails = []) {
  const img =
    poke.sprites?.other?.["official-artwork"]?.front_default ??
    poke.sprites?.front_default ??
    "";

  const types = poke.types.map(t => t.type.name);
  const abilities = poke.abilities.map(a => a.ability.name);
  const movesCount = poke.moves?.length ?? 0;

  const stats = poke.stats.map(s => ({
    name: s.stat.name,
    value: s.base_stat,
  }));

  const effects = abilityDetails
    .map((ab) => {
      const en = ab.effect_entries?.find(e => e.language?.name === "en");
      return {
        name: ab.name,
        effect: en?.short_effect ?? "(sin descripción)",
      };
    });

  resultEl.innerHTML = `
    <article class="poke-card">
      <img src="${img}" alt="${poke.name}">
      <div>
        <h2 class="poke-title">#${poke.id} ${poke.name.toUpperCase()}</h2>

        <div class="badges">
          ${types.map(t => `<span class="badge">${t}</span>`).join("")}
        </div>

        <div class="grid2">
          <div>
            <div class="small"><b>Altura:</b> ${poke.height} · <b>Peso:</b> ${poke.weight}</div>
            <div class="small"><b>Experiencia base:</b> ${poke.base_experience}</div>
            <div class="small"><b>Movimientos:</b> ${movesCount}</div>
          </div>

          <div>
            <div><b>Habilidades</b></div>
            <ul>
              ${abilities.map(a => `<li>${a}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div style="margin-top:10px;">
          <div><b>Stats (poderes)</b></div>
          <ul>
            ${stats.map(s => `<li>${s.name}: ${s.value}</li>`).join("")}
          </ul>
        </div>

        ${effects.length ? `
          <div style="margin-top:10px;">
            <div><b>Detalles de habilidades (Promise.all)</b></div>
            <ul>
              ${effects.map(e => `<li><b>${e.name}</b>: ${e.effect}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      </div>
    </article>
  `;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const query = input.value.trim();
    if (!query) return;

    statusEl.textContent = "Buscando Pokémon...";
    resultEl.innerHTML = "";

    const poke = await getPokemon(query);

    statusEl.textContent = "Cargando detalles...";
    const abilityDetails = await getAbilityDetails(poke.abilities);

    renderPokemonCard(poke, abilityDetails);
    statusEl.textContent = "Listo ✅";
  } catch (err) {
    statusEl.textContent = `Error: ${err.message} (¿escribiste bien el nombre?)`;
  }
});