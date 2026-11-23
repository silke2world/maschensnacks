
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
    const heading = document.getElementById("tag-heading");

    const params = new URLSearchParams(window.location.search);
    const selectedTag = params.get("tag");

    // =====================================
    // ERGEBNISSEITE: ARTIKEL ZUM TAG
    // =====================================

    if (tagResults && selectedTag) {

      if (tagCloud) {
        tagCloud.style.display = "none";
      }

      if (heading) {
        heading.textContent = `Artikel zum Thema: ${selectedTag}`;
      }

      const matchingArticles = articles.filter(article =>
        (article.tags || []).includes(selectedTag)
      );

      if (matchingArticles.length === 0) {
        tagResults.textContent = "Keine Artikel gefunden.";
        return;
      }

      const list = document.createElement("ul");

      matchingArticles.forEach(article => {
        const item = document.createElement("li");
        const link = document.createElement("a");

        link.href = "../" + article.url;
        link.textContent = article.title;

        item.appendChild(link);
        list.appendChild(item);
      });

      tagResults.appendChild(list);
      return;
    }

    // =====================================
    // TAG-WOLKE
    // =====================================

    if (tagCloud) {
      const tagCounts = {};

      articles.forEach(article => {
        (article.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      tagCloud.innerHTML = "";

      Object.keys(tagCounts)
        .sort((a, b) => a.localeCompare(b, "de"))
        .forEach(tag => {
          const button = document.createElement("button");

          button.textContent = tag;
          button.className = "tag-button";
          button.type = "button";

          button.addEventListener("click", () => {
            window.location.href =
              "tags/tags.html?tag=" + encodeURIComponent(tag);
          });

          tagCloud.appendChild(button);
        });
    }

  })
  .catch(error => {
    console.error("Fehler beim Laden der Tags:", error);
  });
