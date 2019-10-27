import * as Yup from 'yup';
import { isBefore } from 'date-fns';

import Meetups from '../models/Meetups';
import Enrollments from '../models/Enrollments';
import User from '../models/User';
import File from '../models/File';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class MeetupsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { title, description, localization, date, banner_id } = req.body;

    // Check if meetup date is past
    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not allowed.' });
    }

    const meetup = await Meetups.create({
      title,
      description,
      localization,
      date,
      user_id: req.userId,
      banner_id,
    });

    return res.json(meetup);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetups.findAndCountAll({
      where: { user_id: req.userId },
      order: ['date'],
      attributes: [
        'id',
        'title',
        'description',
        'localization',
        'date',
        'user_id',
        'past',
        'cancelable',
      ],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.body;

    const meetup = await Meetups.findByPk(id);

    const { date } = meetup;

    if (date && isBefore(date, new Date())) {
      return res
        .status(400)
        .json({ code: 'Not allowed to delete past meetups.' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({
        error: 'You cannot cancel meetups you are not the organizer.',
      });
    }

    await Enrollments.findAll({
      where: { meetup_id: id },
      attributes: ['user_id'],
    }).then(usrid =>
      usrid.forEach(async usr => {
        const { name, email } = await User.findByPk(usr.user_id);

        await Queue.add(CancellationMail.key, {
          name,
          email,
          meetup,
        });
      })
    );

    await meetup.destroy({
      where: {
        id,
      },
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string(),
      description: Yup.string(),
      localization: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, date } = req.body;

    const meetup = await Meetups.findByPk(id);

    if (date && isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not allowed.' });
    }

    if (req.userId !== meetup.user_id) {
      return res
        .status(400)
        .json({ error: 'You cannot edit meetups you are not the organizer.' });
    }

    const { title, description, localization, banner_id } = await meetup.update(
      req.body
    );

    return res.json({
      id,
      title,
      description,
      localization,
      date,
      banner_id,
    });
  }
}

export default new MeetupsController();
