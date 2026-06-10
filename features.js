(function () {
  'use strict';
  // FXe brand colors — always applied, no theme picker
  var FXe_VARS = {
    '--navy':       '#0B1C2C',
    '--navy-mid':   '#0C3B4F',
    '--navy-light': '#0C3B4F',
    '--aqua':       '#12B5CC',
    '--aqua-light': '#2DC8DE',
    '--aqua-pale':  '#E6F9FC',
    '--gold':       '#C4881A',
    '--gold-lt':    '#D9A040'
  };
  Object.keys(FXe_VARS).forEach(function(v) {
    document.documentElement.style.setProperty(v, FXe_VARS[v]);
  });
})();
