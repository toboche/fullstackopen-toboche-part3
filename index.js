const { response } = require('express')
const express = require('express')
const app = express()   
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('body', function(req, res, param) {
    return JSON.stringify(req.body);
});
morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ')
  })
app.use(
    morgan(':method :url :status :res[content-length] :response-time ms :body')
    )

var persons = [
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id);
    persons = persons.filter(p=> p.id !== id)
    console.log(persons);
    response.end()
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number
    console.log('name', request.body.name)
    console.log('number', request.body.number)

    if(!request || !number){
        return response.status(400).json({error: 'name or number missing'})
    } 
    
    const isUnique = !persons.map(p=>p.name)
        .includes(name)

    if(!isUnique){
        return response.status(400).json({error: "name not unique"})
    }

    const maxId = persons.length > 0
    ? Math.max(...persons.map(p=>p.id))
    : 0
    const id = maxId + 1

    const newPerson = {
        id: id,
        name: name, 
        number: number
    }
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT)