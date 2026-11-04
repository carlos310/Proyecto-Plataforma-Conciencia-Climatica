import "dotenv/config";
import Joi from "joi";

export type ReturnEnvironmentVars={
    PORT:number;
    DB_PORT:number;
    DB_USER:string;
    DB_PASSWORD:string;
    DB_NAME:string;
}
 const LoadEnvVars = (): ReturnEnvironmentVars => {
  // Definimos un esquema con Joi para validar
  const schema = Joi.object({
    PORT: Joi.number().default(4000),
    DB_PORT:Joi.number().default(3002),
    DB_USER:Joi.string(),
    DB_PASSWORD:Joi.string().allow(""),
    DB_NAME:Joi.string(),
  }).unknown();

  // Validamos directamente process.env
  const { error, value } = schema.validate(process.env);

  if (error) {
    throw new Error(`Error en variables de entorno: ${error.message}`);
  }

  return {
    PORT: Number(value.PORT),
    DB_PORT:Number(value.DB_PORT),
    DB_USER:value.DB_USER,
    DB_PASSWORD:value.DB_PASSWORD,
    DB_NAME:value.DB_NAME,
  };
};


const envs = LoadEnvVars();
export default envs;
