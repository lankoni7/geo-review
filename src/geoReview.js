import InteractiveMap from "./interactiveMap";
import LocalStorage from "./localStorage";

export default class GeoReview {
  constructor() {
    this.template = document.querySelector("#addFormTemplate").innerHTML;
    this.map = new InteractiveMap("map", this.onClick.bind(this));
    this.storage = new LocalStorage();
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await this.callApi("coords");

    if (Object.keys(coords).length > 0) {
      for (const coord of Object.keys(coords)) {
        this.map.createPlacemark(JSON.parse(coord));
      }
    }

    document.body.addEventListener("click", this.onDocumentClick.bind(this));
  }

  callApi(method, body = {}) {
    if (method === "coords") {
      return this.storage.getCoords();
    } else if (method === "add") {
      return this.storage.addReview(body);
    } else if (method === "list") {
      return this.storage.getList(body);
    }
  }

  createForm(coords, reviews) {
    const root = document.createElement("div");
    root.classList.add("balloon");
    root.innerHTML = this.template;
    const reviewList = root.querySelector(".review-list");
    const reviewForm = root.querySelector(".review");
    reviewForm.dataset.coords = JSON.stringify(coords);

    if (reviews) {
      for (const item of reviews) {
        const review = document.createElement("div");
        review.classList.add("review-item");
        review.innerHTML = `
        <div><b>${item.name}</b> [${item.place}]</div>
        <div>${item.text}</div>
        `;
        reviewList.appendChild(review);
      }
    }
    return root;
  }

  async onClick(coords) {
    this.map.openBalloon(coords, "Загрузка...");
    const list = await this.callApi("list", JSON.stringify(coords));
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }

  async onDocumentClick(e) {
    if (e.target.tagName === "BUTTON") {
      const reviewForm = document.querySelector(".review");
      const coords = JSON.parse(reviewForm.dataset.coords);

      const data = {
        coords: JSON.stringify(coords),
        review: {
          name: document.getElementById("input-name").value,
          place: document.getElementById("input-place").value,
          text: document.getElementById("input-text").value,
        },
      };

      try {
        await this.callApi("add", data);
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (error) {
        const formError = document.querySelector(".form-error");
        formError.innerText = error.message;
      }
    }
  }
}
