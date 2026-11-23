
// Pfad zur tags.json relativ zur JavaScript-Datei
const jsonPath = new URL("../tags.json", document.currentScript.src);

fetch(jsonPath)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Fehler beim Laden: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const articles = data.articles || [];
    const tagCloud = document.getElementById("tag-cloud");
    const tagResults = document.getElementById("tag-results");

    if (!tagCloud) {
      console.error("Element #tag-cloud wurde nicht gefunden.");
      return;
    }

    // Alle Tags sammeln und zählen
    const tagCounts = {};

    articles.forEach(article => {
      (article.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Tag-Wolke erzeugen
    tagCloud.innerHTML = "";

    Object.keys(tagCounts)
      .sort((a, b) => a.localeCompare(b, "de"))
      .forEach(tag => {
        const button = document.createElement("button");

        button.textContent = tag;
        button.className = "tag-button";
        button.type = "button";

        button.addEventListener("click", () => {
          showArticles(tag);
        });

        tagCloud.appendChild(button);
      });

    // Zugehörige Artikel anzeigen
    function showArticles(selectedTag) {
      if (!tagResults) return;

      tagResults.innerHTML = "";

      const heading = document.createElement("h2");
      heading.textContent = `Artikel mit dem Tag: ${selectedTag}`;
      tagResults.appendChild(heading);

      const matchingArticles = articles.filter(article =>
        (article.tags || []).includes(selectedTag)
      );

      const list = document.createElement("ul");

      matchingArticles.forEach(article => {
        const item = document.createElement("li");
        const link = document.createElement("a");

        // Funktioniert sowohl auf ROOT/index.html
        // als auch auf ROOT/tags/tags.html
        const pageUrl = new URL(
          `../${article.url}`,
          document.currentScript?.src || window.location.href
        );

        link.href = pageUrl.href;
        link.textContent = article.title;

        item.appendChild(link);
        list.appendChild(item);
      });

      tagResults.appendChild(list);
    }
  })
  .catch(error => {
    console.error("Fehler beim Laden der Tags:", error);
  });
