module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 60) : '';
  const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 1000) : '';

  if (!name || !phone) {
    res.status(400).json({ error: "Ім'я та телефон обов'язкові" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured');
    res.status(500).json({ error: 'Сервіс тимчасово недоступний' });
    return;
  }

  const text = [
    '🔔 Нова заявка з сайту Glevakha Plaza',
    `👤 Ім'я: ${name}`,
    `📞 Телефон: ${phone}`,
    `💬 Коментар: ${comment || '—'}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text();
      console.error('Telegram API error:', telegramResponse.status, errorBody);
      res.status(502).json({ error: 'Не вдалося надіслати заявку' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to reach Telegram API:', error);
    res.status(502).json({ error: 'Не вдалося надіслати заявку' });
  }
};
