import * as Joi from 'joi';

export const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

export const Config = Joi.object({
  url: Joi.string().uri().required(),
  webhook: Joi.object({
    url: Joi.string().uri().required(),
    payload: Joi.object().required()
  }),
  userAgent: Joi.string(),
  matchedText: Joi.string(),
  regexPattern: Joi.string(),
  cssQuerySelector: Joi.string(),
  plainText: Joi.string(),
  onlyVisibleText: Joi.bool()
})
.xor('regexPattern', 'cssQuerySelector', 'plainText')
.oxor('plainText', 'matchedText')
.oxor('onlyVisibleText', 'cssQuerySelector')
.required();

export type Config = {
  url: string;
  userAgent: string;
  webhook?: {
    url: string;
    payload: object;
  }
  matchedText?: string;
  regexPattern?: string;
  cssQuerySelector?: string;
  plainText?: string;
  onlyVisibleText?: boolean;
}
