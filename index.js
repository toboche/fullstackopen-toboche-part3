const express = require('express')
const app = express()   

app.use(express.json())

const persons = [
    {
        id: 1,
        name: "Test 1",
        number: "1233-233"
    },
    {
        id: 2,
        name: "Test 2",
        number: "2223-233"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT)