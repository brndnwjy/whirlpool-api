const pool = require("../config/db");

const chatModel = {
    newChat: ({sender, receiver, message}) => {
        return pool.query(`
        INSERT INTO messages (sender, receiver, message)
        VALUES ($1, $2, $3)        
        `, [sender, receiver, message])
    },
    
    getChat: (sender, receiver) => {
        return pool.query(`
        SELECT * FROM messages
        WHERE (sender = $1 AND receiver = $2)
        OR (sender = $3 AND receiver = $4)
        `, [sender, receiver, receiver, sender])
    }
}

module.exports = chatModel;
