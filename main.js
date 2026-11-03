async function addElement() {
  const input = document.getElementById("elementName");
  const name = input.value.trim();

  if (!name) {
    alert("Please enter a name!");
    return;
  }

  const url =
    `https://commons.wikimedia.org/w/api.php` +
    `?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(name)}` +
    `&gsrnamespace=6&gsrlimit=1` +
    `&prop=imageinfo& iiprop=url` +
    `&format=json&origin=*`;

  try {
    const response = await fetch(url.replace("& iiprop", "&iiprop"));
    const data = await response.json();

    const pages = data.query?.pages;
    const image = pages ? Object.values(pages)[0]?.imageinfo?.[0]?.url : null;

    if (!image) {
      alert("No image found!");
      return;
    }

    const card = document.createElement("div");
    card.className = "element-card";

    const title = document.createElement("h3");
    title.textContent = name;

    const photo = document.createElement("img");
    photo.src = image;
    photo.alt = name;

    card.appendChild(photo);
    card.appendChild(title);

    document.getElementById("elements").appendChild(card);

    input.value = "";
  } catch (error) {
    alert("Could not find an image. Try again!");
    console.error(error);
  }
}
