import * as Joi from 'joi';

export const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

export const Config = Joi.object({
  url: Joi.string().uri().required(),
  webhook: Joi.array().items(Joi.string().uri(), Joi.object()).min(2).max(2),
  userAgent: Joi.string(),
  matchedText: Joi.string(),
  regexPattern: Joi.string(),
  cssQuerySelector: Joi.string(),
  plainText: Joi.string(),
}).xor('regexPattern', 'cssQuerySelector', 'plainText').required();

export type Config = {
  url: string;
  userAgent: string;
  webhook?: [string, object];
  matchedText?: string;
  regexPattern?: string;
  cssQuerySelector?: string;
  plainText?: string;
}
