const constants = require('./constants');

module.exports = function(el) {

  const map = new Map(
    Object.values(constants).map((symbol) => [symbol, []])
  );

  const on = function(event, fn) {


    if (typeof fn == 'function') {

      map.get(event).push(fn);
    }

    return el;
  };

  const off = function(event, fn) {

    if (fn) {

      const arr = map.get(event);
      const idx = arr.indexOf(fn);

      arr.splice(idx, 1);
    }
    else {

      map.delete(event);
    }

    return el;
  };

  const one = function(event, fn) {


    function _on() {

      off(event, _on);
      fn.apply(el, arguments);
    }

    return on(event, _on);
  };

  const trigger = function() {

    const args = Array.from(arguments);
    const event = args.shift();

    const arr = map.get(event) || [];

    for (const fn of arr) {

      fn.apply(fn, args);
    }

    return el;
  };

  return { on, one, off, trigger };
};
