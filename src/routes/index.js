const express = require("express");
const router = express.Router();
const { validator, bodyValidator, schemas } = require("../middlewares");
const controller = require("../controllers");

router.get("/api/search", validator(schemas.searchSchema), controller.search);
router.get(
  "/api/playlist",
  validator(schemas.idSchema),
  controller.getDetailPlaylist
);
router.get(
  "/api/artist",
  validator(schemas.artistSchema),
  controller.getDetailArtist
);
router.get("/api/song", validator(schemas.idSchema), controller.getInfoMusic);

router.post(
  "/api/download",
  bodyValidator(schemas.downloadSchema),
  controller.download
);

router.get("/api/home", controller.getHome);
router.get("/api/chart-home", controller.getChartHome);
router.get("/api/week-chart", controller.getWeekChart);
// router.get("/api/top100", controller.getTop100);

module.exports = router;
