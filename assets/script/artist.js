const centerFeed = document.getElementById("centralIndex");
const heroImage = document.getElementById("heroImage");

centerFeed.addEventListener("scroll", function () {
  const scrollY = centerFeed.scrollTop;
  const maxHeight = 100;
  let opacity = 1 - scrollY / maxHeight;

  if (opacity < 0) opacity = 0;
  heroImage.style.opacity = opacity;
});

const url = "https://deezerdevs-deezer.p.rapidapi.com/artist/115";
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
    console.log(data); // stampa l'oggetto intero

    // 🔹 Accedi ai singoli campi
    console.log("Nome:", data.name);
    console.log("Immagine:", data.picture_big);
    console.log("Fan:", data.nb_fan);

    document.getElementById("artist-name").textContent = data.name;
    document.getElementById("heroImage").src = data.picture_big;
    document.getElementById("artist-fan").textContent = data.nb_fan;
  } catch (error) {
    console.error("Errore:", error);
  }
}
getArtist();

const url2 = "https://api.deezer.com/artist/11/top?limit=50";
const options2 = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "21b69e9642msh2aed025ccf822f4p13a115jsncaebffbd915f",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

async function getPlaylist() {
  try {
    const response = await fetch(url, options);
    const data2 = await response.json();
    console.log(data2); // stampa l'oggetto intero
  } catch (error) {
    console.error("Errore:", error);
  }
}
getPlaylist();

const url3 = "https://api.deezer.com/artist/115/top?limit=50";
const options3 = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "21b69e9642msh2aed025ccf822f4p13a115jsncaebffbd915f",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

async function getAlbum() {
  try {
    const response = await fetch(url, options);
    const data3 = await response.json();
    console.log(data3); // stampa l'oggetto intero
  } catch (error) {
    console.error("Errore:", error);
  }
}
getAlbum();

id: 115;
link: "https://www.deezer.com/artist/115";
name: "AC/DC";
nb_album: 29;
nb_fan: 9624442;
picture: "https://api.deezer.com/artist/115/image";
picture_big: "https://cdn-images.dzcdn.net/images/artist/ad61d6e0fa724d880db979c9ac8cc5e3/500x500-000000-80-0-0.jpg";
picture_medium: "https://cdn-images.dzcdn.net/images/artist/ad61d6e0fa724d880db979c9ac8cc5e3/250x250-000000-80-0-0.jpg";
picture_small: "https://cdn-images.dzcdn.net/images/artist/ad61d6e0fa724d880db979c9ac8cc5e3/56x56-000000-80-0-0.jpg";
picture_xl: "https://cdn-images.dzcdn.net/images/artist/ad61d6e0fa724d880db979c9ac8cc5e3/1000x1000-000000-80-0-0.jpg";
radio: true;
share: "https://www.deezer.com/artist/115?utm_source=deezer&utm_content=artist-115&utm_term=0_1758719971&utm_medium=web";
tracklist: "https://api.deezer.com/artist/115/top?limit=50";
type: "artist";
