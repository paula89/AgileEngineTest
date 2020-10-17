var express = require('express');
var router = express.Router();
const { transactionController, historyController, idController } = require('../controllers/Controllers');

const app = express();
app.listen(4200, () => {
    console.log('running in 4200...');
});
app.use(express.json());

app.post(`/transaction`, transactionController);
app.get(`/history`, historyController);
app.get(`/id/:id`, idController);


module.exports = router;
