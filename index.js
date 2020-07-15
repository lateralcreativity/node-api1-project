const express = require('express');
const shortid = require('shortid');
const server = express();

server.use(express.json());

let users = [
    {
        id: shortid.generate(),
        name: "Initial User",
        bio: "Just for testing usage"
    }
];

// Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    const newUser = req.body;

    try
    {
        if(!newUser.name || !newUser.bio){
            return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        } else {
            newUser.id = shortid.generate();
            users.push(newUser);
            return res.status(201).json(newUser);
        }
    }
    catch
    {
        return res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }

});

// Returns an array users.
server.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

// Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    let found = users.find(user => user.id === id);

    try {
        if(found) {
            return res.status(200).json(found);
        }
        else {
            return res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }
    catch {
        return res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});

// Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const deleted = users.find(user => user.id === id);
    try {
        if(deleted) {
            users = users.filter(user => user.id !== id);
            return res.status(200).json(deleted);
        } else {
            return res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }
    catch {
        return res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

// Updates the user with the specified id using data from the request body.
// Returns the modified user
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    let found = users.find(user => user.id === id);
    try {
        if(!changes.name || !changes.bio){
            return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        } else if(found) {
            Object.assign(found, changes);
            return res.status(200).json(found);
        } else {
            return res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }
    catch {
        return res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));