MathJax.Hub.Config({
  jax: ["input/TeX", "output/SVG"],
  extensions: ["tex2jax.js"],
  messageStyle: "none",
  showMathMenu: false,
  skipStartupTypeset: true,
  tex2jax: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    preview: "none"
  },
  TeX: {
    extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
  },
  SVG: {
    font: "STIX-Web"
  }
});
MathJax.Ajax.loadComplete("[MathJax]/config/electron.js");
