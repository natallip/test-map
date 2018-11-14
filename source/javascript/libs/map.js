module.exports = (function () {
  const myMap = function () {
    const map = document.querySelector("#map");
    const counter = document.querySelector("#counter");
    const bar = document.querySelector("#bar");
    const points = bar.querySelectorAll(".item");
    const australia = map.querySelector("#australia");
    const oceania = map.querySelector("#oceania");
    const usa = map.querySelector("#usa");
    const europ = map.querySelector("#europ");
    const lamerica = map.querySelector("#lamerica");
    const africa = map.querySelector("#africa");
    const sng = map.querySelector("#sng");
    const asia = map.querySelector("#asia");
    let t;
    let arrCountres = [];
    arrCountres.push(usa);
    arrCountres.push(europ);
    arrCountres.push(sng);
    arrCountres.push(asia);
    arrCountres.push(africa);
    arrCountres.push(oceania);
    arrCountres.push(australia);
    arrCountres.push(lamerica);
    const iterations = arrCountres.length;

    const stop = function () {
      console.log('stop');
      clearTimeout(t);
      arrCountres.forEach(item => {
        item.classList.add("grey");
      });
      points.forEach(item => {
        item.querySelector(".item__line").classList.add("colorGrey");
        item.querySelector(".item__point").classList.add("colorGrey");
      });
      counter.innerText = "0";
    };

    const start = function () {
      stop();
      console.log('start');
      let i = 0;
      let go = function () {
        t = setTimeout(function init() {
          arrCountres[i].classList.remove("grey");
          points[i].querySelector(".item__line").classList.remove("colorGrey");
          points[i].querySelector(".item__point").classList.remove("colorGrey");
          counter.innerText = points[i].querySelector(".item__count").innerText;
          console.log('currentPointValue', getCurrentPointValue());
          if (i < iterations-1) setTimeout(init, 2500);
          i++
        }, 2500);
      };
      go();
      setTimeout(start, 25000);
    };

    const getCurrentPointValue = function () {
      return parseInt(counter.innerText);
    };
    return {
      start,
      stop,
      getCurrentPointValue
    }
  }();

  myMap.start();
  myMap.getCurrentPointValue();
})();