import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config({ path: ['./.env'] });

interface EnvVars {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
}

const envSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().default(3000),
    MAIL_HOST: joi.string().default('smtp.gmail.com'),
    MAIL_PORT: joi.number().default(587),
    MAIL_USER: joi.string().required(),
    MAIL_PASS: joi.string().required(),
    MAIL_FROM: joi.string().optional(),
  })
  .unknown(true);

if (!process.env) {
  throw new Error('Environment variables are not defined');
}

const validate = envSchema.validate(process.env);

if (validate.error) {
  throw new Error(`Config validation error: ${validate.error.message}`);
}

const envVars = validate.value as EnvVars;

export const envs = {
  DATABASE_URL: envVars.DATABASE_URL,
  JWT_SECRET: envVars.JWT_SECRET,
  PORT: envVars.PORT,
  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PORT: envVars.MAIL_PORT,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASS: envVars.MAIL_PASS,
  MAIL_FROM: envVars.MAIL_FROM || envVars.MAIL_USER,
};
