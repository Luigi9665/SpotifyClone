// VARIBILI GENERALI DA RICHIAMARE
const rowAlbum = document.getElementById("rowAlbum");

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
      console.log(artist.data);
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
console.log(params.toString());
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
    const data = await response.json();
    console.log(data);

    const row = document.getElementById("track");
    row.innerHTML = "";

    data.data.forEach((track, index) => {
      const trackDiv = document.createElement("div");
      trackDiv.className = "w-100 row d-flex flex-wrap align-items-center mb-3";

      trackDiv.innerHTML = `
        <div class="col-1 p-0 text-center">${index + 1}</div>
        <div class="col-1 p-0">
          <img class="rounded img-fluid" style="width: 40px; height: 40px"
            src="${track.album.cover_small}" alt="${track.title}" />
        </div>
        <div class="col-4 p-0">${track.title}</div>
        <div class="col-4 d-none d-md-block p-0">${track.rank}</div>
        <div class="col-2 d-none d-md-block p-0">
          ${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}
        </div>
        <div class="col-2">
          <button type="button"
            class="d-block d-md-none text-secondary d-flex align-items-center mx-auto btn btn-dark bg-transparent border-0">
            <i class="bi bi-three-dots"></i>
          </button>
        </div>
      `;

      row.appendChild(trackDiv);
    });
  } catch (error) {
    console.error("Errore:", error);
    alert(error);
  }
}

getTracklist();

// Funzione per generare le card dei risultati
// function generateCard(results) {
//   let row;

//   results.forEach((item, index) => {
//     if (index % 4 === 0) {
//       row = document.createElement("div");
//       row.className = "row";
//       container.appendChild(row);
//     }

//     const col = document.createElement("div");
//     col.className = "col-6 col-md-4 col-xl-2";

//     const imgUrl = item.album ? item.album.cover_medium : item.artist.picture;

//     col.innerHTML = `
//                         <div class="card border-0 bg-transparent" style="width: 150p; font-size: 16px">
//                             <img src="${imgUrl}"
//                                 class="card-img-top rounded" alt="albumImg" />
//                                 <div class="card-body text-center pt-0">
//                                 <p class="card-text">${item.title}</p>
//                                 </div>
//                         </div>
// `;

//     row.appendChild(col);
//   });
// }
// generateCard();
