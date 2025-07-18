import {
  submitNumber,
  verifyOtp,
  requestNewOtp,
  logout,
} from "../../utils/auth.js";
import {
  getAndShowSocials,
  getAndShowCityLocation,
  getAllLocations,
  getPostCategories,
  showPanelLink,
} from "../../utils/shared.js";
import {
  addParamToUrl,
  showModal,
  hideModal,
  getUrlParam,
  getFromLocalStorage,
  saveInLocalStorage,
  removeParamFromUrl,
  isLogin,
  getMe,
} from "../../utils/utils.js";

window.addEventListener("load", async () => {
  getAndShowSocials();
  showPanelLink();
  getAndShowCityLocation();

  let selectedCities = [];
  let allCities = [];
  const isUserLogin = await isLogin();

  const globalSearchInput = document.querySelector("#global_search_input");
  const mostSearchedContainer = document.querySelector("#most_searched");
  const searchbarModalOverlay = document.querySelector(
    ".searchbar__modal-overlay"
  );
  const headerCity = document.querySelector(".header__city");
  const deleteAllSelectedCities = document.querySelector("#delete-all-cities");
  const cityModalList = document.querySelector("#city_modal_list");
  const cityModalAcceptBtn = document.querySelector(".city-modal__accept");
  const cityModalCloseBtn = document.querySelector(".city-modal__close");
  const cityModalError = document.querySelector("#city_modal_error");
  const cityModalOverlay = document.querySelector(".city-modal__overlay");
  const cityModalCities = document.querySelector(".city-modal__cities");
  const headerCategoryBtn = document.querySelector(".header__category-btn");
  const categoriesList = document.querySelector("#categories-list");
  const categoryResults = document.querySelector("#category-results");
  const categoryModalOverlay = document.querySelector(
    ".category_modal_overlay"
  );
  const headerCategoryMenuBtn = document.querySelector(
    ".header__category-menu-btn"
  );
  // const headerCategoryMenu = document.querySelector("#header__category-menu");
  const cityModalSearchInput = document.querySelector(
    "#city-modal-search-input"
  );
  const loginModalCloseIcon = document.querySelector(".login-modal__icon");
  const loginModalOverlay = document.querySelector(".login_modal_overlay");
  const submitPhoneNumberBtn = document.querySelector(
    ".submit_phone_number_btn"
  );
  const loginBtn = document.querySelector(".login_btn");
  const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
  const createPostBtn = document.querySelector(".create_post_btn");

  const mostSearchKeyWords = ["ماشین", "ساعت", "موبایل", "لپ تاپ", "تلویزون"];

  getMe().then((user) => {
    if (user) {
      const logoutBtn = document.querySelector(".logout-link");

      logoutBtn?.addEventListener("click", logout);
    }
  });

  getPostCategories().then((categories) => {
    categories.forEach((category) => {
      categoriesList?.insertAdjacentHTML(
        "beforeend",
        ` <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${category._id}')">
            <div class="header__category-menu-link">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon bi bi-house"></i>
                ${category.title}
              </div>
              <div class="header__category-menu-link-left">
                <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
              </div>
            </div>
          </li>`
      );
    });
    window.showActiveCategorySubs = (categoryID) => {
      // console.log("active category -> " , categoryID);
      const category = categories.find(
        (category) => category._id === categoryID
      );
      categoryResults ? (categoryResults.innerHTML = "") : null;
      category.subCategories.map((subCategory) => {
        categoryResults?.insertAdjacentHTML(
          "beforeend",
          ` <div>
              <ul class="header__category-dropdown-list">
                <div class="header__category-dropdown-title" onclick="categoryClickHandler('${
                  subCategory._id
                }')">${subCategory.title}</div>
                  ${subCategory.subCategories
                    .map(
                      (subSubCategory) => `
                    <li class="header__category-dropdown-item">
                      <div onclick="categoryClickHandler('${subSubCategory._id}')" class="header__category-dropdown-link">${subSubCategory.title}</div>
                    </li>
                  `
                    )
                    .join("")}
              </ul>
            </div>`
        );
      });
    };
    showActiveCategorySubs(categories[0]._id);

    window.categoryClickHandler = function (categoryID) {
      addParamToUrl("categoryID", categoryID);
    };
  });

  globalSearchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.value.trim()) {
        // location.href = `posts.html?value=${e.target.value.trim()}`;
        addParamToUrl("value", e.target.value.trim());
      }
    }
  });

  mostSearchKeyWords.forEach((keyWord) => {
    const categoryID = getUrlParam("categoryID");
    let href = `posts.html?value=${keyWord}${
      categoryID ? `&categoryID=${categoryID}` : ""
    }`;

    mostSearchedContainer?.insertAdjacentHTML(
      "beforeend",
      `<li class="header__searchbar-dropdown-item">
         <a href="${href}" class="header__searchbar-dropdown-link">${keyWord}</a>
      </li>`
    );
  });

  headerCity?.addEventListener("click", () => {
    showModal("city-modal", "city-modal--active");
    const cities = getFromLocalStorage("cities");
    selectedCities = cities;
    deleteAllSelectedCities.style.display = "block";

    addCityToModal(selectedCities);
  });

  const addCityToModal = (cities) => {
    const citySelected = document.querySelector("#city-selected");
    citySelected.innerHTML = "";
    cities.forEach((city) => {
      citySelected.insertAdjacentHTML(
        "beforeend",
        ` <div class="city-modal__selected-item">
            <span class="city-modal__selected-text">${city.title}</span>
            <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
              <i class="city-modal__selected-icon bi bi-x"></i>
            </button>
          </div>`
      );
    });
  };

  window.removeCityFromModal = (cityID) => {
    // console.log(cityID);
    const currentCity = document.querySelector(`#city-${cityID}`);
    if (currentCity) {
      const checkBox = currentCity.querySelector("input");
      const checkboxShape = currentCity.querySelector("div");
      checkBox.checked = true;
      checkboxShape.classList.remove("active");
    }

    selectedCities = selectedCities.filter((city) => city.id !== cityID);
    addCityToModal(selectedCities);
    toggleCityModalBtns(selectedCities);
  };

  getAllLocations().then((data) => {
    // console.log("locations -> ", data);
    allCities = data;
    showProvinces(allCities);
  });

  const showProvinces = (data) => {
    cityModalCities?.scrollTo(0, 0);
    cityModalList ? (cityModalList.innerHTML = "") : null;
    data.provinces.forEach((province) => {
      cityModalList?.insertAdjacentHTML(
        "beforeend",
        ` <li
            class="city-modal__cities-item province-item"
            data-province-id="${province.id}">
            <span>${province.name}</span>
            <i class="city-modal__cities-icon bi bi-chevron-left"></i>
          </li>`
      );
    });

    const provinceItems = document.querySelectorAll(".province-item");

    provinceItems.forEach((province) => {
      province.addEventListener("click", (e) => {
        const provinceID = e.target.dataset.provinceId;
        const provinceName = e.target.querySelector("span").innerHTML;

        cityModalList.innerHTML = "";

        cityModalList.insertAdjacentHTML(
          "beforeend",
          `
            <li id="city_modal_all_province" class="city_modal_all_province">
              <span>همه شهر ها</span>
              <i class="bi bi-arrow-right-short"></i>
            </li>
            <li class="city-modal__cities-item select-all-city city-item">
              <span>همه شهر های ${provinceName} </span>
              <div id="checkboxShape"></div>
              <input type="checkbox" />
            </li>
          `
        );

        const provinceCities = data.cities.filter(
          (city) => city.province_id === Number(provinceID)
        );

        provinceCities.forEach((city) => {
          const isSelect = selectedCities.some(
            (selectedCity) => selectedCity.title === city.name
          );

          cityModalList.insertAdjacentHTML(
            "beforeend",
            `<li class="city-modal__cities-item city-item" id="city-${city.id}">
                <span>${city.name}</span>
                <div id="checkboxShape" class="${isSelect && "active"}"></div>
                <input onchange="cityItemClickHandler('${
                  city.id
                }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}"/>
              </li>`
          );
        });
        // console.log(provinceCities);
        const cityModalAllProvinces = document.querySelector(
          "#city_modal_all_province"
        );
        cityModalAllProvinces.addEventListener("click", () => {
          cityModalList.innerHTML = "";
          showProvinces(data);
        });
      });
    });
  };

  window.cityItemClickHandler = (cityID) => {
    const cityElement = document.querySelector(`#city-${cityID}`);
    const checkBox = cityElement.querySelector("input");
    const cityTitle = cityElement.querySelector("span").innerHTML;
    const checkboxShape = cityElement.querySelector("div");

    selectedCities.forEach((city) => {
      if (city.title === cityTitle) {
        checkBox.checked = true;
        checkboxShape.classList.add("active");
      }
    });

    checkBox.checked = !checkBox.checked;

    if (checkBox.checked) {
      updateSelectedCities(cityTitle, cityID);
      checkboxShape.classList.add("active");
    } else {
      selectedCities = selectedCities.filter(
        (city) => city.title !== cityTitle
      );
      checkBox.checked = true;
      checkboxShape.classList.remove("active");
      addCityToModal(selectedCities);
      toggleCityModalBtns(selectedCities);
    }
  };

  const toggleCityModalBtns = (cities) => {
    if (cities.length) {
      cityModalAcceptBtn.classList.replace(
        "city-modal__accept",
        "city-modal__accept--active"
      );

      deleteAllSelectedCities.style.display = "block";
      cityModalError.style.display = "none";
    } else {
      cityModalAcceptBtn.classList.replace(
        "city-modal__accept--active",
        "city-modal__accept"
      );

      deleteAllSelectedCities.style.display = "none";
      cityModalError.style.display = "block";
    }
  };

  const updateSelectedCities = (cityTitle, cityID) => {
    const isTitleRepeated = selectedCities.some(
      (city) => city.title === cityTitle
    );
    if (!isTitleRepeated) {
      selectedCities.push({ title: cityTitle, id: cityID });
      addCityToModal(selectedCities);
      toggleCityModalBtns(selectedCities);
    }
  };

  deleteAllSelectedCities?.addEventListener("click", () => {
    deSelectAllCitiesFromModal();
    selectedCities = [];
    addCityToModal(selectedCities);

    cityModalAcceptBtn.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept"
    );
    cityModalError.style.display = "block";
    deleteAllSelectedCities.style.display = "none";
  });

  const deSelectAllCitiesFromModal = () => {
    const cityElements = document.querySelectorAll(".city-item");
    cityElements.forEach((city) => {
      const checkBox = city.querySelector("input");
      const checkboxShape = city.querySelector("div");

      checkBox.checked = true;
      checkboxShape.classList.remove("active");
    });
  };

  globalSearchInput?.addEventListener("click", () => {
    showModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active"
    );
  });

  searchbarModalOverlay?.addEventListener("click", () => {
    hideModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active"
    );
  });

  cityModalAcceptBtn?.addEventListener("click", () => {
    saveInLocalStorage("cities", selectedCities);
    const citiesIDs = selectedCities.map((city) => city.id).join("|");
    addParamToUrl("cities", citiesIDs);
    getAndShowCityLocation();
    hideModal("city-modal", "city-modal--active");
    showProvinces(allCities);
  });

  cityModalCloseBtn?.addEventListener("click", () => {
    hideModal("city-modal", "city-modal--active");
    cityModalAcceptBtn.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept"
    );
    showProvinces(allCities);
  });

  cityModalOverlay?.addEventListener("click", () => {
    hideModal("city-modal", "city-modal--active");
    cityModalAcceptBtn.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept"
    );
    showProvinces(allCities);
  });

  cityModalSearchInput?.addEventListener("keyup", (e) => {
    console.log(e.target.value);
    const filteredCities = allCities.cities.filter((city) =>
      city.name.includes(e.target.value)
    );

    if (e.target.value.trim() && filteredCities.length) {
      cityModalList.innerHTML = "";
      filteredCities.forEach((city) => {
        const isSelect = selectedCities.some(
          (selectedCity) => selectedCity.title === city.name
        );
        cityModalList.insertAdjacentHTML(
          "beforeend",
          `<li class="city-modal__cities-item city-item" id="city-${city.id}">
                <span>${city.name}</span>
                <div id="checkboxShape" class="${isSelect && "active"}"></div>
                <input onchange="cityItemClickHandler('${
                  city.id
                }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}">
              </li>`
        );
      });
    } else {
      cityModalList.innerHTML = "";
      showProvinces(allCities);
    }
  });

  submitPhoneNumberBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    submitNumber();
  });

  loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    verifyOtp();
  });

  reqNewCodeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    requestNewOtp();
  });

  headerCategoryBtn?.addEventListener("click", () => {
    showModal("header__category-menu", "header__category-menu--active");
  });

  categoryModalOverlay?.addEventListener("click", () => {
    hideModal("header__category-menu", "header__category-menu--active");
  });

  headerCategoryMenuBtn?.addEventListener("click", () => {
    removeParamFromUrl("categoryID");
  });

  loginModalCloseIcon?.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
  });

  loginModalOverlay?.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
  });

  createPostBtn?.addEventListener("click", () => {
    if (isUserLogin) {
      location.href = "/pages/new.html";
    } else {
      showModal("login-modal", "login-modal--active");
      hideModal("header__category-menu", "header__category-menu--active");
    }
  });
});
