import { logout } from "../../../utils/auth.js";
import { getMe, isLogin } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const userIsLogin = await isLogin();
  const sidebarPhoneNumber = document.querySelector("#sidebar-phone-number");
  const logoutBtn = document.querySelector("#logout-btn");

  if (userIsLogin) {
    getMe().then((user) => {
      //   console.log(user);
      sidebarPhoneNumber.innerHTML = `تلفن : ${user.phone}`;
    });
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  } else {
    location.href = "/pages/posts.html";
  }
});
