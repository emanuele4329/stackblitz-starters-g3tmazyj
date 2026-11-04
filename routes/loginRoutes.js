const express = require('express');
const controller = require('../controllers/loginController');

const router = express.Router();

router.post('/cadastrar', controller.cadastrar);
router.post('/entrar', controller.entrar);
router.post('/sair', controller.sair);

module.exports = router;