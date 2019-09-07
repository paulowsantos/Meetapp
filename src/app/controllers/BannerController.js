import Banners from '../models/Banners';

class BannerController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const banner = await Banners.create({
      name,
      path,
    });

    return res.json(banner);
  }
}

export default new BannerController();
