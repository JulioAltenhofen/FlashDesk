const Pessoa = require("../models/pessoa")
const ticket = require("../models/ticket")

const controller = {}

controller.getRegisterPage = async (req, res) => {
    try {
        res.status(200).render("ticket/form",{
            ticket : new ticket()
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

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
        res.status(200).render("tickets/show",{
            ticket : ticket,
            pessoa : pessoa
        })
    }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir o ticket"})
    }
    
}

controller.create = async (req, res) => {
    const {titulo,campoTexto,anexo} = req.body

    try{
        const titulo = await titulo;
        const campoTexto = await campoTexto;
        const anexo = await anexo;
        res.status(200).redirect("/") 
    }catch(error){ 
        res.status(422).render("pages/error",{error: "Erro ao criar ticket!"+error})
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
    
};

// controller.get('/', (req,res) => {
//     res.sendFile(__dirname + '/form.js')
// }) 

// controller.post('/api/upload', (req, res, next) => {
//     const form = formidable({});
  
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         next(err);
//         return;
//       }
//       res.json({ fields, files });
//     });
//   });

module.exports = controller