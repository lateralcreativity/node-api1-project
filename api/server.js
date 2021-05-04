// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();
const Users = require('./users/model');

server.use(express.json());

server.post('/api/users', (request, response) => {
    const newUser = request.body;
    if(!newUser.name || !newUser.bio) {
        response.status(400).json(`Name and bio are required fields.`)
    } else {
        Users.insert(newUser)
        .then(addedUser => {
            response.status(201).json(addedUser);
        })
        .catch(error => response.status(500).json(error));
    }
})

server.get('/api/users', (request, response) => {
    Users.find()
    .then(user => {
        response.status(200).json(user);
    })
    .catch(error => response.status(500).json(error));
});

server.get(`/api/users/:id`, (request, response) => {
    const id = request.params.id;
    
    Users.findById(id)
    .then(user => {
        if(!user) {
            response.status(404).json('User with that ID was not found.')
        } else {
            response.status(200).json(user);
        }
    })
    .catch(error => response.status(500).json(error));
});

server.delete('/api/users/:id', (request, response) => {
    const id = request.params.id;

    Users.remove(id)
    .then(deletedUser => {
        if(!deletedUser) {
            response.status(404).json('User with that ID was not found.');
        } else {
            response.status(200).json(deletedUser);
        }
    })
    .catch(error => response.status(500).json(error));
});

server.put('/api/users/:id', (request, response) => {
    const id = request.params.id;
    const changes = request.body;

    Users.update(id, changes)
    .then(user => {
        if(!user) {
            response.status(404).json('User with taht ID was not found.');
        } else {
            response.status(200).json(user);
        }
    })
    .catch(error => response.status(500).json(error));
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
