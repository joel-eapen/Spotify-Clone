require('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/db/db.js');

connectDB();


const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})