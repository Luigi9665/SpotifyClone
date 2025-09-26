// VARIBILI GENERALI DA RICHIAMARE
const rowAlbum = document.getElementById("rowAlbum");
const row = document.getElementById("track");
const saved = sessionStorage.getItem("trackSaved");

// VARIABILI UTILI PER IL PLAYER
const audio = document.getElementById("audio-player");
const volumeBar = document.getElementById("volume-bar");
const volumeFill = document.getElementById("volume-fill");
const volumeThumb = document.getElementById("volume-thumb");
// variabili player mobile
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

// -------------------------------------------------------------------------------
// SALVATAGGIO NEL SESSIONSTORAGE
const saveTrack = (track) => {
  const data = {
    linkImgTrack: `https://cdn-images.dzcdn.net/images/cover/${track.md5_image}/500x500.jpg`,
    title: track.title,
    artist: track.artist.name,
    preview: track.preview,
    currentTime: audio.currentTime,
  };

  sessionStorage.setItem("trackSaved", JSON.stringify(data));
};

// -------------------------------------------------------------------------------
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
// img bg scompare allo scroll

const centerFeed = document.getElementById("centralIndex");
const heroImage = document.getElementById("heroImage");

centerFeed.addEventListener("scroll", function () {
  const scrollY = centerFeed.scrollTop;
  const maxHeight = 100;
  let opacity = 1 - scrollY / maxHeight;

  if (opacity < 0) opacity = 0;
  heroImage.style.opacity = opacity;
});

// CREAZIONE DELLE COLONNE ALBUM
const generateAlbum = (artist) => {
  // variabili
  const imgAlbum = artist.album.cover_medium;
  const titleAlbum = artist.album.title;
  const albumID = artist.album.id;

  // creazione del link per pagina album
  const linkAlbum = document.createElement("a");
  linkAlbum.className = "text-decoration-none";
  linkAlbum.style.fontFamily = "inherit";
  linkAlbum.style.cursor = "pointer";
  linkAlbum.href = "album.html?album=" + albumID;

  // creazione della col
  const colAlbum = document.createElement("div");
  colAlbum.className = "col-6 col-md-4 col-xl-2";

  // creazione della card
  const card = document.createElement("div");
  card.className = "card border-0 bg-transparent";
  card.setAttribute("style", "width: 150p; font-size: 16px");
  const img = document.createElement("img");
  img.className = "card-img-top rounded";
  img.alt = "album Artist";
  img.src = imgAlbum;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body text-center pt-0";
  const p = document.createElement("p");
  p.className = "card-text";
  p.innerText = titleAlbum;

  // gli append
  cardBody.appendChild(p);
  card.append(img, cardBody);
  linkAlbum.appendChild(card);
  colAlbum.appendChild(linkAlbum);
  rowAlbum.appendChild(colAlbum);
};

// FETCH PER LA RICERCA DEGLI ALBUM
const getFetchSearch = (name) => {
  const url = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + name;
  fetch(url, {
    headers: {
      "x-rapidapi-key": "9421b0f4f3msh454cbdf404defecp1c0a31jsn6a41048cfe81",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Autorizzazione fallita, controlla la tua API key.");
        } else if (response.status === 404) {
          throw new Error("Risorsa non trovata (404).");
        } else if (response.status >= 500) {
          throw new Error("Errore del server, riprova più tardi.");
        } else {
          throw new Error("Errore nella richiesta: " + response.status);
        }
      }
      return response.json();
    })
    .then((artist) => {
      artist.data.forEach((artist) => generateAlbum(artist));
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
};

// prendo dati artist da API
let URL = "";
let appId = "";
let condition;
const params = new URLSearchParams(window.location.search);
// const url = "https://deezerdevs-deezer.p.rapidapi.com/artist/11";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "21b69e9642msh2aed025ccf822f4p13a115jsncaebffbd915f",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};
if (params.toString().includes("artist")) {
  appId = params.get("artist");
  URL = "https://deezerdevs-deezer.p.rapidapi.com/artist/";
  condition = true;
}
async function getArtist() {
  try {
    const response = await fetch(URL + appId, options);
    const data = await response.json();
    console.log(data);

    document.getElementById("artist-name").textContent = data.name;
    document.getElementById("like-name").textContent = "di " + data.name;
    document.getElementById("heroImage").src = data.picture_xl;
    document.getElementById("likeImage").src = data.picture;
    document.getElementById("artist-fan").textContent = data.nb_fan + " ascoltatori mensili";
    const name = data.name;

    // richiamo il fetch per la ricerca
    if (name) {
      getFetchSearch(name);
      rowAlbum.innerHTML = "";
    }
  } catch (error) {
    console.error("Errore:", error);
  }
}

getArtist();

// funzione per la crezione delle tracce

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const secs = time % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// controllo del bg success
const checkSuccess = () => {
  const rowSucce = document.querySelectorAll(".selected");
  if (rowSucce) {
    rowSucce.forEach((row) => row.classList.remove("bg-success", "bg-gradient", "rounded-3", "selected"));
  } else {
    return;
  }
};

const generateTrack = (track, index) => {
  // variabili
  const name = track.artist.name;
  const imgTrack = track.album.cover_small;
  const trackTitle = track.title;
  const rank = track.rank;
  const duration = formatTime(track.duration);
  const preview = track.preview;

  // generazione della row
  const rowTrack = document.createElement("div");
  rowTrack.style.cursor = "pointer";
  rowTrack.className = "w-100 row col-12 col-md-4 d-flex flex-wrap align-items-center justify-content-around mb-3";

  // col indice
  const colIndex = document.createElement("div");
  colIndex.className = "col-1 p-0 text-center";
  const pIndex = document.createElement("p");
  pIndex.innerText = index + 1;
  // col img
  const colImg = document.createElement("div");
  colImg.className = "col-1 p-0";
  const img = document.createElement("img");
  img.className = "rounded img-fluid";
  img.setAttribute("style", "width: 40px; height: 40px");
  img.src = imgTrack;
  // col title
  const colTitle = document.createElement("div");
  colTitle.className = "col-4 p-0";
  const pTitle = document.createElement("p");
  pTitle.innerText = trackTitle;
  // col rank
  const colRank = document.createElement("div");
  colRank.className = "col-4 d-none d-md-block p-0";
  const pRank = document.createElement("p");
  pRank.className = "ps-1";
  pRank.innerText = rank;
  // col duration
  const colDuration = document.createElement("div");
  colDuration.className = "col-2 d-none d-md-block p-0";
  const pDuration = document.createElement("p");
  pDuration.innerText = duration;
  //  col button
  const colButton = document.createElement("div");
  colButton.className = "col-3 d-md-none";
  colButton.innerHTML = `<button type="button"
  class="d-block text-secondary d-flex align-items-center mx-auto btn btn-dark bg-transparent border-0">
  <i class="bi bi-three-dots"></i>
  </button>`;

  // gli append
  colIndex.appendChild(pIndex);
  colImg.appendChild(img);
  colTitle.appendChild(pTitle);
  colRank.appendChild(pRank);
  colDuration.appendChild(pDuration);
  rowTrack.append(colIndex, colImg, colTitle, colRank, colDuration, colButton);
  row.appendChild(rowTrack);

  // il listener
  rowTrack.addEventListener("click", () => {
    audio.pause(); // stop eventuale brano in corso
    audio.src = preview; // nuova traccia

    // controllo se c'è la session storage
    const saved = sessionStorage.getItem("trackSaved");
    if (!saved) {
      audio.currentTime = 0;
    }
    audio
      .play()
      .then(() => {
        sessionStorage.removeItem("trackSaved");
        saveTrack(track);
        console.log("Riproduzione avviata");
        generateDuration();
        startMedium(imgTrack, trackTitle, name);
        startMobile(trackTitle, imgTrack);
        checkSuccess();
        rowTrack.classList.add("bg-success", "bg-gradient", "rounded-3", "selected");
      })
      .catch((err) => console.warn("Riproduzione bloccata:", err));
  });
};

// prendo dati per tracklist e le creo

const urlT = `https://striveschool-api.herokuapp.com/api/deezer/artist/${appId}/top?limit=5`;
const optionsT = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "21b69e9642msh2aed025ccf822f4p13a115jsncaebffbd915f",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};
async function getTracklist() {
  try {
    const response = await fetch(urlT, optionsT);
    const artist = await response.json();
    console.log(artist);

    row.innerHTML = "";

    for (let i = 0; i < artist.data.length; i++) {
      const track = artist.data[i];
      generateTrack(track, i);
    }
  } catch (error) {
    console.error("Errore:", error);
    alert(error);
  }
}

getTracklist();

window.addEventListener("DOMContentLoaded", () => {
  if (saved) {
    const track = JSON.parse(saved);
    console.log("track", track);
    audio.src = track.preview; // nuova traccia
    audio.currentTime = track.currentTime || 0;
    audio
      .play()
      .then(() => {
        console.log("Riproduzione avviata");
        generateDuration();
        startMedium(track.linkImgTrack, track.title, track.artist);
        startMobile(track.title, track.linkImgTrack);
      })
      .catch((err) => console.warn("Riproduzione bloccata:", err));
  }
});
