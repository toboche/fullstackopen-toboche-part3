/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 4) {
    console.log('Please provide the password, name, number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.lae6d.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(name){
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(_ => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({})
        .then(persons => {
            console.log('persons:')
            persons.forEach(p => console.log(`${p.name} ${p.number}`))
            mongoose.connection.close()
        })
}