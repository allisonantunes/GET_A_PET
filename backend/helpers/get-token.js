const getToken = (req) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1] 
    //  um espaço, cria um array com 2 elementos para separar, bearer e o token e pegar a segunda parte. [1]

    return token
}

module.exports = getToken
