const { Sequelize } = require('sequelize')
const { DATABASE_URL, DATABASE_SSL, SEQUELIZE_LOGGING } = require('../utils/config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: DATABASE_SSL ? {
            require: true,
            rejectUnauthorized: false
        } : null
    },
    logging: SEQUELIZE_LOGGING
})

const migrationConfig = {
    migrations: {
        glob: 'migrations/*.js'
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConfig)
    const migrations = await migrator.up()
    console.log('Migrations are up to date', {
        files: migrations.map((migration) => migration.name)
    })
}

const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConfig)
    await migrator.down()
}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigrations()
        console.log('Connected to database')
    } catch(error) {
        console.log('Failed to connect to database', error)
        return process.exit(1)
    }
    return null
}

module.exports = {
    connectToDatabase, sequelize, rollbackMigration, runMigrations
}