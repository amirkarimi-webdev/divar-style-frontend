import { baseUrl } from "../../../utils/shared.js";
import { calculateRelativeTimeDifference, getToken, getUrlParam , paginateItems } from "./../../../utils/utils.js";
window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const postsContainer = document.querySelector("#posts-container");
  const empty = document.querySelector(".empty");
  const paginationItems = document.querySelector(".pagination-items");

  const token = getToken();

  let page = getUrlParam("page");
  !page ? (page = 1) : null;

  let posts = [];

  loading.style.display = "none";

  const res = await fetch(`${baseUrl}/v1/user/posts?page=${page}&limit=4`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const response = await res.json();
  posts = response.data.posts;
  console.log(posts);

  if (posts.length) {
    posts.map((post) => {
      const date = calculateRelativeTimeDifference(post.createdAt);
      postsContainer.insertAdjacentHTML(
        "beforeend",
        `
            <a class="post" href="/pages/post.html?id=${post._id}">
                <div class="post-info">
                ${
                  post.pics.length
                    ? `<img src="${baseUrl}/${post.pics[0].path}" />`
                    : `<img src="/public/images/main/noPicture.PNG" />`
                }
                <div>
                    <p class="title">${post.title}</p>
                    <p class="price">${post.price.toLocaleString()} تومان</p>
                    <p class="location">${date} در ${post.city.name}</p>
                </div>
                </div>
                <div class="post-status">
                <div>
                    <p>وضعیت آگهی:</p>
                    ${
                      post.status === "published"
                        ? `<p class="publish">منتشر شده</p>`
                        : ""
                    }
                    ${
                      post.status === "rejected"
                        ? `<p class="reject">رد شده</p>`
                        : ""
                    }
                    ${
                      post.status === "pending"
                        ? `<p class="pending">در صف انتشار</p>`
                        : ""
                    }
                    
                </div>
                <button class="controll-btn">مدیریت اگهی</button>
                </div>
            </a>
            `
      );
    });

    paginateItems(
        "/pages/userPanel/posts.html",
        paginationItems,
        page,
        response.data.pagination.totalPosts,
        4
      );
  }else{
    emptyContainer.style.display = "flex";
  }
});
