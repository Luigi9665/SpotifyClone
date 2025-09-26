// --- Replace with your key ---
const RAPIDAPI_KEY = "d235d3412dmshd4271a5a5fb44c3p11d3f3jsnf9b1434c6565";
const RAPIDAPI_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_BASE = "https://deezerdevs-deezer.p.rapidapi.com";
const saved = sessionStorage.getItem("trackSaved");

// -------------------------------------------------------------------------------
// VARIABILI UTILI PER IL PLAYER
// variabili player mobile
const volumeBar = document.getElementById("volume-bar");
const volumeFill = document.getElementById("volume-fill");
const volumeThumb = document.getElementById("volume-thumb");
const audio = document.getElementById("audio-player");
const tracciaMobile = document.getElementById("tracciaMobile");
const playMobile = document.getElementById("playMobile");
const iconPlayMobile = document.getElementById("iconPlayMobile");
const imgTrackMobile = document.getElementById("imgTrackMobile");

// variabili player medium
const imgTrackMedium = document.getElementById("imgTrackMedium");
const titleTrackPlayer = document.getElementById("titleTrackPlayer");
const singerPlayer = document.getElementById("singerPlayer");
const iconPlayMedium = document.getElementById("iconPlayMedium");
const progressBarMedium = document.getElementById("progressBarMedium");

/* DOM refs */
const tilesRow = document.getElementById("tilesRow");
const albumsRow = document.getElementById("albumsRow");
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnRandom = document.getElementById("btnRandom");
// const miniTitle  = document.getElementById("miniTitle");

//-------------------------------------------------------------------------------
// SET BARRA VOLUME - BLOCCO ISTRUZIONI
function setVolumeFromEvent(e) {
  const rect = volumeBar.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent));
  volumeFill.style.width = percent * 100 + "%";
  volumeThumb.style.left = percent * 100 + "%";

  // Applicazione al player
  audio.volume = percent;
}

volumeBar.addEventListener("click", setVolumeFromEvent);

let isDragging = false;
volumeBar.addEventListener("mousedown", () => (isDragging = true));
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
  if (isDragging) setVolumeFromEvent(e);
});

// FORMATTAZIONE DEI SECONDI
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const secs = time % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
function formatTimeAlbum(time) {
  const minutes = Math.floor(time / 60);
  const secs = time % 60;
  return `${minutes}min ${secs.toString().padStart(2, "0")}sec.`;
}

// -------------------------------------------------------------------------------

// MANIPOLAZIONE DEL PLAYER
// modifiche al player mobile
const startMobile = (traccia, img) => {
  iconPlayMobile.classList.remove("bi-play-fill");
  iconPlayMobile.classList.add("bi-pause-fill");
  tracciaMobile.innerText = traccia;
  imgTrackMobile.src = img;
};

playMobile.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    iconPlayMobile.classList.remove("bi-play-fill");
    iconPlayMobile.classList.add("bi-pause-fill");
  } else {
    audio.pause();
    iconPlayMobile.classList.remove("bi-pause-fill");
    iconPlayMobile.classList.add("bi-play-fill");
  }
});

// modifiche al player medium>
const startMedium = (img, traccia, singer) => {
  iconPlayMedium.classList.remove("bi-play-circle-fill");
  iconPlayMedium.classList.add("bi-pause-circle-fill");
  imgTrackMedium.src = img;
  titleTrackPlayer.innerText = traccia;
  singerPlayer.innerText = singer;
};

iconPlayMedium.addEventListener("click", () => {
  if (audio.src) {
    if (audio.paused) {
      audio.play();
      iconPlayMedium.classList.remove("bi-play-circle-fill");
      iconPlayMedium.classList.add("bi-pause-circle-fill");
    } else {
      audio.pause();
      iconPlayMedium.classList.remove("bi-pause-circle-fill");
      iconPlayMedium.classList.add("bi-play-circle-fill");
    }
  }
});

// gestione della progress bar medium con il listener dell'audio
// Aggiorna progress bar mentre suona
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBarMedium.style.width = percent + "%";
  }

  // salvo il current time con l'update per il sessionstorage
  const current = Math.floor(audio.currentTime);
  const saved = sessionStorage.getItem("trackSaved");
  if (saved) {
    const track = JSON.parse(saved);
    if (track.currentTime !== current) {
      track.currentTime = current;
      sessionStorage.setItem("trackSaved", JSON.stringify(track));
    }
  }

  // uso la stessa variabile current per il timer che scorre
  const pdurationProgress = document.getElementById("durationProgress");
  if (pdurationProgress) {
    if (current < 10) {
      pdurationProgress.innerText = "0:0" + current;
    } else {
      pdurationProgress.innerText = "0:" + current;
    }
  }
});

// listener dell'audio terminato mi cancella la proprietà salvata nel sessionStorage
audio.addEventListener("ended", () => {
  console.log("Audio terminato");
  sessionStorage.removeItem("trackSaved");
});

// generazione della durata traccia
const generateDuration = () => {
  // check per eliminazione contenuto
  const checkProgressDuration = document.getElementById("durationProgress");
  const checkTotalDuration = document.getElementById("totalDuration");
  if (checkProgressDuration) {
    checkProgressDuration.remove();
    checkTotalDuration.remove();
  }

  const progress = document.querySelector(".progress");
  const pDurationProgress = document.createElement("p");
  pDurationProgress.id = "durationProgress";
  pDurationProgress.className = "text-white-50 fs-5 m-0";

  if (saved) {
    const track = JSON.parse(saved);
    if (track.currentTime < 10) {
      pDurationProgress.innerText = "0:0" + track.currentTime;
    } else {
      pDurationProgress.innerText = "0:" + track.currentTime;
    }
  } else {
    pDurationProgress.innerText = "0:00";
  }
  const pTotalDuration = document.createElement("p");
  pTotalDuration.id = "totalDuration";
  pTotalDuration.className = "text-white-50 fs-5 m-0";
  pTotalDuration.innerText = "0:30";

  // gli append
  progress.before(pDurationProgress);
  progress.after(pTotalDuration);
};

// -------------------------------------------------------------------------------

/* A pool of queries for the "Buonasera" shelf */
const DEFAULT_QUERIES = [
  "fedez",
  "salmo",
  "maneskine",
  "taylor swift",
  "dua lipa",
  "coldplay",
  "imagine dragons",
  "drake",
  "billie eilish",
  "jazz",
  "rock italiano",
  "pop 2024",
  "trap",
  "indie",
  "lofi",
];

/* ---------- Utilities ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fetchSearch(q) {
  const url = `${API_BASE}/search?q=${encodeURIComponent(q)}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((j) => j.data || []);
}

/* ---------- Rendering ---------- */
function tileHTML({ title, cover, id }) {
  return `
    <div class="col">
      <a href="album.html?album=${id}" class="tile text-decoration-none text-white">
        <img class="thumb" src="${cover}" alt="" />
        <div class="text">${title}</div>
      </a>
    </div>
  `;
}

function cardHTML({ title, artist, cover, id }) {
  return `
    <div class="col">
      <a href="album.html?album=${id}" class="card-album text-decoration-none text-white d-block h-100">
        <img class="thumb" src="${cover}" alt="">
        <div class="caption">
          <p class="title">${title}</p>
          <p class="sub mb-0">${artist}</p>
        </div>
      </a>
    </div>`;
}

function renderTiles(sets) {
  tilesRow.innerHTML = sets.map(tileHTML).join("");
}

function renderCards(tracks) {
  albumsRow.innerHTML = tracks.map(cardHTML).join("");
  // update mini-player with the first result if exists
  // if (tracks[0]) miniTitle.textContent = `${tracks[0].title} — ${tracks[0].artist}`;
}

/* ---------- Data helpers ---------- */
async function showDefaultGenres() {
  const chosen = shuffle(DEFAULT_QUERIES.slice()).slice(0, 4);
  const promises = chosen.map((q) =>
    fetchSearch(q)
      .then((list) => {
        // take first result as the tile representation
        const t = list[0];
        if (!t) return null;
        return {
          title: t.album?.title || t.title || q,
          cover: t.album?.cover_medium || t.album?.cover || t.artist?.picture_medium || t.artist?.picture || "",
          id: t.album.id || 2228601362,
        };
      })
      .catch(() => null)
  );

  const results = (await Promise.all(promises)).filter(Boolean);
  renderTiles(results);
}

async function performSearch(query) {
  albumsRow.innerHTML = `<div class="col-12 text-muted-soft">Caricamento risultati per “${query}”…</div>`;
  try {
    const data = await fetchSearch(query);
    const cards = data.slice(0, 15).map((d) => ({
      title: d.title_short || d.title,
      artist: d.artist?.name || "Unknown",
      cover: d.album?.cover_medium || d.album?.cover || d.artist?.picture_medium || "",
      id: d.album.id || 2228601362,
    }));
    renderCards(cards);
  } catch (err) {
    albumsRow.innerHTML = `<div class="col-12"><div class="alert alert-danger">Errore caricamento: ${err.message}</div></div>`;
  }
}

/* ---------- Events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  showDefaultGenres(); // fill "Buonasera"
  performSearch("hit italy"); // fill first grid

  // recuper dati dal sessionStorage

  console.log(saved);
  if (saved) {
    const track = JSON.parse(saved);
    console.log("track", track);
    audio.src = track.preview; // nuova traccia
    audio.currentTime = track.currentTime || 0;
    audio
      .play()
      .then(() => {
        console.log("Riproduzione avviata");
        startMedium(track.linkImgTrack, track.title, track.artist);
        startMobile(track.title, track.linkImgTrack);
        generateDuration();
      })
      .catch((err) => console.warn("Riproduzione bloccata:", err));
  }
});

btnRandom.addEventListener("click", (e) => {
  e.preventDefault();
  showDefaultGenres();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  performSearch(q);
});
