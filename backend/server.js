const express = require('express');
const   cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err,req,res)=> {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/health', (req, res) => {
    res.json({ status : 'ok',message:"we are up and running" });
});
