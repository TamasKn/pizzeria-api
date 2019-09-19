const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('Pizzeria api')
})

app.listen(process.env.PORT || 2000, () => {
    console.log('Server is running')
})
