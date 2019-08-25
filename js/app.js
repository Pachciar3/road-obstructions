const voivodeships = [{
    name: "Wszystkie",
    slug_name: "all"
  },
  {
    name: "Mazowieckie",
    slug_name: "mazowieckie"
  },
  {
    name: "Łódzkie",
    slug_name: "lodzkie"
  },
  {
    name: "Dolnośląskie",
    slug_name: "dolnoslaskie"
  },
  {
    name: "Kujawsko-pomorskie",
    slug_name: "kujawsko-pomorskie"
  },
  {
    name: "Lubelskie",
    slug_name: "lubelskie"
  },
  {
    name: "Lubuskie",
    slug_name: "lubuskie"
  },
  {
    name: "Małopolskie",
    slug_name: "malopolskie"
  },
  {
    name: "Opolskie",
    slug_name: "opolskie"
  },
  {
    name: "Podkarpackie",
    slug_name: "podkarpackie"
  },
  {
    name: "Podlaskie",
    slug_name: "podlaskie"
  },
  {
    name: "Pomorskie",
    slug_name: "pomorskie"
  },
  {
    name: "Śląskie",
    slug_name: "slaskie"
  },
  {
    name: "Świętokrzyskie",
    slug_name: "swietokrzyskie"
  },
  {
    name: "Warmińsko-mazurskie",
    slug_name: "warminsko-mazurskie"
  },
  {
    name: "Wielkopolskie",
    slug_name: "wielkopolskie"
  },
  {
    name: "Zachodniopomorskie",
    slug_name: "zachodniopomorskie"
  }
];

const choosedSearchData = {
  type: "VOIVODESHIP",
  voivodeship: "wszystkie",
  query: "",
  roadName: false,
  searchedRoad: false
}
const GDDKIA_LINK = "https://www.gddkia.gov.pl/";
// const RSO_LINK = "http://komunikaty.tvp.pl/"; Support for RSO database is not finished

//HANDLE DATABASE TYPE
// const options = document.querySelectorAll(".sort .sort__btn");
// options.forEach(option => {
//   option.addEventListener("click", () => {
//     option.classList.toggle("active");
//     choosedSearchData[option.dataset.name] = !choosedSearchData[option.dataset.name];
//   });
// });

// const toggleDisableDatabaseType = (name, type) => {
//   const element = document.querySelector(`.sort .sort__btn[data-name="${name}"]`)
//   if (type) {
//     element.classList.remove("disable");
//     element.disabled = false;
//   } else {
//     element.classList.add("disable");
//     element.disabled = true;
//   }

// }

const searchInput = document.getElementById("search_input");
const searchLabel = document.getElementById("search_label");
const searchForm = document.getElementById("search_form");
const searchPhraseBtn = document.getElementById("search_phrase_btn");
const searchWithoutPhraseBtn = document.getElementById("search_without_phrase_btn");
const closeFormBtn = document.getElementById("close_results");
searchInput.addEventListener("focus", () => {
  searchRoads(choosedSearchData.voivodeship, choosedSearchData.searchedRoad);
  if (window.innerWidth < 726) {
    searchForm.classList.add("mobile-active");
  } else {
    searchForm.classList.add("desktop-active");
  }
});

//CLOSE FORM FUNCTION
closeForm = () => {
  searchForm.classList.remove("mobile-active");
  searchForm.classList.remove("desktop-active");
}
closeFormBtn.addEventListener("click", e => {
  e.preventDefault();
  closeForm();
});

//HANDLE CHOOSED ROAD
const choosedRoad = document.getElementById("choosed-road");
const handleViewChoosedRoad = () => {
  if (choosedSearchData.type === "ROAD_NAME" && choosedSearchData.roadName) {
    choosedRoad.classList.remove("is-hide");
    choosedRoad.innerText = choosedSearchData.roadName;
  } else {
    choosedRoad.classList.add("is-hide");
  }
}

//GENERATE ROAD DOM ELEMENT
const searchRoadsContainer = document.getElementById("search_roads_container");
const generateRoad = (name) => {
  const li = document.createElement("li");
  li.className = "search-result__item";
  const roadButton = document.createElement("button");
  roadButton.className = "btn btn--100 btn--road";
  roadButton.dataset.road_name = name;
  roadButton.innerText = name;
  roadButton.addEventListener("click", e => {
    e.preventDefault();
    choosedSearchData.type = "ROAD_NAME";
    choosedSearchData.roadName = e.target.dataset.road_name;
    searchDataFunction(choosedSearchData.type, [choosedSearchData.voivodeship, choosedSearchData.roadName]);
    closeForm();
    handleViewChoosedRoad();
  });
  li.appendChild(roadButton);
  searchRoadsContainer.appendChild(li);
}

//SEARCHING ROADS FROM DATABASE
const searchRoads = (voivodeship, name) => {
  const roadName = name ? `&q=${name}` : "";
  searchRoadsContainer.innerHTML = "<div class='loader'></div>";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `cat_gddkia.php?voi=${voivodeship}${roadName}`, true);

  xhr.addEventListener("load", function () {
    if (this.status === 200) {
      const parseresponse = JSON.parse(this.responseText);
      searchRoadsContainer.innerHTML = "";
      const items = parseresponse.road_names
      if (items.length) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          generateRoad(item);
        }
      } else {
        searchRoadsContainer.innerHTML = '<li class="search-result__item search-result__item--info">Taka droga nie istnieje, lub brak utrudnień na wybranej drodze :-)</li>';
      }
    } else {
      searchRoadsContainer.innerHTML = '<li class="search-result__item search-result__item--error">Wystąpił błąd połączenia ;-(</li>';
      console.log("Wystąpił błąd: " + this.status);
    }
  });

  xhr.addEventListener("error", function (e) {
    searchRoadsContainer.innerHTML = '<li class="search-result__item search-result__item--error">Wystąpił błąd połączenia ;-(</li>';
  });

  xhr.send();
}

//SEARCH INPUT EVENT LISTENER
searchInput.addEventListener("input", () => {
  const value = searchInput.value;
  //If value is empty "search with phrase button" is DISABLED 
  if (value) {
    searchLabel.classList.add("is-hide");
    searchPhraseBtn.classList.remove("disable");
    searchPhraseBtn.disabled = false;
  } else {
    searchLabel.classList.remove("is-hide");
    searchPhraseBtn.classList.add("disable");
    searchPhraseBtn.disabled = true;
  }
  searchPhraseBtn.innerText = `Szukaj po frazie: ${value}`;
  choosedSearchData.query = value;
  choosedSearchData.searchedRoad = value;
  searchRoads(choosedSearchData.voivodeship, choosedSearchData.searchedRoad);
});

//HANDLE AFTER CLICKING ENETR
searchInput.addEventListener("keyup", e => {
  e.preventDefault();
  console.log(e);
  if (e.keyCode === 13 && choosedSearchData.type === "QUERY") {
    searchDataFunction(choosedSearchData.type, [choosedSearchData.voivodeship, choosedSearchData.query]);
    closeForm();
  }
})

//HANDLE CLICK SEARCH WITH PHRASE BUTTON
searchPhraseBtn.addEventListener("click", e => {
  e.preventDefault();
  if (choosedSearchData.query) {
    closeForm();
    choosedSearchData.type = "QUERY";
    choosedSearchData.roadName = "";
    handleViewChoosedRoad();
    searchDataFunction(choosedSearchData.type, [choosedSearchData.voivodeship, choosedSearchData.query]);
  }
});

//HANDLE CLICK SEARCH WITHOUT PHRASE BUTTON
searchWithoutPhraseBtn.addEventListener("click", e => {
  e.preventDefault();
  closeForm();
  choosedSearchData.query = "";
  searchInput.value = "";
  searchLabel.classList.remove("is-hide");
  searchPhraseBtn.classList.add("disable");
  searchPhraseBtn.disabled = true;
  searchPhraseBtn.innerText = `Szukaj po frazie:`;
  choosedSearchData.roadName = "";
  choosedSearchData.searchedRoad = "";
  choosedSearchData.type = "VOIVODESHIP";
  handleViewChoosedRoad();
  searchDataFunction(choosedSearchData.type, choosedSearchData.voivodeship);
});

//VOIVODESHIPS DROPODOWN-CHOOSE
const voivodeshipBtn = document.getElementById("voivodeship-btn");
const voivodeshipBtnTxt = voivodeshipBtn.querySelector(
  ".dropdown-choose__btn-txt"
);
const voivodeshipIco = voivodeshipBtn.querySelector(
  ".dropdown-choose__btn-ico"
);
const voivodeshipList = document.getElementById("voivodeship-list");
const voivodeshipItems = voivodeshipList.querySelectorAll(
  ".dropdown-choose__btn"
);
let activeItemSlugName = "all";
const toggleBtn = () => {
  voivodeshipIco.classList.toggle("rotate");
  voivodeshipList.classList.toggle("is-hide");
};
voivodeshipBtn.addEventListener("click", e => {
  e.preventDefault();
  toggleBtn();
});
voivodeshipItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    voivodeshipItems.forEach(item => {
      item.classList.remove("is-active");
    });
    item.classList.add("is-active");
    let chosseItem;
    for (let i = 0; i < voivodeships.length; i++) {
      if (voivodeships[i].slug_name === e.target.dataset.value) {
        chosseItem = i;
        break;
      }
    }
    voivodeshipBtnTxt.innerHTML = voivodeships[chosseItem].name;
    choosedSearchData.voivodeship = voivodeships[chosseItem].name.toLowerCase();
    searchRoads(choosedSearchData.voivodeship, choosedSearchData.searchedRoad);
    if (choosedSearchData.type === "VOIVODESHIP") {
      searchDataFunction(choosedSearchData.type, choosedSearchData.voivodeship);
    } else if (choosedSearchData.type === "QUERY") {
      searchDataFunction(choosedSearchData.type, [choosedSearchData.voivodeship, choosedSearchData.query]);
    } else if (choosedSearchData.type === "ROAD_NAME") {
      searchDataFunction(choosedSearchData.type, [choosedSearchData.voivodeship, choosedSearchData.roadName]);
    }
    toggleBtn();
  });
});

// GENERATE OBSTRUCTION DOM ELEMENT
const resultsContainer = document.getElementById("results");
const generateObstruction = (
  dataOwner,
  title,
  localization,
  roadName = false,
  km = false,
  length = false,
  desc,
  startDay,
  endDay,
  updateDate = false
) => {
  const obstruction = document.createElement("div");
  obstruction.className = "obstruction obstruction--secondary";
  const updateDateHTML = updateDate ? `Zaktualizowano: <strong>${updateDate}</strong>` : "";
  let moreInfoHTML = "";
  let link = "";
  if (dataOwner === "GDDKiA") {
    moreInfoHTML = `
      <span class="obstruction__road-name">${roadName}</span>
      <ul class="obstruction__info-items">
        <li class="obstruction__info-item">
          <span class="obstruction__info-ico">KM:</span>
          <span class="obstruction__info-text">${km}</span>
        </li>
        <li class="obstruction__info-item">
          <span class="obstruction__info-ico">DŁ:</span>
          <span class="obstruction__info-text">${length}</span>
        </li>
      </ul>
    `;
    link = GDDKIA_LINK;
  }
  obstruction.innerHTML = `
<header class="obstruction__head">
  <h3 class="obstruction__main-title">${title}</h3>
  <div class="obstruction__localization">${localization}</div>
</header>
<div class="obstruction__more-info">
  ${moreInfoHTML}
</div>
<p class="obstruction__description">${desc}</p>
<div class="obstruction__scope">
  Obowiązuje od: ${startDay} do: ${endDay}
</div>
<footer class="obstruction__footer">
  <div class="obstruction__update-date">${updateDateHTML}</div>
  <div class="obstruction__data-owner" >Dane z: <a href="${GDDKIA_LINK}">${dataOwner}</a></div>
</footer>
`;
  resultsContainer.appendChild(obstruction);
};

// SEARCH OBSTRUCTIONS FROM DATABASE
const searchDataFunction = (type, searchData) => {
  let query;
  if (type === "QUERY") {
    query = `voi=${searchData[0]}&q=${searchData[1]}`;
  } else if (type === "ROAD_NAME") {
    query = `voi=${searchData[0]}&name=${searchData[1]}`;
  } else if (type === "ID") {
    query = `id=${searchData}`;
  } else if (type === "VOIVODESHIP") {
    query = `voi=${searchData}`;
  }
  resultsContainer.innerHTML = "<div class='loader'></div>";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `gddkia.php?${query}`, true);

  xhr.addEventListener("load", function () {
    if (this.status === 200) {
      const parseresponse = JSON.parse(this.responseText);
      // console.log(parseresponse.obstructions);
      items = parseresponse.obstructions;
      resultsContainer.innerHTML = "";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const startDay = new Date(item.start_day).toLocaleString("pl-PL");
        const endDay = new Date(item.end_day).toLocaleString("pl-PL");
        generateObstruction(
          "GDDKiA",
          item.road_name,
          item.voivodeship,
          item.name,
          item.road_km,
          item.length,
          item.road_detour,
          startDay,
          endDay
        );
      }
    } else {
      resultsContainer.innerHTML = "<div class='results__error'>Wystąpił błąd połączenia ;-(</div>";
      console.log("Wystąpił błąd: " + this.status);
    }
  });

  xhr.addEventListener("error", function (e) {
    console.log("Wystąpił błąd połączenia");
    resultsContainer.innerHTML = "<div class='results__error'>Wystąpił błąd połączenia ;-(</div>";
  });

  xhr.send();
}
searchDataFunction(choosedSearchData.type, choosedSearchData.voivodeship);