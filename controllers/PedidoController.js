const Pessoa = require("../models/pessoa")
const Pedido = require("../models/pedido")
const Produto = require("../models/product")
const Cor = require("../models/cor")
const ProdutoPedido = require('../models/pedidoProduto');

const controller = {}

controller.getUpdatePage = async (req, res) => {
    const {pessoaId,pedidoId} = req.params
    try {
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const pedido = pessoa.pedidos.find((pedido) => pedido.id === Number(pedidoId));
        
        if (!pedido) {
            return res.status(500).render("pages/error",{error : "Pedido não existe!"})
        }

        res.status(200).render("pedidos/edit",{
            pedido : pedido
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.getAll = async (req, res) => {
    const {pessoaId} = req.params
    console.log(req.pessoa)
    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido,
                    include: [
                    {
                        model: Produto,
                        include: [{ model: Cor, through: "produtoCor" }],
                    },
                    ],
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        res.status(200).render("pedidos/index",{
            pedidos : pessoa.pedidos,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir os pedidos"})

    }
}

controller.getById = async (req, res) => {
    const {pessoaId,pedidoId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido,
                    include: [
                    {
                        model: Produto,
                        through: {
                            model: ProdutoPedido,
                            attributes: ['cor'] // Incluir apenas o atributo 'cor' da tabela ProdutoPedido
                          }
                        //include: [{ model: Cor, through: "produtoCor" }],
                    },
                    ],
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const pedido = pessoa.pedidos.find((pedido) => pedido.id === Number(pedidoId));
        
        if (!pedido) {
            return res.status(500).render("pages/error",{error : "Pedido não existe!"})
        }
        //console.log(pedido)
        //res.status(200).json(pedido);
        res.status(200).render("pedidos/show",{
            pedido : pedido,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir o pedido"})
    }
    
}

controller.create = async (req, res) => {
    const {pessoaId} = req.params
    const {produtosPedido} = req.body

    const produtosIds = produtosPedido.map((produto) => produto.produtoId);

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        
        if (!pessoa){
            res.status().send("Pessoa não existe!")
        }
        
        const produtos = await Produto.findAll({ where: { id: produtosIds } });
        
        let valorPedido = 0
        for (produto of produtos){
            valorPedido += parseFloat(produto.preco)
        }

        const pedido = await Pedido.create({valor:valorPedido,status:"Aguardando Pagamento",pessoaId})
        for (let pId of produtosIds) {
            const produto = produtos.find((p) => p.id == pId)
            const produtoCor = produtosPedido.find((p) => p.produtoId == produto.id)
            const produtoPedido = await ProdutoPedido.create({
                pedidoId: pedido.id,
                produtoId: produto.id,
                cor: produtoCor.corSelecionada       
            });
            
            await pedido.addProdutos(produto, { through: produtoPedido });
            
            produtosPedido.splice(produtosPedido.indexOf(produtoCor),1)
            
          }
     
        res.status(200).json(pedido.id)
    }catch(error){ 
        res.status(500).render("pages/error",{error : "Erro ao cadastrar o pedido"})
    }
}

controller.update = async (req, res) => {
    const {pessoaId,pedidoId} = req.params
    const {status} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido
                },
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const pedido = pessoa.pedidos.find((pedido) => pedido.id === Number(pedidoId));
        
        if (!pedido) {
            return res.status(500).render("pages/error",{error : "Pedido não existe!"})
        }

        pedido.status = status

        await pedido.save()
        
        res.status(200).redirect(`/pedidos/${pessoaId}`)
    }catch (error){
        res.status(500).render("pages/error",{error : "Erro ao atualizar o pedido!"})
    }

}

controller.delete = async (req, res) => {
    const {pessoaId,pedidoId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        const pedido = await Pedido.findByPk(pedidoId)

        if (!pedido){
            res.status(422).send("Pedido não existe!")
        }

        await pedido.destroy()
        res.status(200).redirect(`/pedidos/${pessoaId}`)
    }catch (error){
        res.status(422).render("pages/error",{error: "Não foi possível remover o pedido"})

    }
    
}

module.exports = controller