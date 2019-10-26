import * as Yup from 'yup';
import { isBefore } from 'date-fns';

import Enrollment from '../models/Enrollments';
import Meetups from '../models/Meetups';
import User from '../models/User';
import Notification from '../schemas/Notification';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetups.findByPk(meetup_id);
    // Check if meetup exists
    if (!meetup) {
      return res.status(401).json({ error: 'Meetup does not exists.' });
    }

    // Check if the logged user is the provider of this meetup
    if (req.userId === meetup.user_id) {
      return res.status(400).json({
        error: "You can't enroll in a meetup you're the organizer",
      });
    }

    // Check if meetup date is past
    const { date } = meetup;

    if (isBefore(date, new Date())) {
      return res
        .status(400)
        .json({ error: 'You can enroll in a past meetup.' });
    }

    // Check if the user is already enrolled in this meetup
    const isEnrolled = await Enrollment.findOne({
      where: {
        meetup_id,
        user_id: req.userId,
      },
    });

    if (isEnrolled) {
      return res
        .status(400)
        .json({ error: "You're already enrolled to this meetup." });
    }

    // Check if user i already enrolled in another meetup with the same date/hour
    const checkAvailability = await Enrollment.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetups,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (checkAvailability) {
      return res.status(400).json({
        error: "You're already enrolled in a meetup on the same time.",
      });
    }

    const enrollment = await Enrollment.create({
      meetup_id,
      user_id: req.userId,
    });

    // Notify provider
    const user = await User.findByPk(req.userId);

    await Notification.create({
      content: `New enrollment from ${user.name} in Meetup ${meetup.title}`,
      user: meetup.user_id,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.body;

    const enrollment = await Enrollment.findByPk(id);

    await enrollment.destroy({
      where: {
        id,
      },
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
