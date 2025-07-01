import { baseUrl, getArticles } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  const categoryID = getUrlParam("id");
  const load = document.querySelector("#loading-container");
  const breadcrumbSpan = document.querySelector("#breadcrumb span");
  const categoryInfo = document.querySelector("#category-info");
  const articlesContainer = document.querySelector("#articles");

  getArticles().then((categories) => {
    load.style.display = "none";

    const category = categories.find((category) => category._id === categoryID);
    console.log(category);

    breadcrumbSpan.innerHTML = category.name;
    document.title = category.name;
    categoryInfo.insertAdjacentHTML(
      "beforeend",
      `
      <img class="category-info-icon" src="${baseUrl}/${category.pic.path}"></img>
      <p class="category-info-title">${category.name}</p>
      `
    );

    category.articles.map((article) => {
      articlesContainer.insertAdjacentHTML(
        "beforeend",
        `
           <a href="/pages/support/article.html?id=${
             article._id
           }" class="article">
               <div>
                    <p>${article.title}</p>
                    <span>${article.body.slice(0, 181)} ... </span>
               </div>
               <i class="bi bi-arrow-left"></i>
            </a>
          `
      );
    });
  });
});
