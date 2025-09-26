const container = document.getElementById("container-foto");
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const colors = ["#FFB6C1", "#87CEFA", "#FFD700", "#90EE90", "#FFA07A", "#20B2AA"];
const defaultGenres = ["rock", "pop", "jazz", "classical", "hip hop", "electronic", "blues", "reggae"];
const buttonResearch = document.getElementById("buttonSearch");
const buttonRandomGenres = document.getElementById("buttonRandomGenres");
const saved = sessionStorage.getItem("trackSaved");

// ------------------------------------------------------------------------------------------
// FUNZIONI PER LA BARRA DI RICERCA
// Funzione per mescolare l'array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Gestione del submit del form
form.addEventListener("submit", (e) => {
  e.preventDefault(); // previene il reload della pagina
  const query = input.value.trim();
  if (!query) return; // se l'input è vuoto non fare nulla
  performSearch(query);
});

buttonResearch.addEventListener("click", (e) => {
  e.preventDefault(); // previene il reload della pagina
  const query = input.value.trim();
  if (!query) return; // se l'input è vuoto non fare nulla
  performSearch(query);
});

// Funzione principale per la ricerca
function performSearch(query) {
  container.innerHTML = ""; // svuota container prima di nuovi risultati

  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`; //encodeURIComponent serve per pulire la stringa, in pratica se digitano spazi o caratteri speciali, questo li pulisce in modo tale che diventi valido e non bloccare la richiesta, semplicemente bisogna aggiungere un pop in questi casi che dica che non è stato trovato nulla
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "d235d3412dmshd4271a5a5fb44c3p11d3f3jsnf9b1434c6565",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        console.error("Nessun risultato trovato", data);
        return;
      }
      console.log("Array originale:", data.data);
      console.log("Numero di elementi nell'array originale:", data.data.length);

      // Filtra solo titoli che contengono la query
      const filteredData = data.data.filter(
        (item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.artist.name.toLowerCase().includes(query.toLowerCase())
      );

      console.log("Array filtrato:", filteredData);
      console.log("Numero di elementi filtrati:", filteredData.length);

      // Mescolo l'array filtrato
      const shuffledData = shuffleArray(filteredData);
      generateCard(shuffledData); //  messo all'inizio 12 cardi .slice (0,12) ma se si vuole il massimo lasciare slice()
    })
    .catch((err) => console.error("Errore:", err));
}

// Funzione per generare le card dei risultati
function generateCard(results) {
  containerCard.innerHTML = "";
  let row;

  results.forEach((item, index) => {
    if (index % 4 === 0) {
      row = document.createElement("div");
      row.className = "row g-4 mb-2";
      container.appendChild(row);
    }

    const col = document.createElement("div");
    col.className = "col-6 col-lg-3";

    const imgUrl = item.album ? item.album.cover_medium : item.artist.picture;

    col.innerHTML = `
  <div class="d-flex flex-column rounded shadow-sm p-3 h-100 overflow-hidden"
       style="background-color: ${colors[index % colors.length]}">

    <!-- Titolo collegato all’album -->
    <h2 class="h6 mb-1">
      <a href="album.html?album=${item.album.id}" class="text-decoration-none text-dark fw-bold">
        ${item.title}
      </a>
    </h2>

    <!-- Nome artista collegato alla pagina artist -->
    <p class="mb-auto">
      <a href="artist.html?artist=${item.artist.id}" class="text-decoration-none text-dark">
        ${item.artist.name}
      </a>
    </p>

    <img src="${imgUrl}" class="img-fluid w-50 ms-auto" alt="${item.title}" style="transform: rotate(25deg);" />
  </div>
`;

    row.appendChild(col);
  });
}

// ------------------------------------------------------------------------------------------

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
// ------------------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------------------
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

// pausa del player al caricamento di una nuova pagina
const pausePlayer = () => {
  audio.pause();
  iconPlayMobile.classList.remove("bi-pause-fill");
  iconPlayMobile.classList.add("bi-play-fill");
  iconPlayMedium.classList.remove("bi-pause-circle-fill");
  iconPlayMedium.classList.add("bi-play-circle-fill");
};

// ------------------------------------------------------------------------------------------// ------------------------------------------------------------------------------------------

// DA MIGLIORARE

// Mostra generi casuali all’avvio
// document.addEventListener("DOMContentLoaded", () => {
//   showDefaultGenres();
// });

// Funzione per generare card di generi casuali
// function showDefaultGenres() {
//   const shuffledGenres = shuffleArray([...defaultGenres]);
//   const selectedGenres = shuffledGenres.slice();

//   console.log("Generi selezionati per default:", selectedGenres);

//   let row;
//   selectedGenres.forEach((genre, index) => {
//     if (index % 4 === 0) {
//       row = document.createElement("div");
//       row.className = "row g-4 mb-2";
//       container.appendChild(row);
//     }

//     const col = document.createElement("div");
//     col.className = "col-6 col-lg-3";

//     col.innerHTML = `
//       <div class="d-flex align-items-start justify-content-between rounded shadow-sm p-3 h-100 overflow-hidden"
//            style="background-color: ${colors[index % colors.length]}">
//         <h2 class="h5 mb-auto">
//           <a href="album.html?playlist=2228601362" class="text-decoration-none text-dark fw-bold">
//             ${genre}
//           </a>
//         </h2>
//       </div>
//     `;
// col.innerHTML = `
//   <div class="d-flex align-items-start justify-content-between rounded shadow-sm p-3 h-100 overflow-hidden"
//        style="background-color: ${colors[index % colors.length]}">
//     <h2 class="h5 mb-auto">
//       <a href="album.html?genre=${encodeURIComponent(genre)}" class="text-decoration-none text-dark fw-bold">
//         ${genre}
//       </a>
//     </h2>
//   </div>
// `;

// row.appendChild(col);

// fetch immagine per il genere
//     const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(genre)}`;
//     const options = {
//       method: "GET",
//       headers: {
//         "x-rapidapi-key": "d235d3412dmshd4271a5a5fb44c3p11d3f3jsnf9b1434c6565",
//         "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
//       },
//     };

//     fetch(url, options)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.data && data.data.length > 0) {
//           const firstItem = data.data[0];
//           const imgUrl = firstItem.album.cover_medium;

//           const img = new Image();
//           img.src = imgUrl;
//           img.className = "img-fluid w-50 ms-auto";
//           img.style.transform = "rotate(25deg)";
//           img.alt = genre;

//           img.onload = () => {
//             col.querySelector("div").appendChild(img);
//           };
//         }
//       })
//       .catch(() => {
//         console.log("Errore fetch immagine per genere:", genre);
//       });
//   });
// }

// costruzione del background con il media color
const generateBackground = (id) => {
  const bg = document.getElementById("background" + id);
  const img = document.getElementById("img" + id);

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

// prove di map per generare card dinamicamente
const urlPlaylist = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";
const containerCard = document.getElementById("containerCard");

const generatePlaylist = (playlist) => {
  const title = playlist.title;
  const img = playlist.picture_medium;
  const id = playlist.id;
  const col = document.createElement("div");
  col.className = "col-6 col-lg-4 col-xl-3";
  const linkPlaylist = document.createElement("a");
  linkPlaylist.className = "text-decoration-none text-dark fw-bold";
  linkPlaylist.style.cursor = "pointer";
  linkPlaylist.href = "album.html?playlist=" + id;
  const card = document.createElement("div");
  card.id = "background" + id;
  card.className = "d-flex align-items-start justify-content-between rounded shadow-sm p-3 h-100 overflow-hidden card-animate";
  const h2 = document.createElement("h2");
  h2.className = "h5 mb-auto text-white";
  h2.innerText = title;

  const imgPlaylist = document.createElement("img");
  imgPlaylist.crossOrigin = "anonymous";
  imgPlaylist.id = "img" + id;
  imgPlaylist.src = img;
  imgPlaylist.className = "img-fluid w-50 ms-auto img-animate";
  imgPlaylist.style.transform = "rotate(25deg)";
  imgPlaylist.alt = "playlist" + title;
  // gli append
  card.append(h2, imgPlaylist);
  linkPlaylist.appendChild(card);
  col.appendChild(linkPlaylist);
  containerCard.appendChild(col);
};

const playlists = new Map([
  ["Top Worldwide", 3155776842],
  ["Radar Weekly", 1282495565],
  ["Chill Hits", 1976454162],
  ["Fresh Pop", 2228601362],
  ["Rap Bangers", 1996494362],
  ["R&B Hits", 1999466402],
  ["Hot New Rock", 1306978785],
  ["Latin Grammy 2025", 6651436664],
  ["Gaming Mode", 2298075882],
  ["Reggaeton 2.0", 13668661441],
  ["Hits Zouk & Kompa", 10349775862],
  ["Queens Of Soul", 1950386602],
  ["Workout", 2153050122],
  ["'20s POP", 13650203641],
  ["Global Dance Hits", 706093725],
  ["Acoustic Hits", 9346933942],
  ["New Country", 1132251583],
  ["Classical Essentials", 747148961],
  ["Chill Jazz", 1914526462],
  ["Afro Hits", 1440614715],
  ["Party Hits", 2097558104],
  ["Love Featurings", 12327094931],
  ["New Alternative", 1402845615],
  ["Metal Radar", 1050179021],
  ["Home Office", 1320283135],
  ["Top K-Pop", 4096400722],
  ["Happy Hits", 1479458365],
  ["Sleep", 733113466],
  ["New Electronic", 2143562442],
]);

const fetchCardPlaylist = async (id) => {
  await fetch(urlPlaylist + id, {
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
    .then((playlist) => {
      // console.log(playlist);
      generatePlaylist(playlist);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });

  generateBackground(id);
};

const manipulationPlaylist = () => {
  playlists.forEach((id, i) => {
    // fetchCardPlaylist(id);
    setTimeout(() => {
      fetchCardPlaylist(id);
    }, i * 300); // 300ms tra una richiesta e l'altra
  });
};

// button per generare le card generi in modo causale
buttonRandomGenres.addEventListener("click", (e) => {
  e.preventDefault(); // previene il reload della pagina
  if (containerCard.children.length === 0) {
    input.value = "";
    container.innerHTML = "";
    container.innerHTML = `<h2 class="text-light mb-2 text-center">Sfoglia tutto</h2>`;
    manipulationPlaylist();
  }
});

// ------------------------------------------------------------------------------------------
// AL CARICAMENTO DELLA PAGINA
// recupera la proprietà dal sessionStorage e riformula il player
window.addEventListener("DOMContentLoaded", () => {
  manipulationPlaylist();
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
        pausePlayer();
        generateDuration();
      })
      .catch((err) => console.warn("Riproduzione bloccata:", err));
  }
});
