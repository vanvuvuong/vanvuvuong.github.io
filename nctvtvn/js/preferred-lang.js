(() => {
  // ns-hugo-params:<stdin>
  var stdin_default = { fallback: "http://localhost:1313/nctvtvn/", homes: { en: "http://localhost:1313/nctvtvn/" } };

  // <stdin>
  (() => {
    const lang = navigator.language || navigator.userLanguage;
    if (lang in stdin_default.homes) {
      window.location.href = stdin_default.homes[lang];
      return;
    }
    const codes = lang.split("-");
    for (let lang2 in stdin_default.homes) {
      if (lang2.indexOf(codes[0]) === 0) {
        window.location.href = stdin_default.homes[lang2];
        return;
      }
    }
    window.location.href = stdin_default.fallback;
  })();
})();
