const { response } = require('express')
const express = require('express')
const app = express()   
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(
            persons => response.json(persons))
            .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    Person.find({}).then(persons => 
        response.send("<div>Phonebook contains info for " +
        persons.length +
        " people </div>" +
        "</br>" +
        new Date().toString()
        )
    )
    .catch(error => next(error)) 
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const person = Person.find({_id: id})
        .then(person => {
            if(person){
                response.json(person)
            } else {
                response
                    .status(404)
                    .end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.deleteOne({_id: id})
    .then(person =>{
        response.end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number
    console.log('name', request.body.name)
    console.log('number', request.body.number)

    if(!request || !number){
        return response.status(400).json({error: 'name or number missing'})
    } 
    
    // const isUnique = !persons.map(p=>p.name)
    //     .includes(name)

    // if(!isUnique){
    //     return response.status(400).json({error: "name not unique"})
    // }

    // const maxId = persons.length > 0
    // ? Math.max(...persons.map(p=>p.id))
    // : 0
    // const id = maxId + 1

    const newPerson =  new Person({
        name: name, 
        number: number
    })
    newPerson.save()
    .then(newPerson => response.json(newPerson))
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)