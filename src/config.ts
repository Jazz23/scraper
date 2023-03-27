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
  onlyVisibleText: Joi.bool(),
  negativeMatch: Joi.bool(),
  numericInequality: Joi.string().regex(/^([<>]=?|=)(\d+(\.\d+)?)$/) // "<=10", ">10", etc
})
.xor('regexPattern', 'cssQuerySelector', 'plainText') // Need one and only one match type
.oxor('plainText', 'matchedText') // Plain text doesn't care about matched text & visa versa
.oxor('onlyVisibleText', 'cssQuerySelector') // Query selector doesn't care about visibility & visa versa
.oxor('matchedText', 'numericInequality') // Matched text doesn't care about numeric inequality & visa versa
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
  negativeMatch?: boolean;
  numericInequality?: string;
}
