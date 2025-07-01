import { baseUrl, getSupportArticles } from "./../../utils/shared.js";

window.addEventListener("load", () => {
  const load = document.querySelector("#loading-container");
  const popularArticlesElement = document.querySelector("#popular-articles");
  const categoriesContainerElement = document.querySelector(
    "#categories-container"
  );

  getSupportArticles().then((supportArticlesCategory) => {
    load.style.display = "none";
    // console.log(supportArticlesCategory);

    const popularArticles = supportArticlesCategory.find(
      (category) => category.shortName === "popular_articles"
    );

    popularArticles.articles.map((article) => {
      popularArticlesElement.insertAdjacentHTML(
        "beforeend",
        `
                <a href="/pages/support/article.html?id=${
                  article._id
                }" class="article">
                    <p>${article.title}</p>
                    <span>${article.body.slice(0, 181)} ... </span>
                    <div>
                    <i class="bi bi-arrow-left"></i>
                    <p>ادامه مقاله</p>
                    </div>
                </a>
            `
      );
    });

    supportArticlesCategory.map((category) => {
      categoriesContainerElement.insertAdjacentHTML(
        "beforeend",
        `
              <a href="/pages/support/articles.html?id=${category._id}">
                  <img src="${baseUrl}/${category.pic.path}" width="64" height="64" alt="" />
                  <div>
                  <p>${category.name}</p>
                  <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از
                  </span>
                  </div>
                  <i class="bi bi-chevron-left"></i>
              </a>
          `
      );
    });

    const articles = [];
    supportArticlesCategory.map((category) => {
      let categoryArticles = category.articles;
      articles.push(...categoryArticles);
    });
    // console.log("articles", articles);

    const searchInput = document.querySelector("#search-input");
    const searchResult = document.querySelector("#search-result");
    const removeIcon = document.querySelector("#remove-icon");

    searchInput.addEventListener("keyup", (e) => {
      e.preventDefault();

      if (e.target.value.trim()) {
        if (e.keyCode === 13) {
          location.href = `/pages/support/search.html?key=${e.target.value.trim()}`;
        }
        searchResult.classList.add("active");
        removeIcon.classList.add("active");
        const filterdArticles = articles.filter((article) =>
          article.title.includes(e.target.value.trim())
        );
        if (filterdArticles.length) {
          searchResult.innerHTML = `
          <a href="/pages/support/search.html?key=${e.target.value.trim()}">
            <i class="bi bi-search"></i>
            ${e.target.value.trim()}
          </a>
          `;
          filterdArticles.map((article) => {
            searchResult.insertAdjacentHTML(
              "beforeend",
              `
               <a href="/pages/support/article.html?id=${article._id}">
                 <i class="bi bi-card-text"></i>
                 ${article.title}
              </a>
              `
            );
          });
        } else {
          searchResult.innerHTML = `
          <a href="/pages/support/search.html?key=${e.target.value.trim()}">
            <i class="bi bi-search"></i>
            ${e.target.value.trim()}
          </a>
          `;
        }
      } else {
        searchInput.value = "";
        searchResult.classList.remove("active");
        removeIcon.classList.remove("active");
      }
    });

    removeIcon.addEventListener("click", () => {
      searchInput.value = "";
      searchResult.classList.remove("active");
      removeIcon.classList.remove("active");
    });
  });
});
