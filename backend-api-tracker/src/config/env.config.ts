import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config({ path: ['./.env'] });

interface EnvVars {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
}

const envSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().default(3000),
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
};
