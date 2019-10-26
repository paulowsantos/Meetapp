import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { name, email, meetup } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Meetup canceled.',
      template: 'cancellation',
      context: {
        user: name,
        title: meetup.title,
        date: meetup.date,
      },
    });
  }
}

export default new CancellationMail();
