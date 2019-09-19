const menu = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: process.env.USERNAME,
        password: process.env.PASS,
        database: process.env.DATABASE
    }
})

module.exports = {
    menu: menu
}
