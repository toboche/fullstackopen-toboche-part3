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

app.get('/api/info', (request, response) => {
    response.send("<div>Phonebook contains info for " +
    persons.length +
    " people </div>" +
    "</br>" +
    new Date().toString()
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    } else {
        response
            .status(404)
            .end()
    }
})

const PORT = 3001
app.listen(PORT)