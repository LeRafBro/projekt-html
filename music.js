async function searchAlbums() {
  const query = document.getElementById("searchInput").value.trim();

  const results = document.getElementById("results");
  const message = document.getElementById("message");

  if (!query) {
    message.textContent = "Please enter an album or artist!";

    results.innerHTML = "";
    return;
  }

  message.textContent = "Searching...";
  results.innerHTML = "";

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=30`,
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();

    if (data.results.length === 0) {
      message.textContent = "No albums found.";
      return;
    }

    message.textContent = `Found ${data.results.length} albums`;

    data.results.forEach((album) => {
      const albumElement = document.createElement("div");

      albumElement.className = "album";

      const image = document.createElement("img");

      image.src = album.artworkUrl100.replace("100x100bb", "300x300bb");

      image.alt = album.collectionName;

      const title = document.createElement("h3");
      title.textContent = album.collectionName;

      const artist = document.createElement("p");
      artist.textContent = album.artistName;

      const link = document.createElement("a");

      link.href = album.collectionViewUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View Album ↗";

      albumElement.append(image, title, artist, link);

      results.appendChild(albumElement);
    });
  } catch (error) {
    message.textContent = "Something went wrong. Please try again.";

    console.error(error);
  }
}

document.getElementById("searchButton").addEventListener("click", searchAlbums);

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchAlbums();
    }
  });
