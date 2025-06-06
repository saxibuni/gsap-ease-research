// @ts-nocheck

let _easeMap: { [key: string]: any } = {};

let _bigNum = 1e8,
  _tinyNum = 1 / _bigNum,
  _2PI = Math.PI * 2,
  _HALF_PI = _2PI / 4,
  _sqrt = Math.sqrt,
  _cos = Math.cos,
  _sin = Math.sin;

function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
}

function _insertEase(names, easeIn, easeOut?, easeInOut?) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  let ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
    lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (let p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
}

function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
}

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  let power = i < 5 ? i + 1 : i;
  console.log(power, i)

  _insertEase(name + ",Power" + (power - 1),

    // in
    i ? function (p) {
      return Math.pow(p, power);
    } : function (p) {
      return p;
    },
    // out
    function (p) {
      return 1 - Math.pow(1 - p, power);
    },

    // inOut
    function (p) {
      return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;


function _configElastic(type?, amplitude?, period?) {
  let p1 = amplitude >= 1 ? amplitude : 1,
    p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
    p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
    easeOut = function easeOut(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    },
    ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2;

  // @ts-expect-error
  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
}

function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
}

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  let n1 = 1 / c,
    n2 = 2 * n1,
    n3 = 2.5 * n1,
    easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
    };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());


function _configBack(type?, overshoot?) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  let easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
    ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

  // @ts-expect-error
  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
};

_easeMap.SteppedEase = _easeMap.steps = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    let p1 = 1 / steps,
      p2 = steps + (immediateStart ? 0 : 1),
      p3 = immediateStart ? 1 : 0,
      max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};


let Power0 = _easeMap.Power0,
  Power1 = _easeMap.Power1,
  Power2 = _easeMap.Power2,
  Power3 = _easeMap.Power3,
  Power4 = _easeMap.Power4,
  Linear = _easeMap.Linear,
  Quad = _easeMap.Quad,
  Cubic = _easeMap.Cubic,
  Quart = _easeMap.Quart,
  Quint = _easeMap.Quint,
  Strong = _easeMap.Strong,
  Elastic = _easeMap.Elastic,
  Back = _easeMap.Back,
  SteppedEase = _easeMap.SteppedEase,
  Bounce = _easeMap.Bounce,
  Sine = _easeMap.Sine,
  Expo = _easeMap.Expo,
  Circ = _easeMap.Circ;
export { Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ };
console.log(_easeMap)