const express = require('express');
const bodyParser = require('body-parser');
const { pool, testConnection } = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('Starting server...');

//panggil users
app.get('/users', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//ambil teman bedasarkan id
app.get('/friend/:id', async (req, res)=>{
    try{
        const id = req.query
        const rows = await pool.query('SELECT friend_id FROM friends WHERE user_id = $1', [id]);
        res.json(rows);
    }catch(err){
        res.status(500).send(err.massage)
    }
})

//add namuser dan id
app.post('users/:id', async (req, res) =>{
    try{
        const{name, id} = req.body;
        await pool.query('INSERT INTO users (id, name) VALUES ($1, $2)', [id, name]);
        res.status(201).json({message: 'users addes succesfully'});
    }catch(err){
        res.status(500).send(err.message);
    }
});

//add teman
app.put('users/teman', async (req, res) =>{
    try{
        const userID = req.params
        const temanID = req.body;
        await pool.query('UPDATE friends SET friend_id = $1 WHERE user_id = $2', [temanID, userID]);
        res.status(201).json({message: 'teman fungsi succesfully'});
    }catch(err){
        res.status(500).send(err.message);
    }
});

//kirim pesan userid ke friend id
app.post('user/pesan/:sendID', async (req, res) =>{
    try{
        const{pesanID, sendID, terimaID, pesan, waktu} = req.body;
        const rows = await pool.query('INSERT INTO messages (messages_id, send_id, recived_id, pesan messages_text, timestamp) VALUES ($!, $2, $3, $4, $5)'
        , [pesanID, sendID, terimaID, pesan, waktu]);
        res.status(201).json({message: 'pesan succesfully'});
    }catch(err){
        res.status(500).send(err.message);
    }
});

//ambil Pesan bedasarkan ID
app.get('user/pesan/history/', async (req, res) =>{
    try{
        const {userID, friendID} = req.query;
        const rows = await pool.query('SELECT message_text FROM `messages` WHERE sender_id = $1 AND receiver_id = $2', [userID, friendID]);
        res.status.json(rows);
    }catch(err){
        res.status(500).send(err.massage);
    }
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});