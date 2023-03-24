import { HttpFunction } from '@google-cloud/functions-framework';
import { Request, Response } from '@google-cloud/functions-framework';
import { Config, defaultUserAgent } from './config';


export const helloHttp: HttpFunction = async (req: Request, res: Response) => {
  const validation = Config.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }

  const config: Config = req.body;
  if (await performCheck(config)) {
    if (config.webhook) sendWebhook(config);
    res.send('Match found! Webhook sent.');
    return;
  }

  res.status(404).send('No match found.');
};

function sendWebhook(config: Config) {
  // TODO
}

async function performCheck(config: Config): Promise<boolean> {
  if (!config.userAgent) config.userAgent = defaultUserAgent;
  if (config.regexPattern) {
    return regexMatch(config);
  } else if (config.cssQuerySelector) {
    return await querySelector(config);
  } else if (config.plainText) {
    return plainText(config);
  }
  return false;
}

async function querySelector(config: Config): Promise<boolean> {
  if (!config.cssQuerySelector) throw new Error('cssQuerySelector is required');
  const doc: Document = await getDocument(config.url, config.userAgent);
  const el: Element | null = doc.querySelector(config.cssQuerySelector);
  if (!el) return false;
  if (config.matchedText && !(el.textContent && el.textContent.includes(config.matchedText)))
    return false;
  return true;
}

async function regexMatch(config: Config): Promise<boolean> {
  throw new Error('Function not implemented.');
}


async function plainText(config: Config): Promise<boolean> {
  throw new Error('Function not implemented.');
}

async function getDocument(url: string, userAgent: string): Promise<Document> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
    },
  });
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc;
}
