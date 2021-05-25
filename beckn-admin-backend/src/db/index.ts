import { Sequelize } from 'sequelize-typescript';

import { db_config } from '../config/config'

export const sequelize = new Sequelize(
    db_config.DB || "",
    db_config.USER || "",
    db_config.PASSWORD,
    {
        host: db_config.HOST,
        dialect: "mysql",
        pool: {
            max: db_config.pool.max,
            min: db_config.pool.min,
            acquire: db_config.pool.acquire,
            idle: db_config.pool.idle
        }
    });