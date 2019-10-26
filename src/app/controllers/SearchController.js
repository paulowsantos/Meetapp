import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Sequelize, { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Meetups from '../models/Meetups';
import Enrollments from '../models/Enrollments';

class SearchController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const result = await Meetups.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      order: [['date', 'ASC']],
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        'localization',
        'date',
        'past',
      ],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(result);
  }

  async indexUser(req, res) {
    const result = await Enrollments.findAll({
      where: {
        user_id: req.userId,
      },
      order: Sequelize.literal('"Meetup.date" ASC'),
      attributes: ['id', 'user_id', 'meetup_id'],
      include: [
        {
          model: Meetups,
          where: {
            date: {
              [Op.gte]: new Date(),
            },
          },
          attributes: [
            'id',
            'user_id',
            'title',
            'description',
            'localization',
            'date',
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'banner',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(result);
  }
}

export default new SearchController();
