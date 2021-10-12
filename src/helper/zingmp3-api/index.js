let request = require("request-promise");
const download = require("download");
const { FileCookieStore } = require("tough-cookie-file-store");
const fs = require("fs");
const ChangeToSlug = require("./createSlug");

const encrypt = require("./encrypt");

const URL_API = "https://zingmp3.vn";
const API_KEY = "88265e23d4284f25963e6eedac8fbfa3";
const SECRET_KEY = "2aa2d1c561e809b267f3638c4a307aab";
const cookiePath = "ZingMp3.json";

if (!fs.existsSync(cookiePath)) fs.closeSync(fs.openSync(cookiePath, "w"));

let cookiejar = request.jar(new FileCookieStore(cookiePath));

request = request.defaults({
  baseUrl: URL_API,
  qs: {
    apiKey: API_KEY,
  },
  gzip: true,
  json: true,
  jar: cookiejar,
});
class ZingMp3 {
  constructor() {
    this.time = null;
  }

  async getFullInfo(id) {
    try {
      const info = await this.getInfoMusic(id);
      const link = await this.getStreaming(id);
      return {
        info,
        link,
      };
    } catch (e) {
      return null;
    }
  }

  getSectionPlaylist(id) {
    return this.requestZing({
      path: "/api/v2/playlist/getSectionBottom",
      qs: {
        id,
      },
    });
  }

  getDetailPlaylist(id) {
    return this.requestZing({
      path: "/api/v2/page/get/playlist",
      qs: {
        id,
      },
    });
  }

  getDetailArtist(alias) {
    return this.requestZing({
      path: "/api/v2/page/get/artist",
      qs: {
        alias,
      },
      haveParam: 1,
    });
  }

  getInfoMusic(id) {
    return this.requestZing({
      path: "/api/v2/page/get/song",
      qs: {
        id,
      },
    });
  }

  getStreaming(id) {
    return this.requestZing({
      path: "/api/v2/song/get/streaming",
      qs: {
        id,
      },
    });
  }

  async getStreaming320(id, title = null) {
    try {
      let fileName = "";
      if (!title) {
        const songInfo = await this.getInfoMusic(id);
        fileName = ChangeToSlug(songInfo.title) + ".mp3";
      } else {
        fileName = ChangeToSlug(title) + ".mp3";
      }

      if (fs.existsSync(`public/file/${fileName}`)) {
        return `/file/${fileName}`;
      }

      const url = `http://api.mp3.zing.vn/api/streaming/audio/${id}/320`;
      fs.writeFileSync(`public/file/${fileName}`, await download(url));
      return `/file/${fileName}`;
    } catch (e) {
      return null;
    }
  }

  getHome(page = 1) {
    return this.requestZing({
      path: "/api/v2/page/get/home",
      qs: {
        page,
      },
    });
  }

  getChartHome() {
    return this.requestZing({
      path: "/api/v2/page/get/chart-home",
    });
  }

  getWeekChart(id) {
    return this.requestZing({
      path: "/api/v2/page/get/week-chart",
      qs: { id },
    });
  }

  getNewReleaseChart() {
    return this.requestZing({
      path: "/api/v2/chart/getNewReleaseChart",
    });
  }

  getTop100() {
    return this.requestZing({
      path: "/api/v2/top100",
    });
  }

  getLinkSong(id, query = 320) {
    return `http://api.mp3.zing.vn/api/streaming/audio/${id}/${query}`;
  }

  search(keyword) {
    return this.requestZing({
      path: "/api/v2/search/multi",
      qs: {
        q: keyword,
      },
      haveParam: 1,
    });
  }

  async getCookie() {
    if (!cookiejar._jar.store.idx["zingmp3.vn"]) await request.get("/");
  }

  // haveParam = 1 => string hash will have suffix
  async requestZing({ path, qs, haveParam }) {
    try {
      await this.getCookie();
      let param = new URLSearchParams(qs).toString();

      let sig = this.hashParam(path, param, haveParam);

      const data = await request({
        uri: path,
        qs: {
          ...qs,
          ctime: this.time,
          sig,
        },
      });
      if (data.err) return null;
      return data.data;
    } catch (error) {
      return null;
    }
  }

  hashParam(path, param = "", haveParam = 0) {
    this.time = Math.floor(Date.now() / 1000);

    let strHash = `ctime=${this.time}`;
    if (haveParam === 0) strHash += param;
    const hash256 = encrypt.getHash256(strHash);
    return encrypt.getHmac512(path + hash256, SECRET_KEY);
  }
}

module.exports = new ZingMp3();
