(function injectScripts() {
  injectStyle(
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  );
  injectStyle("https://fonts.googleapis.com/icon?family=Material+Icons");
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
