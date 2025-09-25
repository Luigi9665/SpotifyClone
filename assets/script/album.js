//  VARIABILI GENERALI
const volumeBar = document.getElementById("volume-bar");
const volumeFill = document.getElementById("volume-fill");
const volumeThumb = document.getElementById("volume-thumb");
const audio = document.getElementById("audio-player");
// const URL = "https://deezerdevs-deezer.p.rapidapi.com/album/";
// const appId = params.get("album");
let URL = "";
let appId = "";
let condition;
const params = new URLSearchParams(window.location.search);
const rowTracks = document.getElementById("rowTracks");
const rowAlbum = document.getElementById("rowAlbum");

// -------------------------------------------------------------------------------
// VARIABILI UTILI PER IL PLAYER
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
// manipolazione dell'indirizzo url per gestire le playlist e gli album
console.log(params.toString());
if (params.toString().includes("album")) {
  appId = params.get("album");
  URL = "https://deezerdevs-deezer.p.rapidapi.com/album/";
  condition = true;
} else {
  appId = params.get("playlist");
  URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";
  condition = false;
}

// FUNZIONI

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
});

// -------------------------------------------------------------------------------

// GENERAZIONE DELLA PAGINA

// controllo del bg success
const checkSuccess = () => {
  const rowSucce = document.querySelectorAll(".selected");
  if (rowSucce) {
    rowSucce.forEach((row) => row.classList.remove("bg-success", "bg-gradient", "rounded-3", "selected"));
  } else {
    return;
  }
};

// costruzione del background con il media color
const generateBackground = () => {
  const bg = document.getElementById("background");
  const img = document.getElementById("album");

  img.onload = () => {
    const colorThief = new ColorThief();
    // palette di 3 colori principali
    const palette = colorThief.getPalette(img, 11);

    const gradient = `linear-gradient(to bottom, 
      rgb(${palette[0].join(",")}), 
      rgb(${palette[1].join(",")}),
      #000000
    )`;

    bg.style.backgroundImage = gradient;
  };
};

// generazione dei dettagli album con foto, titolo e cantante
const generateAlbum = (album, condition) => {
  let imgAlbum;
  let imgSinger;
  let name;
  let date;
  const type = album.type;
  const title = album.title;
  document.title = title;
  if (condition) {
    imgAlbum = album.cover_big;
    imgSinger = album.artist.picture;
    name = album.artist.name;
    date = album.release_date.split("-")[0];
  } else {
    imgAlbum = album.picture_big;
    imgSinger = album.picture_small;
    name = album.creator.name;
    date = album.creation_date.split("-")[0];
  }
  const totalTracks = album.nb_tracks;
  const duration = formatTimeAlbum(album.duration);

  // creazione della col img con inserimento immagine album
  const colImg = document.createElement("div");
  colImg.className = "col-9 offset-2 col-md-3 offset-md-0";
  const divImg = document.createElement("div");
  divImg.className = "shadow-lg";
  const img = document.createElement("img");
  img.crossOrigin = "Anonymous";
  img.id = "album";
  img.src = imgAlbum;
  img.alt = "cover album";
  img.className = "w-100";

  // creazione col album con tutte le referenze
  const colAlbum = document.createElement("div");
  colAlbum.className = "col-12 col-md-9 d-flex mt-5 mt-md-0";
  const divAlbum = document.createElement("div");
  divAlbum.className = "flex-fill d-flex flex-column justify-content-end";
  const h4 = document.createElement("h4");
  h4.className = "text-white text-uppercase d-none d-md-block";
  h4.innerText = type;
  // h1 gestito in mobile
  const h1Mobile = document.createElement("h1");
  h1Mobile.className = "d-md-none display-2 fw-bold text-white w-100";
  h1Mobile.setAttribute("style", "font-family: Circular, sans-serif; letter-spacing: -1px");
  h1Mobile.innerText = title;
  // h1 gestito dopo il medium
  const h1Medium = document.createElement("h1");
  h1Medium.className = "d-none d-md-block fw-bold text-white w-100";
  h1Medium.setAttribute("style", "font-size: 6rem; font-family: Circular, sans-serif; letter-spacing: -5px");
  h1Medium.innerText = title;

  //   div con credenziali del cantante
  const divSinger = document.createElement("div");
  divSinger.className = "d-flex align-items-baseline gap-2";
  const divImgSinger = document.createElement("div");
  divImgSinger.className = "rounded-circle";
  divImgSinger.setAttribute("style", "width: 30px; height: 30px");
  const singer = document.createElement("img");
  singer.className = "w-100 h-100 rounded-circle";
  singer.src = imgSinger;
  singer.alt = "badge singer";
  const p = document.createElement("p");
  p.innerHTML = `<p class="text-white d-flex align-items-center gap-1">
  ${name} <span style="font-size: 10px">•</span> ${date} <span style="font-size: 10px">•</span> ${totalTracks} brani,
  <span class="text-white-50">${duration}.</span>
  </p>`;

  //   GLI APPEND
  // append della prima col con img dell'album
  divImg.appendChild(img);
  colImg.appendChild(divImg);

  //  append col credenziali album e cantante
  // il div col flex che gestisci il contenuto e il suo append
  divImgSinger.appendChild(singer);
  divSinger.append(divImgSinger, p);
  divAlbum.append(h4, h1Mobile, h1Medium, divSinger);
  // per poi inserirlo nella col album
  colAlbum.appendChild(divAlbum);

  // Inserisco tutto col append nella row album
  rowAlbum.append(colImg, colAlbum);
};

// generazione delle tracce
const generateTracks = (track, index) => {
  // dichiarazioni di tutte le variabile da inserire nella row
  const number = index + 1;
  const explicit = track.explicit_lyrics;
  const title = track.title;
  const artist = track.artist.name;
  const riproduzioni = track.rank;
  const time = formatTime(track.duration);
  const preview = track.preview;
  const idSinger = track.artist.id;
  const linkImgTrack = `https://cdn-images.dzcdn.net/images/cover/${track.md5_image}/500x500.jpg`;

  // crezione della row
  const row = document.createElement("div");
  row.className = "row my-2 align-items-center";

  //   colonna dell'indice
  const colIndex = document.createElement("div");
  colIndex.className = "col-1 d-none d-md-block text-center";
  const h4 = document.createElement("h4");
  h4.className = "text-white-50";
  h4.innerText = number;
  colIndex.appendChild(h4);

  // colonna del titolo
  const colTitle = document.createElement("div");
  colTitle.className = "col-10 col-md-6";
  const divGenerics = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.className = "btn p-0 text-white text-start fs-5 mb-0";
  h2.innerText = title;

  //   il Listener per mandare la traccia all'elemento audio
  h2.addEventListener("click", () => {
    audio.pause(); // stop eventuale brano in corso
    audio.src = preview; // nuova traccia
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        console.log("Riproduzione avviata");
        startMedium(linkImgTrack, title, artist);
        startMobile(title, linkImgTrack);
        checkSuccess();
        row.classList.add("bg-success", "bg-gradient", "rounded-3", "selected");
      })
      .catch((err) => console.warn("Riproduzione bloccata:", err));
  });

  const linkArtist = document.createElement("a");
  linkArtist.className = "text-decoration-none text-white-50 d-block";
  linkArtist.href = "artist.html?artist=" + idSinger;
  linkArtist.innerText = artist;
  const divExplicit = document.createElement("div");
  divExplicit.className = "d-flex align-items-center gap-1";
  if (explicit) {
    const span = document.createElement("span");
    span.style.fontSize = "12px";
    span.className = "btn bg-body-secondary text-center px-1 py-0";
    span.innerText = "E";
    divExplicit.append(span, linkArtist);
    divGenerics.append(h2, divExplicit);
  } else {
    divGenerics.append(h2, linkArtist);
  }

  colTitle.appendChild(divGenerics);

  // colonna quante riproduzioni
  const colRipro = document.createElement("div");
  colRipro.className = "col-4 d-none d-md-block";
  const pRipro = document.createElement("p");
  pRipro.className = "text-white-50 text-center";
  pRipro.innerText = riproduzioni;
  colRipro.appendChild(pRipro);

  // colonna del time
  const colTime = document.createElement("div");
  colTime.className = "col-1 d-none d-md-block";
  const pTime = document.createElement("p");
  pTime.className = "text-white-50";
  pTime.innerHTML = time;
  colTime.appendChild(pTime);

  // colonna da far scomparire al medium
  const colIcon = document.createElement("div");
  colIcon.className = "col-1 d-md-none";
  const btnIcon = document.createElement("button");
  btnIcon.className = "btn text-white-50 fs-3 p-0";
  const icon = document.createElement("i");
  icon.className = "bi bi-three-dots-vertical";
  btnIcon.appendChild(icon);
  colIcon.appendChild(btnIcon);

  //   append nella row di tutte le col
  row.append(colIndex, colTitle, colRipro, colTime, colIcon);
  rowTracks.appendChild(row);
};

// FETCH
// AL CARICAMENTO DELLA PAGINA
window.addEventListener("DOMContentLoaded", () => {
  fetch(URL + appId, {
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
    .then((album) => {
      rowAlbum.innerHTML = "";
      rowTracks.innerHTML = "";
      console.log(album);

      //   chiamo il generate Credenziali Album + cantante
      generateAlbum(album, condition);

      //   ciclo for per generazione delle tracce con rispettivi indici
      for (let i = 0; i < album.tracks.data.length; i++) {
        const track = album.tracks.data[i];
        generateTracks(track, i);
      }

      //   richiamo il generate background
      generateBackground();
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
});
