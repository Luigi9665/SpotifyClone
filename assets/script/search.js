const container = document.getElementById("container-foto");
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const colors = ["#FFB6C1", "#87CEFA", "#FFD700", "#90EE90", "#FFA07A", "#20B2AA"];
const defaultGenres = ["rock", "pop", "jazz", "classical", "hip hop", "electronic", "blues", "reggae"];
const buttonResearch = document.getElementById("buttonSearch");
const buttonRandomGenres = document.getElementById("buttonRandomGenres");

// Funzione per mescolare l'array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mostra generi casuali all’avvio
document.addEventListener("DOMContentLoaded", () => {
  showDefaultGenres();
});

buttonRandomGenres.addEventListener("click", (e) => {
  e.preventDefault(); // previene il reload della pagina
  container.innerHTML = "";
  showDefaultGenres();
});

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
      <a href="playlist.html?id=2228601362" class="text-decoration-none text-dark fw-bold">
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

// Funzione per generare card di generi casuali
function showDefaultGenres() {
  const shuffledGenres = shuffleArray([...defaultGenres]);
  const selectedGenres = shuffledGenres.slice();

  console.log("Generi selezionati per default:", selectedGenres);

  let row;
  selectedGenres.forEach((genre, index) => {
    if (index % 4 === 0) {
      row = document.createElement("div");
      row.className = "row g-4 mb-2";
      container.appendChild(row);
    }

    const col = document.createElement("div");
    col.className = "col-6 col-lg-3";

    col.innerHTML = `
      <div class="d-flex align-items-start justify-content-between rounded shadow-sm p-3 h-100 overflow-hidden"
           style="background-color: ${colors[index % colors.length]}">
        <h2 class="h5 mb-auto">
          <a href="album.html?genre=${encodeURIComponent(genre)}" class="text-decoration-none text-dark fw-bold">
            ${genre}
          </a>
        </h2>
      </div>
    `;

    row.appendChild(col);

    // fetch immagine per il genere
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(genre)}`;
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
        if (data.data && data.data.length > 0) {
          const firstItem = data.data[0];
          const imgUrl = firstItem.album.cover_medium;

          const img = new Image();
          img.src = imgUrl;
          img.className = "img-fluid w-50 ms-auto";
          img.style.transform = "rotate(25deg)";
          img.alt = genre;

          img.onload = () => {
            col.querySelector("div").appendChild(img);
          };
        }
      })
      .catch(() => {
        console.log("Errore fetch immagine per genere:", genre);
      });
  });
}
