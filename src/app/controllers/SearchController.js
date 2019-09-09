import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Meetups from '../models/Meetups';

class SearchController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const result = await Meetups.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      attributes: ['id', 'user_id', 'title', 'description', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(result);
  }
}

export default new SearchController();
