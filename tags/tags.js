
fetch("../tags.json")
  .then(response => response.json())
  .then(data => {
    const articles = data.articles;
    const tagCloud = document.getElementById("tag-cloud");
    const tagResults = document.getElementById("tag-results");

    // Alle Tags sammeln und zählen
    const tagCounts = {};

    articles.forEach(article => {
      article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Tag-Wolke erzeugen
    Object.keys(tagCounts)
      .sort((a, b) => a.localeCompare(b, "de"))
      .forEach(tag => {
        const button = document.createElement("button");

        button.textContent = tag;
        button.className = "tag-button";

        button.addEventListener("click", () => {
          showArticles(tag);
        });

        tagCloud.appendChild(button);
      });

    // Zugehörige Artikel anzeigen
    function showArticles(selectedTag) {
      tagResults.innerHTML = "";

      const heading = document.createElement("h2");
      heading.textContent = `Artikel mit dem Tag: ${selectedTag}`;
      tagResults.appendChild(heading);

      const matchingArticles = articles.filter(article =>
        article.tags.includes(selectedTag)
      );

      const list = document.createElement("ul");

      matchingArticles.forEach(article => {
        const item = document.createElement("li");
        const link = document.createElement("a");

        link.href = `../${article.url}`;
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
