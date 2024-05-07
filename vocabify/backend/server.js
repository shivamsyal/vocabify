const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes'); 

const app = express();

app.use(cors());  // For development
app.use(bodyParser.json());
app.use('/', routes); 

const port = 3002;
app.listen(port, () => console.log(`Server listening on port ${port}`));