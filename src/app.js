const body = document.body;
const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirm-email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const album = document.getElementById("album");

//FOR MENU
const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menu-item");
const headerButtons = document.querySelector(".header__buttons");
const headerClose = document.querySelector(".header-close");
const hamburger = document.querySelector(".hamburger");

let formValues = {};
const inputsArray = [
  firstName,
  lastName,
  doggoName,
  doggoBreed,
  email,
  confirmEmail,
  password,
  confirmPassword,
];

const successModal = document.getElementById("modal-success");
const errorModal = document.getElementById("modal-error");

initFormListeners(form);
initModals(successModal);
initModals(errorModal);
initCookieBanner();
populateDoggoBreedSelect();

function toggleMenu() {
  if (menu.classList.contains("openMenu")) {
    menu.classList.remove("openMenu");
    headerClose.style.display = "none";
    hamburger.style.display = "block";
  } else {
    menu.classList.add("openMenu");
    headerClose.style.display = "block";
    hamburger.style.display = "none";
  }
}
headerButtons.addEventListener("click", toggleMenu);

function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      // console.log("modal", formValues);

      //FIX 6: POST req for profile
      fetch("https://api.devnovatize.com/frontend-challenge", {
        method: "POST",
        body: JSON.stringify({ ...formValues }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (!res.ok) {
          console.log("Error calling external API. Status Code: " + res.status);
          // FIX 7: modal on error
          displayErrorModal();
          return;
        }

        // If status is OK 201, display success modal
        console.log("status", res.status);
        displaySuccessModal();
      });
    }
  });
}

// Changed arg name to modalToInit
function initModals(modalToInit) {
  let btnClassName =
    modalToInit.id === "modal-success"
      ? "btn-close-success"
      : "btn-close-error";
  let closeButtons = document.getElementsByClassName(`${btnClassName}`);

  for (let el of closeButtons) {
    el.onclick = function () {
      modalToInit.style.display = "none";
    };
  }

  window.onclick = function (event) {
    // console.log("init", successModalToInit);
    // console.log("target", event.target);
    if (event.target == successModal) {
      modalToInit.style.display = "none";
    }
  };
}

// FIX 5: created cookie fct
function initCookieBanner() {
  let cookieAccepted = false;

  // Get cookies from the document
  const cookieValue = document.cookie;
  const splitCookie = cookieValue.split("=") || [];

  // Map over to see if the cookie is accepted or not
  splitCookie.map((str, i) => {
    if (str === "accepted" && splitCookie[i + 1] === "true") {
      return (cookieAccepted = true);
    }
  });

  // If cookie === true, display banner to none and stop the fct
  if (cookieAccepted === true) {
    let cookieBanner = document.getElementById("cookie-banner");
    cookieBanner.style.display = "none";
    return;
  }

  let acceptCookiesButton = document.querySelector(
    "#cookie-banner .button__primary"
  );
  acceptCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");

    document.cookie =
      "accepted=true; expires=" + new Date(3000, 0, 1).toUTCString();
    cookieBanner.style.display = "none";
  };

  let rejectCookiesButton = document.querySelector(
    "#cookie-banner .button__secondary"
  );
  rejectCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");
    let submitButton = document.querySelector("form button");

    submitButton.disabled = true;
    cookieBanner.style.display = "none";
  };
}

function populateDoggoBreedSelect() {
  fetch("https://api.devnovatize.com/frontend-challenge")
    .then(function (response) {
      if (!response.ok) {
        console.log(
          "Error calling external API. Status Code: " + response.status
        );
        return;
      }

      response.json().then(function (data) {
        var selectElem = document.getElementById("doggo-breed");
        // console.log("first", data);

        //FIX 4: Added sort function for alphabetical order
        fillSelectElem(selectElem, data.sort());
      });
    })
    .catch(function (err) {
      console.log("Fetch Error : ", err);
    });
}

function fillSelectElem(selectElem, dataToFill) {
  dataToFill.forEach((element) => {
    var optionElem = document.createElement("option");
    optionElem.innerHTML = element;

    if (element.toLowerCase() === "labernese") {
      optionElem.setAttribute("selected", "selected");
    }
    selectElem.appendChild(optionElem);
  });
}

function validateAllInputs() {
  // console.log("first", inputsArray[0].parentElement.parentElement); check if it's the same call as setErrorInput
  //FIX 1: Added a clean up for error class
  inputsArray.forEach((input) => {
    input.parentElement.parentElement.classList.remove("error");
  });

  let allInputValids =
    validateInput(firstName) &&
    validateInput(lastName) &&
    validateInput(doggoName) &&
    validateInput(doggoBreed) &&
    validateInput(email, validateEmail) &&
    validateInput(confirmEmail, function (value) {
      return value === email.value.trim();
    }) &&
    validateInput(password, validatePassword) &&
    validateInput(confirmPassword, function (value) {
      return value === password.value.trim();
    });

  if (allInputValids) {
    inputsArray.forEach((input) => {
      // console.log(input.id, input.value);
      formValues[`${input.id}`] = input.value;
    });
  }

  return allInputValids;
}

function validateInput(element, validationFunction) {
  let inputValid = isInputValid(element, validationFunction);

  inputValid ? setSuccessInput(element) : setErrorInput(element);

  return inputValid;
}

function isInputValid(element, validationFunction) {
  let value = element.value.trim();

  return !(value === "" || (validationFunction && !validationFunction(value)));
}

//FIX 3: Added email validation
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // 8 chars, lower, upper and digits
  return re.test(String(password));
}

function setErrorInput(input) {
  const formControl = input.parentElement.parentElement;
  // console.log("input", formControl); check if it loops throught everything
  formControl.classList.add("error");
}

function setSuccessInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.add("success");
}

function displaySuccessModal() {
  var modal = document.getElementById("modal-success");
  modal.style.display = "block";
}

function displayErrorModal() {
  var modal = document.getElementById("modal-error");
  modal.style.display = "block";
}
