(function injectScripts() {
  injectStyle(
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  );
  injectStyle(
    "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  );
  injectStyle(
    "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.1/css/all.min.css"
  );
})();

function injectStyle(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  document.head.insertBefore(link, document.head.firstChild);
}

function injectScript(src) {
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}
