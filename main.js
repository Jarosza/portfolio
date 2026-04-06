const themeBtn = document.querySelector(".theme__btn");

const navMenu = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section, header");

// 1. Funkcja usuwająca klasę active
const removeActiveClass = () => {
  navMenu.forEach((item) => item.classList.remove("active"));
};

// 2. Obsługa kliknięcia (manualna zmiana)
navMenu.forEach((item) => {
  item.addEventListener("click", () => {
    removeActiveClass();
    item.classList.add("active");
  });
});

// 3. INTERSECTION OBSERVER - Automatyczne podświetlanie przy skrolowaniu
const observerOptions = {
  root: null,
  threshold: 0, // Sekcja jest aktywna, gdy widać 50% jej powierzchni
  rootMargin: "10% 0px -70% 0px", // Poprawia czułość na urządzeniach mobilnych
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      // Jeśli sekcja nie ma ID (jak header), sprawdzamy href="#"
      const targetHref = id ? `#${id}` : "#";

      const activeLink = document.querySelector(`nav a[href="${targetHref}"]`);

      if (activeLink) {
        removeActiveClass();
        activeLink.classList.add("active");
      }
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

// A HELP FUNCTION FOR CHANGING ICONS
const updateIcon = () => {
  if (document.body.classList.contains("dark")) {
    themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
  }
};

// AMENDMENT AND STATEMENT OF REASONS
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("portfolio__theme", "dark");
  } else {
    localStorage.setItem("portfolio__theme", "");
  }

  updateIcon(); // Update the icon immediately after clicking
});

// DOWNLOADING FROM LOCAL STORAGE ON STARTUP //
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("portfolio__theme") || "";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  updateIcon();
});

//Contact form //
const form = document.getElementById("contact-form");

async function handleSubmit(event) {
  event.preventDefault(); // Blokujemy przeładowanie strony
  const status = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");
  const data = new FormData(event.target);

  // Zmieniamy stan przycisku na czas wysyłki
  btn.disabled = true;
  btn.innerText = "Sending...";

  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        status.innerHTML = "Thank you! Your message has been sent.";
        status.style.color = "green";
        form.reset(); // Czyścimy pola formularza
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            status.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML = "Ups! Wystąpił problem przy wysyłce.";
          }
          status.style.color = "red";
        });
      }
    })
    .catch((error) => {
      status.innerHTML = "Ups! Wystąpił błąd połączenia.";
      status.style.color = "red";
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Submit";
    });
}

form.addEventListener("submit", handleSubmit);
