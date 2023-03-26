import { HttpFunction } from '@google-cloud/functions-framework';
import { Request, Response } from '@google-cloud/functions-framework';
import { Config, defaultUserAgent } from './config';
import { divideString, getDOM, grabText } from './utils';
import { JSDOM } from 'jsdom';


export const checker: HttpFunction = async (req: Request, res: Response) => {
  try{
    if (req.method == 'GET') {
      if (!req.query.url) {
        res.status(400).send('url is required');
        return;
      }
      res.send(await grabText({ url: divideString(req.originalUrl, 'url='), userAgent: (req.query.userAgent || defaultUserAgent) as string }));
      return;
    }
    
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
  } catch (error) {
    res.status(500).send(error);
  }
};

function sendWebhook(config: Config) {
  if (!config.webhook) throw new Error('Webhook is required');
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config.webhook.payload)
  };
  fetch(config.webhook.url, options);
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
  const doc: Document = (new JSDOM(await grabText(config))).window.document;
  const el: Element | null = doc.querySelector(config.cssQuerySelector);
  if (!el) return false;
  if (config.matchedText && !(el.textContent && el.textContent.includes(config.matchedText)))
    return false;
  return true;
}

async function regexMatch(config: Config): Promise<boolean> {
  if (!config.regexPattern) throw new Error('regexPattern is required');
  const text = await grabText(config);
  const regex = new RegExp(config.regexPattern);
  if (!regex.test(text)) return false;
  if (config.matchedText && regex.exec(text)?.[0] != (config.matchedText))
    return false; // We're supposed to match certain text but we found something else
  return true; 
}

async function plainText(config: Config): Promise<boolean> {
  if (!config.plainText) throw new Error('plainText is required');
  const text = await grabText(config);
  return text.includes(config.plainText);
}