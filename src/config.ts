import * as Joi from 'joi';

export const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
export const ineqRegex = /([<>]=?)|=/;
export const decimalRegex = /-?((\d+(,\d{3})*|\d+)(\.\d+)?)/;

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
  numericInequality: Joi.string().regex(new RegExp(`^(${ineqRegex.source})(${decimalRegex.source})$`)), // "<=10", ">10", etc
  decimalComma: Joi.bool(),
})
.xor('regexPattern', 'cssQuerySelector', 'plainText') // Need one and only one match type
// Plain text, matched text, and numeric inequality are mutually exclusive matching conditions
.oxor('plainText', 'matchedText', 'numericInequality')
.oxor('onlyVisibleText', 'cssQuerySelector') // Query selector doesn't care about visibility & visa versa
.with('decimalComma', 'numericInequality') // Decimal comma only applies to numeric inequality
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
  decimalComma?: boolean;
}
