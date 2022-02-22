import axios from 'axios';
import env from '../config/env';

const yt = async (text: string, fromLang: string, toLang: string) => {
  try {
    const res = await axios.get(
      'https://translate.yandex.net/api/v1.5/tr.json/translate',
      {
        params: {
          key: env.ytApiKey,
          text,
          lang: `${fromLang}-${toLang}`,
          format: 'plain',
        },
      },
    );
    return res.data.text[0];
  } catch (e) {
    console.log(e);
    return text;
  }
};

export default yt;
