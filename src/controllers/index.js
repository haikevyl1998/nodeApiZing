const ZingMp3 = require("../helper/zingmp3-api");

const search = async (req, res, next) => {
  try {
    const { searchValue } = req.value;
    const response = await ZingMp3.search(searchValue);

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Server error!");
  } catch (e) {
    return next(e);
  }
};

const getDetailPlaylist = async (req, res, next) => {
  try {
    const { id } = req.value;

    const response = await ZingMp3.getDetailPlaylist(id);

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }
    throw new Error("server error!");
  } catch (e) {
    next(e);
  }
};

const getInfoMusic = async (req, res, next) => {
  try {
    const { id } = req.value;
    const response = await ZingMp3.getInfoMusic(id);

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }
    throw new Error("server error!");
  } catch (e) {
    next(e);
  }
};

const getDetailArtist = async (req, res, next) => {
  try {
    const { alias } = req.value;

    const response = await ZingMp3.getDetailArtist(alias);

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("server error!");
  } catch (e) {
    next(e);
  }
};

const download = async (req, res, next) => {
  try {
    const { id, type, query } = req.value;

    if (type === "song" && query === "128") {
      const response = await ZingMp3.getStreaming(id);
      if (response) {
        return res.json({
          success: true,
          data: response,
        });
      }

      throw new Error("server error!");
    }

    if (type === "song" && query === "320") {
      const response = await ZingMp3.getStreaming320(id);
      if (response) {
        return res.json({
          success: true,
          data: response,
        });
      }

      throw new Error("server error!");
    }

    if (type == "playlist") {
      const response = await ZingMp3.getDetailPlaylist(id);

      const songList = response.song.items;

      if (query === "128") {
        try {
          let result = [];
          for (let i = 0; i < songList.length; i++) {
            let tempLink = await ZingMp3.getStreaming(songList[i].encodeId);

            if (tempLink) {
              let temp = {
                title: songList[i].title,
                artistsNames: songList[i].artistsNames,
                link: tempLink["128"],
              };
              result.push(temp);
            }
          }
          console.log(result.length);

          return res.json({
            success: true,
            data: result,
          });
        } catch (e) {
          console.log(e);
          next(e);
        }
      }

      if (query === "320") {
        let result = [];
        for (let i = 0; i < songList.length; i++) {
          let temp = {
            title: songList[i].title,
            artistsNames: songList[i].artistsNames,
            link: await ZingMp3.getStreaming320(
              songList[i].encodeId,
              songList[i].title
            ),
          };
          result.push(temp);
        }

        return res.json({
          success: true,
          data: result,
        });
      }
    }
  } catch (e) {
    next(e);
  }
};

const getHome = async (req, res, next) => {
  try {
    const response = await ZingMp3.getHome();

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Server error!");
  } catch (e) {
    next(e);
  }
};

const getChartHome = async (req, res, next) => {
  try {
    const response = await ZingMp3.getChartHome();

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Server error!");
  } catch (e) {
    next(e);
  }
};
const getWeekChart = async (req, res, next) => {
  try {
    const response = await ZingMp3.getWeekChart("IWZ9Z08I");

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Server error!");
  } catch (e) {
    next(e);
  }
};

const getTop100 = async (req, res, next) => {
  try {
    const response = await ZingMp3.getTop100();

    if (response) {
      return res.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Server error!");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  search,
  getDetailArtist,
  getDetailPlaylist,
  getInfoMusic,
  download,
  getHome,
  getChartHome,
  getWeekChart,
  getTop100,
};
