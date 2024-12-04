export enum ENV {
  MONGO_URI = 'MONGO_URI',
  DB_NAME = 'DB_NAME',
  PERSON_SERVICE_BASE_URL = 'PERSON_SERVICE_BASE_URL',
  HTTP_SERVER_PORT = 'HTTP_SERVER_PORT',
  KAFKA_BROKERS = 'KAFKA_BROKERS',
  KAFKA_GROUP_ID = 'KAFKA_GROUP_ID',
  KAFKA_CLIENT_ID = 'KAFKA_CLIENT_ID',
}

export function getEnv(key: ENV): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
