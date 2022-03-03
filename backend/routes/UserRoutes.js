const router = require('express').Router()

const UserController = require('../controllers/UserController')

// middleware
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)
// patch pois é uma rota de atualizaçao 
// imageUpload.single('image') vai receber uma unica imagem e o campo enviado para o form se chama image
module.exports = router
