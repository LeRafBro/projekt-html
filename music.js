const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const results = document.getElementById("results");
const status = document.getElementById("status");

const API_URL = "https://itunes.apple.com/search";
let currentRequest = null; // lets us cancel an outdated search

function setStatus(text) {
  status.textContent = text;
}

function createAlbumCard(album) {
  const card = document.createElement("article");
  card.className = "album";

  const image = document.createElement("img");
  // Request a larger cover; fall back gracefully if the field is missing
  image.src = (album.artworkUrl100 || "").replace(/\d+x\d+bb/, "300x300bb");
  image.alt = `${album.collectionName} cover`;
  image.loading = "lazy";
  image.width = 300;
  image.height = 300;

  const title = document.createElement("h3");
  title.textContent = album.collectionName;

  const artist = document.createElement("p");
  artist.textContent = album.artistName;

  const link = document.createElement("a");
  link.href = album.collectionViewUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View Album ↗";

  card.append(image, title, artist, link);
  return card;
}

async function searchAlbums() {
  const query = input.value.trim();
  results.replaceChildren();

  if (!query) {
    setStatus("Please enter an album or artist!");
    return;
  }

  // Cancel any search still in flight
  currentRequest?.abort();
  currentRequest = new AbortController();

  const params = new URLSearchParams({
    term: query,
    media: "music",
    entity: "album",
    limit: "30",
  });

  setStatus("Searching...");
  button.disabled = true;

  try {
    const response = await fetch(`${API_URL}?${params}`, {
      signal: currentRequest.signal,
    });

    if (!response.ok) {
      throw new Error(`Search failed (${response.status})`);
    }

    const { results: albums } = await response.json();

    if (albums.length === 0) {
      setStatus("No albums found.");
      return;
    }

    const fragment = document.createDocumentFragment();
    albums.forEach((album) => fragment.appendChild(createAlbumCard(album)));
    results.appendChild(fragment);

    setStatus(`Found ${albums.length} album${albums.length === 1 ? "" : "s"}`);
  } catch (error) {
    if (error.name === "AbortError") return; // replaced by a newer search
    setStatus("Something went wrong. Please try again.");
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

// The form handles both the button click and the Enter key
form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchAlbums();
});
