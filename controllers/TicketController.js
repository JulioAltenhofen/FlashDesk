const Pessoa = require("../models/pessoa")
const ticket = require("../models/ticket")

const controller = {}

controller.getUpdatePage = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    try {
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: ticket
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const ticket = pessoa.tickets.find((ticket) => ticket.id === Number(ticketId));
        
        if (!ticket) {
            return res.status(500).render("pages/error",{error : "ticket não existe!"})
        }

        res.status(200).render("tickets/edit",{
            ticket : ticket
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
                    model: ticket,
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

        res.status(200).render("tickets/index",{
            tickets : pessoa.tickets,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir os tickets"})

    }
}

controller.getById = async (req, res) => {
    const {pessoaId,ticketId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: ticket,
                    include: [
                    {
                        model: Produto,
                        through: {
                            model: Produtoticket,
                            attributes: ['cor'] // Incluir apenas o atributo 'cor' da tabela Produtoticket
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

        const ticket = pessoa.tickets.find((ticket) => ticket.id === Number(ticketId));
        
        if (!ticket) {
            return res.status(500).render("pages/error",{error : "ticket não existe!"})
        }
        //console.log(ticket)
        //res.status(200).json(ticket);
        res.status(200).render("tickets/show",{
            ticket : ticket,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir o ticket"})
    }
    
}

controller.create = async (req, res) => {
    const {pessoaId} = req.params
    const {produtosticket} = req.body

    const produtosIds = produtosticket.map((produto) => produto.produtoId);

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        
        if (!pessoa){
            res.status().send("Pessoa não existe!")
        }
        
        const produtos = await Produto.findAll({ where: { id: produtosIds } });
        
        let valorticket = 0
        for (produto of produtos){
            valorticket += parseFloat(produto.preco)
        }

        const ticket = await ticket.create({valor:valorticket,status:"Aguardando Pagamento",pessoaId})
        for (let pId of produtosIds) {
            const produto = produtos.find((p) => p.id == pId)
            const produtoCor = produtosticket.find((p) => p.produtoId == produto.id)
            const produtoticket = await Produtoticket.create({
                ticketId: ticket.id,
                produtoId: produto.id,
                cor: produtoCor.corSelecionada       
            });
            
            await ticket.addProdutos(produto, { through: produtoticket });
            
            produtosticket.splice(produtosticket.indexOf(produtoCor),1)
            
          }
     
        res.status(200).json(ticket.id)
    }catch(error){ 
        res.status(500).render("pages/error",{error : "Erro ao cadastrar o ticket"})
    }
}

controller.update = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    const {status} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: ticket
                },
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const ticket = pessoa.tickets.find((ticket) => ticket.id === Number(ticketId));
        
        if (!ticket) {
            return res.status(500).render("pages/error",{error : "ticket não existe!"})
        }

        ticket.status = status

        await ticket.save()
        
        res.status(200).redirect(`/tickets/${pessoaId}`)
    }catch (error){
        res.status(500).render("pages/error",{error : "Erro ao atualizar o ticket!"})
    }

}

controller.delete = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        const ticket = await ticket.findByPk(ticketId)

        if (!ticket){
            res.status(422).send("ticket não existe!")
        }

        await ticket.destroy()
        res.status(200).redirect(`/tickets/${pessoaId}`)
    }catch (error){
        res.status(422).render("pages/error",{error: "Não foi possível remover o ticket"})

    }
    
}

module.exports = controller