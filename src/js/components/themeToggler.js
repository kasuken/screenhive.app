export default class themeTogglerClass {
  constructor() {
    if (!themeTogglerClass.instance) {
      this.set = {
        toggler: document.querySelector(".sh__toggler"),
        icons: document.querySelectorAll(".sh__toggler--icon"),
        moon: document.querySelector(".sh__toggler-btn--moon"),
        sun: document.querySelector(".sh__toggler-btn--sun"),
      };
      themeTogglerClass.instance = this;
    }
    return themeTogglerClass.instance;
  }

  getPreferredTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)")) {
      this.set.sun.classList.toggle("active");
    } else this.set.moon.classList.toggle("active");
  }

  init() {
    this.getPreferredTheme();

    this.set.toggler.addEventListener("click", () => {
      if (document.body.dataset.theme) {
        if (document.body.dataset.theme === "light") {
          document.body.dataset.theme = "dark";
          this.set.moon.classList.toggle("active");
          this.set.sun.classList.toggle("active");
        } else {
          document.body.dataset.theme = "light";
          this.set.sun.classList.toggle("active");
          this.set.moon.classList.toggle("active");
        }
      }
    });
  }
}
