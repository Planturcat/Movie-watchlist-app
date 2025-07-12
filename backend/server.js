const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MovieRoutes = require('./routes');

//load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());

// Routes

app.use('/api', MovieRoutes);

//health check route
app.get('/health',(req,res)=>{
    res.json({status: 'UP',message: 'Server is running'});
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Error handling middleware

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({error: 'Something went wrong!'});
});