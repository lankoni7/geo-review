export default class LocalStorage {
  constructor() {
    this.localStorage = window.localStorage;
  }

  getCoords() {
    return JSON.parse(this.localStorage.getItem("coords")) || {};
  }
  async getList(coords) {
    let coordsObj = await this.getCoords();
    if (Object.keys(coordsObj).includes(coords)) {
      return coordsObj[coords];
    }
  }

  addReview(data) {
    let coordsObj = this.getCoords();
    let newCoordsObj = {};
    if (Object.keys(coordsObj).includes(data.coords)) {
      newCoordsObj = {
        ...coordsObj,
        [data.coords]: [...coordsObj[data.coords], data.review],
      };
    } else {
      newCoordsObj = {
        ...coordsObj,
        [data.coords]: [data.review],
      };
    }
    this.localStorage.setItem("coords", JSON.stringify(newCoordsObj));
    return {};
  }
}
