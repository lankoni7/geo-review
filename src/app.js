import { fn } from "./new.js";
import "./index.html";
import "./styles/main.scss";

ymaps.ready(init);
function init() {
  var myMap = new ymaps.Map("map", {
    center: [59.918072, 30.304908],
    zoom: 10,
  });
  const MyBalloon = ymaps.templateLayoutFactory.createClass(
    [
      '<div class="review">',
      '<h3 class="review__title">Отзыв:</h3>',
      '<input  type="text"   id="input-name"  class="review__input" placeholder="Укажите ваше имя" />',
      '<input  type="text"  id="input-place" class="review__input" placeholder="Укажите место"/>',
      '<textarea name="" id="input-text" class="review__input_text review__input" placeholder="Оставить отзыв"></textarea>',
      '<button id="button" class="button">Добавить</button>',
      "</div>",
    ].join("")
  );
  // myMap.behaviors.disable("scrollZoom");
  const obj = {};

  myMap.events.add("click", (e) => {
    const coordsArr = e.get("coords");
    obj.coords = coordsArr;
    // localStorage.setItem(coordsArr, "");

    const placemark = new ymaps.Placemark(
      coordsArr,
      {},
      { balloonContentLayout: MyBalloon, draggable: true }
    );
    myMap.geoObjects.add(placemark);
    placemark.balloon.open();

    const nameInput = document.getElementById("input-name");
    const placeInput = document.getElementById("input-place");
    const textInput = document.getElementById("input-text");
    const button = document.getElementById("button");

    console.log(button);

    button.addEventListener("click", () => {
      const name = nameInput.value;
      const place = placeInput.value;
      const text = textInput.value;
      obj.review = {
        name: name,
        place: place,
        text: text,
      };

      console.log(obj);
    });
    myMap.events.add("click", () => {
      myMap.geoObjects.remove(placemark);
    });
    placemark.balloon.events.add("userclose", () => {
      myMap.geoObjects.remove(placemark);
    });
  });
}
