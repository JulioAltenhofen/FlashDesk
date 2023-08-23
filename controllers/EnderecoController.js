const Pessoa = require("../models/pessoa")
const Endereco = require("../models/endereco")


const controller = {}

controller.create = async (req, res) => {
    const {pessoaId} = req.params

    const {rua,cidade} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        const endereco = await Endereco.create({rua,cidade,pessoaId})

        return res.status(200).json(endereco)
    }catch(error){ 
        res.status(422).send("Ocorreu um erro ao cadastrar o endereço. " + error)
    }
}


controller.get = async (req, res) => {
    const {pessoaId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: Endereco,
        })
        
        if (!pessoa){
            res.status().send("Pessoa não existe!")
        }

        return res.status(200).json(pessoa)
    }catch(error){ 
        res.status(422).json("Ocorreu um erro ao buscar o item. " + error)
    }
}

module.exports = controller