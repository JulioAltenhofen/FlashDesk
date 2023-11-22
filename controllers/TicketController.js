const Pessoa = require("../models/pessoa")
const Ticket = require("../models/ticket")
const Respostas = require("../models/resposta")
const multer  = require('multer')
const moment = require('moment');
const e = require("express");


const controller = {}

controller.getRegisterPage = async (req, res) => {
 
    const {pessoaId} = req.params

    try {
        res.status(200).render("ticket/form",{
            pessoaId : pessoaId
            // ticket : new Ticket()
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
                    model: Ticket
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

        res.status(200).render("ticket/edit",{
            ticket : ticket
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"+error})
    }
}

controller.getAll = async (req, res) => {
    const {pessoaId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Ticket,
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        
        
        res.status(200).render("ticket/index",{
            ticket : pessoa.tickets,
            pessoa : pessoa,
            moment : moment
            
        })
    }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir os tickets"+error})

    }
}

controller.getById = async (req, res) => {
    const {pessoaId,ticketId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Ticket,
                    include: [
                        {
                            model: Respostas
                        }
                    ],
                    
                }
            ],
        })

        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const ticket = await Ticket.findByPk(ticketId,{
            include: [
                {
                    model: Respostas,
                    include: [
                        {
                            model: Pessoa, 
                          
                        },
                    ],
                },
            ],
            where: {
                pessoaId:pessoaId
              }
        })
        
        if (!ticket) {
            return res.status(500).render("pages/error",{error : "ticket não existe!"})
        }
        
        res.status(200).render("ticket/show",{
            ticket : ticket,
            pessoa : pessoa,
            moment : moment
        })
    }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir o ticket" + error})
    }
    
}

function makeid (length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  
  const DIR = './public/upload/'
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-')
      cb(null, makeid(16) + '_' + fileName)
    }
  })
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/png' 
      || file.mimetype === 'application/pdf'
      || file.mimetype === 'image/jpeg' 
      || file.mimetype === 'image/jpg' 
      || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'   ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Apenas os formatos .png, .pdf, .doc, .xls .jpeg estão permitidos!'))
      }
    }
  })
  
controller.create = async (req, res) => {

    upload.single('anexo')(req, res, () => {
        const {title,campoTexto,urgencia} = req.body
        const {pessoaId} = req.params
        if (!req.file) {
            req.file = "null.png"
        }else{
            req.file.originalname
        }
        const data = new Date();
        const dataFormatada = moment(data).format('YYYY-MM-DD HH:mm:ss')
        const status = "Enviado"

        try{
            Ticket.create({
                titulo:title,
                campoTexto:campoTexto,
                urgencia:urgencia,
                pessoaId:pessoaId,
                anexo:req.file.orinalname,
                data: dataFormatada,
                status: status})
            res.status(200).redirect("/") 
        }catch(error){ 
            res.status(422).render("pages/error",{error: "Erro ao criar ticket!"})
        }
    });
}

controller.update = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    const {status} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Ticket,
                    include: [
                        {
                            model: Respostas
                        },
                    ],
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
        
        res.status(200).redirect(`/ticket/${pessoaId}`)
    }catch (error){
        res.status(500).render("pages/error",{error : "Erro ao atualizar o ticket!"+error})
    }
}


controller.delete = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        const ticket = await Ticket.findByPk(ticketId)

        if (!ticket){
            res.status(422).send("ticket não existe!")
        }

       
        await ticket.destroy({
            where: {
                id: ticketId, // ou outra condição que você queira usar para a exclusão
            },
        });

        res.status(200).redirect(`/ticket/${pessoaId}`);
    } catch (error) {
        res.status(422).render("pages/error", {
            error: "Não foi possível remover o ticket" + error,
        });
    }
};

controller.getAllAdmin = async (req, res) => {
    try{       
        res.status(200).render("ticket/indexADM",{
            ticket : Ticket,
            moment : moment
            
        })
    }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir os tickets"+error})

    }
}

controller.getBaseConhecimento = async (req, res) => {
    
    try{
        await Ticket.findByPk(ticketId,{
            include: [
                {
                    model: Ticket
                },
            ],
    });
        const termoBusca = req.body(titulo);
        const resultados = dados.filter(item =>
            item.titulo.toLowerCase().includes(termoBusca.toLowerCase())
        );
        res.status(200).render('baseConhecimento', {resultados});
      }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir os tickets"+error})
      };
    }

module.exports = controller