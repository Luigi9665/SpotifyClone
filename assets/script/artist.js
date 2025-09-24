const centerFeed = document.getElementById("centralIndex");
const heroImage = document.getElementById("heroImage");

centerFeed.addEventListener("scroll", function () {
  const scrollY = centerFeed.scrollTop;
  const maxHeight = 100;
  let opacity = 1 - scrollY / maxHeight;

  if (opacity < 0) opacity = 0;
  heroImage.style.opacity = opacity;
});

const url = "https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}";
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
    document.getElementById("heroImage").src = data.picture_xl;
    document.getElementById("artist-playlist").textContent = data.tracklist;
  } catch (error) {
    console.error("Errore:", error);
  }
}

getArtist();
