const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// helpers
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-token')
const createUserToken = require('../helpers/create-user-token')
// const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
    static async register(req, res) {
        /*
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        ao inves disso, usa isso:
        const {name, email, phone, password, confirmpassword} = req.body
        */
        const {name, email, phone, password, confirmpassword} = req.body

        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatorio'})
            return
        }
        if(!email){
            res.status(422).json({ message: 'O email é obrigatorio'})
            return
        }
        if(!phone) {
            res.status(422).json({ message: 'O telefone é obrigatorio'})
            return
        }
        if(!password) {
            res.status(422).json({ message: 'A senha é Obrigatorio'})
            return
        }
        if(!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatorio'})
            return
        }   
        if(password !== confirmpassword){
            res.status(422).json({ message: 'A senha e a confirmação de senhas precisam ser iguais'})
            return
        }
        const userExists = await User.findOne({ email: email})

        if(userExists) {
            res.status(422).json({ message: 'E-mail já cadastrado'})
            return
        }

        // create a password //segurança, colocando 12 carac a mais na senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
            
        } catch (error) {
            res.status(500).json({ message: error})
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if(!email) {
            res.status(422).json({ message: 'E-mail obrigatorio'})
            return
        }
        if(!password) {
            res.status(422).json({ message: 'Insira sua senha'})
            return
        }
        const user = await User.findOne({ email: email})

        if(!user) {
            res.status(422).json({ message: 'E-mail não cadastrado'})
            return
        }
        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({ message: 'senha incorreta'})
            return
        }
        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser
    
        if (req.headers.authorization) {
          const token = getToken(req)
          const decoded = jwt.verify(token, 'nossosecret')
    
          currentUser = await User.findById(decoded.id)
    
          currentUser.password = undefined
        } else {
          currentUser = null
        }
    
        res.status(200).send(currentUser)
      }

      static async getUserById(req, res) {

        const id = req.params.id
        const user = await User.findById(id).select('-password') // buscar o id no banco

        if(!user) {
            res.status(422).json({ message: 'usuario nao encontrado'})
            return
        }
        res.status(200).json({ user })
      }

    static async editUser(req, res){
        const id = req.params.id

        // check if user exists
        const token = getToken(req) // pegar o token
        const user = await getUserByToken(token)

        if(!user) {
            res.status(422).json({ message: 'usuario nao encontrado'})
            return
        }

        const {name, email, phone, password, confirmpassword} = req.body

        // o molter ja vai alterar o nome da image
        if(req.file) { // arquivos vem por req.file
            user.image = req.file.filename
        }
        // validation

        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatorio'})
            return
        }
        if(!email){
            res.status(422).json({ message: 'O email é obrigatorio'})
            return
        }

        // check if email has already taken (verifique se o e-mail já foi levado)
        const userExists = await User.findOne({email:email})
        
        if(user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilizar outro e-mail'})
            return
        }
        // 

        user.email = email

        if(!phone) {
            res.status(422).json({ message: 'O telefone é obrigatorio'})
            return

        user.phone = phone
        }
        if(password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem'})
            return
        } else if(password === confirmpassword && password !=null) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }
        try {

            await User.findOneAndUpdate(
                {_id: user._id}, // filtro
                {$set: user}, // quais dados será atualizados
                {new: true}, // parametro para fazer a atualizacao de dado com sucesso
            )

            res.status(200).json({message: 'Usuario atualizado com sucesso'})

        } catch (error) {
            res.status(500).json({message: error})
            return
        }
        /*
        if(!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatorio'})
            return
        }   
        if(password !== confirmpassword){
            res.status(422).json({ message: 'A senha e a confirmação de senhas precisam ser iguais'})
            return
        }
        */
    }
}
