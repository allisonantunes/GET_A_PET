const multer = require('multer')
const path = require('path')

// Destination to store the images

const imageStorage = multer.diskStorage({
    destination: function (req, res, cb){

        let folder = ''

        if(req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) 
        // pega o nome original do arquivo e acha a extensao dele e concatena junto com a data atual
    },
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)) { // se nao foi jpg ou png /\.(png|jpg)$/
        return cb(new error('Por favor, envie apenas jpg ou png"'))
        }
    cb(undefined, true) 
    },
})

module.exports = { imageUpload }