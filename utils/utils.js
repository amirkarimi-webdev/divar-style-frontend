import { baseUrl } from "./shared.js";

const saveInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;

  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();

  // console.log(searchParams.toString());
};

const removeParamFromUrl = (param) => {
  const url = new URL(location.href);
  url.searchParams.delete(param);
  window.history.replaceState(null, null, url);
  location.reload();
};

const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(param);
};

const calculateRelativeTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);

  const timeDifference = currentTime - createdTime;
  const seconds = Math.floor(timeDifference / 1000); //-> s

  if (seconds < 60) {
    return `لحظاتی پیش`;
  } else if (seconds < 3600) {
    // -> بین 1 تا 59 دقیقه
    const minuts = Math.floor(seconds / 60);
    return `${minuts} دقیقه پیش`;
  } else {
    const hours = Math.floor(seconds / 3600); // -> ms
    if (hours < 24 ) {
      return `${hours} ساعت پیش`; 
    }else {
      const days = Math.floor(hours / 24)
      return `${days} روز پیش`;
    }
  }

  

  // if (hours < 24) {
  //   return `${hours} ساعت پیش`;
  // } else {
  //   const days = Math.floor(hours / 24);
  //   return `${days} روز پیش`;
  // }
};

const showModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.add(className);
};

const hideModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.remove(className);
};

const getToken = () => {
  const token = getFromLocalStorage("token");
  return token;
};

const isLogin = async () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // console.log(res);

  return res.status === 200 ? true : false;
};

const showSwal = (title, icon, buttons, callBack) => {
  swal({
    title,
    icon,
    buttons,
  }).then((result) => {
    callBack(result);
  });
};

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data.user;
};

const paginateItems = (
  href,
  paginationContainer,
  currentPage,
  totalItems,
  itemPrePage
) => {
  paginationContainer.innerHTML = "";
  let paginatedCount = Math.ceil(totalItems / itemPrePage);

  for (let i = 1; i < paginatedCount + 1; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
        <li class="${i === Number(currentPage) ? "active" : ""}">
          <a href="${href}?page=${i}">${i}</a>
        </li>
      `
    );
  }
};

export {
  saveInLocalStorage,
  getFromLocalStorage,
  addParamToUrl,
  getUrlParam,
  removeParamFromUrl,
  calculateRelativeTimeDifference,
  showModal,
  hideModal,
  isLogin,
  showSwal,
  getToken,
  getMe,
  paginateItems,
};
