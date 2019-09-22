const express = require('express')
const dotenv = require('dotenv').config()
const db = require('./database/database').menu
const bodyParser = require("body-parser")
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Pizzeria api')
})

app.get('/menu', (req, res) => {

    db
        .select('*')
        .from('menuitems')
        .then(data => res.json(data))
        .catch(err => res.status(500).send('Database error'))
})

// Sending user's order history

app.get('/order-history', (req, res) => {

    const id = req.body.id

    db
        .select('items', 'created_at')
        .from('orders_history')
        .where('id', id)
        .then(data => {
            res.json(data)
        })
        .catch( (err) => console.log(err))
})

// Saving order to database
app.post('/save-order', (req, res) => {

    const {id, items} = req.body

    db.schema.hasTable('order_history').then(exist => {
        // Checks if table exist, if not creates it and saves the items
        if(!exist){

            db.schema.createTable('order_history', (column) => {
                column.string('id')
                column.string('items')
                column.timestamps()
            }).then(() => {

                try{
                    addItems(id, items)
                    res.send('Items added')
                } catch {
                    res.status(500).send('Items cannot be added')
                }

            }).catch( () => res.status(500).send('Table cannot be created'))
        } else {
            // If table already exist just adding the items
            try{
                addItems(id, items)
                res.send('Items added')
            } catch {
                res.status(500).send('Items cannot be added')
            }
        }

    })

    function addItems(id, items) {
        db.transaction(trx => {
            return trx
                .insert({
                    id: id,
                    items: items,
                    created_at: new Date()
                }).into('order_history')
        })
    }


})




app.listen(2000, () => {
    console.log('Server is running')
})
