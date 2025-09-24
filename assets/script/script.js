// --- Replace with your key ---
const RAPIDAPI_KEY = "d235d3412dmshd4271a5a5fb44c3p11d3f3jsnf9b1434c6565"; 
const RAPIDAPI_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_BASE = "https://deezerdevs-deezer.p.rapidapi.com";

/* DOM refs */
const tilesRow   = document.getElementById("tilesRow");
const albumsRow  = document.getElementById("albumsRow");
const form       = document.getElementById("searchForm");
const input      = document.getElementById("searchInput");
const btnSearch  = document.getElementById("btnSearch");
const btnRandom  = document.getElementById("btnRandom");
const miniTitle  = document.getElementById("miniTitle");

/* A pool of queries for the "Buonasera" shelf */
const DEFAULT_QUERIES = [
  "fedez", "salmo", "maneskine", "taylor swift", "dua lipa",
  "coldplay", "imagine dragons", "drake", "billie eilish", "jazz",
  "rock italiano", "pop 2024", "trap", "indie", "lofi"
];

/* ---------- Utilities ---------- */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function fetchSearch(q){
  const url = `${API_BASE}/search?q=${encodeURIComponent(q)}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST
    }
  }).then(r=>{
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then(j=>j.data || []);
}

/* ---------- Rendering ---------- */
function tileHTML({title, cover}){
  return `
    <div class="col">
      <a href="#" class="tile text-decoration-none text-white">
        <img class="thumb" src="${cover}" alt="" />
        <div class="text">${title}</div>
      </a>
    </div>
  `;
}

function cardHTML({title, artist, cover}){
  return `
    <div class="col">
      <a href="#" class="card-album text-decoration-none text-white d-block h-100">
        <img class="thumb" src="${cover}" alt="">
        <div class="caption">
          <p class="title">${title}</p>
          <p class="sub mb-0">${artist}</p>
        </div>
      </a>
    </div>`;
}

function renderTiles(sets){
  tilesRow.innerHTML = sets.map(tileHTML).join("");
}

function renderCards(tracks){
  albumsRow.innerHTML = tracks.map(cardHTML).join("");
  // update mini-player with the first result if exists
  if (tracks[0]) miniTitle.textContent = `${tracks[0].title} — ${tracks[0].artist}`;
}

/* ---------- Data helpers ---------- */
async function showDefaultGenres(){
  const chosen = shuffle(DEFAULT_QUERIES.slice()).slice(0,4);
  const promises = chosen.map(q => fetchSearch(q).then(list=>{
    // take first result as the tile representation
    const t = list[0];
    if (!t) return null;
    return {
      title: t.album?.title || t.title || q,
      cover: t.album?.cover_medium || t.album?.cover || t.artist?.picture_medium || t.artist?.picture || ""
    };
  }).catch(()=>null));

  const results = (await Promise.all(promises)).filter(Boolean);
  renderTiles(results);
}

async function performSearch(query){
  albumsRow.innerHTML =
    `<div class="col-12 text-muted-soft">Caricamento risultati per “${query}”…</div>`;
  try{
    const data = await fetchSearch(query);
    const cards = data.slice(0, 15).map(d => ({
      title: d.title_short || d.title,
      artist: d.artist?.name || "Unknown",
      cover: d.album?.cover_medium || d.album?.cover || d.artist?.picture_medium || ""
    }));
    renderCards(cards);
  }catch(err){
    albumsRow.innerHTML =
      `<div class="col-12"><div class="alert alert-danger">Errore caricamento: ${err.message}</div></div>`;
  }
}

/* ---------- Events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  showDefaultGenres();               // fill "Buonasera"
  performSearch("hit italy");        // fill first grid
});

btnRandom.addEventListener("click", (e)=>{
  e.preventDefault();
  showDefaultGenres();
});

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  performSearch(q);
});
