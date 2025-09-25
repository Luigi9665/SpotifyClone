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

// prendo dati artist da API

const url = "https://deezerdevs-deezer.p.rapidapi.com/artist/11";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "21b69e9642msh2aed025ccf822f4p13a115jsncaebffbd915f",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

async function getArtist() {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

    document.getElementById("artist-name").textContent = data.name;
    document.getElementById("like-name").textContent = "di " + data.name;
    document.getElementById("heroImage").src = data.picture_xl;
    document.getElementById("artist-fan").textContent = data.nb_fan + " ascoltatori mensili";
  } catch (error) {
    console.error("Errore:", error);
  }
}

getArtist();

// prendo dati per tracklist e le creo

const urlT = "https://striveschool-api.herokuapp.com/api/deezer/artist/11/top?limit=5";
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
