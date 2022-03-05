const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId   // chegar se o id é valido

module.exports = class PetController {

    // create a pet
    static async create(req, res) {
        const {name, age, weight, color} = req.body

        const images = req.files

        const available = true

        // images upload

        // validation
        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatorio'})
            return
        }
        if(!age) {
            res.status(422).json({ message: 'A idade é obrigatorio'})
            return
        }
        if(!weight) {
            res.status(422).json({ message: 'O peso é obrigatorio'})
            return
        }
        if(!color) {
            res.status(422).json({ message: 'A cor é obrigatorio'})
            return
        }
        if(images.length === 0) { // nao tem nem um elemento no array
            res.status(422).json({ message: 'A imagem é obrigatorio'})
            return
        }

        // get pet owner. dono do pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({
               message: 'Pet cadastrado com sucesso',
               newPet,
            })
            
        } catch (error) {
            res.status(500).json({message: error})
        }

    }
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-create')
        // .sort('-create') ordenação o - pega do mais novo para o mais velho
        // Pet.find() = esta pegando todos os pets
        res.status(200).json({pets: pets,}) // retornando o pet, se deu tudo certo
    }
    static async getAllUserPets(req, res) {
        // token user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')
        // filtro .find({'user._id: user._id'}) user campo e user variavel

        res.status(200).json({
            pets,
        })
    }
    static async getAllUserAdoptions(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById(req, res) {
        // pegando o id pela url
        const id = req.params.id 
        // check if id is valid se ele não for um id valido, nao confere um com outro
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' })
            return
        }
        // check if pet exists, se tem id valido
        const pet = await Pet.findOne({_id: id})

        // se o pet nao existir
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }
        res.status(200).json({ pet: pet, })
    }

    static async removePetById(req, res) {
        const id = req.params.id 
        // check if id is valid se ele não for um id valido, nao confere um com outro
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' })
            return
        }
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }
        res.status(200).json({ pet: pet, })

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        // se o id for diferente do id que esta no pet
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({message: 'Pet removido com sucesso!'})
    }

    static async updatePet(req, res) {
        const id = req.params.id

        const {name, age, weight, color, available} = req.body

        const images = req.files

        const updatedData = {}

        // check if pet exist
        const pet = await Pet.findOne({_id: id})

        // se o pet nao existir
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        // se o id for diferente do id que esta no pet
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
            return
        }
        // validation
        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatorio'})
            return
        } else {
            updatedData.name = name
        }
        if(!age) {
            res.status(422).json({ message: 'A idade é obrigatorio'})
            return
        }else {
            updatedData.age = age
        }
        if(!weight) {
            res.status(422).json({ message: 'O peso é obrigatorio'})
            return
        }else {
            updatedData.weight = weight
        }
        if(!color) {
            res.status(422).json({ message: 'A cor é obrigatorio'})
            return
        }else {
            updatedData.color = color
        }
        if(images.length === 0) { // nao tem nem um elemento no array
            res.status(422).json({ message: 'A imagem é obrigatorio'})
            return
        }else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }
        // update pet
        await Pet.findByIdAndUpdate(id,  updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso'})

    }

    static async schedule(req, res) {

        const id = req.params.id

        // check if exists
        const pet = await Pet.findOne({_id: id})

        // se o pet nao existir
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }

        // check if user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        // se o id for diferente do id que esta no pet
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: 'Vc não pode agendar uma visita com seu proprio pet'})
            return
        }

        // check if user has already scheduled a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: 'Vc já agendou uma visita para esse pet'})
                return
            }
        }
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: ` A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`})
    }

    static async concludeAdoption(req, res){

        const id = req.params.id

        // check if exists
        const pet = await Pet.findOne({_id: id})

        // se o pet nao existir
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }

        // check if user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        // se o id for diferente do id que esta no pet
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: 'Vc não pode agendar uma visita com seu proprio pet'})
            return
        }
        pet.available = false

        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({message: 'parabens, o ciclo de adoçao foi finalizado com sucesso'})

    }
} 