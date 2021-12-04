export default class InteractiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }

  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsSctipt = document.createElement("script");
      ymapsSctipt.src =
        "https://api-maps.yandex.ru/2.1/?apikey=1301863d-4888-4edf-8854-f82fcc8de44e&lang=ru_RU";
      document.body.appendChild(ymapsSctipt);
      ymapsSctipt.addEventListener("load", resolve);
    });
  }

  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  initMap() {
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
      maxZoom: 150,
    });
    this.clusterer.events.add("click", (e) => {
      const coords = e.get("target").geometry.getCoordinates();
      this.onClick(coords);
    });
    this.map = new ymaps.Map(this.mapId, {
      center: [59.918072, 30.304908],
      zoom: 10,
    });
    this.map.events.add("click", (e) => this.onClick(e.get("coords")));
    this.map.geoObjects.add(this.clusterer);
  }

  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }

  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }

  closeBalloon() {
    this.map.balloon.close();
  }

  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add("click", (e) => {
      const coords = e.get("target").geometry.getCoordinates();
      this.onClick(coords);
    });
    this.clusterer.add(placemark);
  }
}
