const Pessoa = require("../models/pessoa")
const Ticket = require("../models/ticket")
const Respostas = require("../models/resposta")
const multer  = require('multer')
const moment = require('moment');
const e = require("express");
const sequelize = require("sequelize");


const controller = {}

controller.getRegisterPage = async (req, res) => {
    
    const {pessoaId} = req.params

    try {
        res.status(200).render("ticket/form",{
            pessoaId : pessoaId,
            tickets : []
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

controller.getAllAdmin = async (req, res) => {
    try{
        const ticket = await Ticket.findAll({include: [
            {
                model: Pessoa,
                attributes: ['id', 'nome']
            }
        ]})

        
        
        res.status(200).render("ticket/indexADM",{
            ticket : ticket,
            // pessoa : pessoa,
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
      || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.mimetype === 'video/mp4'   ) {
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
            req.file.filename
        }
        const anexo = req.file.filename;
        const nomeanexo = req.file.originalname
        const data = new Date();
        const dataFormatada = moment(data).format('YYYY-MM-DD HH:mm:ss')
        const status = "Enviado"

        try{
            
            Ticket.create({
                titulo:title,
                campoTexto:campoTexto,
                urgencia:urgencia,
                pessoaId:pessoaId,
                anexo: anexo,
                nomeanexo:nomeanexo,
                data: dataFormatada,
                status: status})
            res.status(200).render("pages/success") 
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

const fs = require('fs');
const path = require('path');

controller.getAnexo = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        
        if (!ticket) {
            return res.status(404).send("Ticket não encontrado");
        }

        const anexoPath = path.join(__dirname, `../public/upload/${ticket.anexo}`);
        
        const fileStream = fs.createReadStream(anexoPath);

        const fileFormat = ticket.anexo.split('.').pop().toLowerCase();
        if (fileFormat === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${ticket.anexo}`);
        } else if (fileFormat === 'doc' || fileFormat === 'docx') {
            res.setHeader('Content-Type', 'application/doc');
            res.setHeader('Content-Disposition', `attachment; filename=${ticket.anexo}`);
        } else if (fileFormat === 'xls' || fileFormat === 'xlsx') {
            res.setHeader('Content-Type', 'application/xlsx');
            res.setHeader('Content-Disposition', `attachment; filename=${ticket.anexo}`);
        } else if (fileFormat === 'png' || fileFormat === 'jpg' || fileFormat === 'jpeg') {
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `inline; filename=${ticket.anexo}`);
        } else if (fileFormat === 'mp4' || fileFormat === 'avi' || fileFormat === 'mkv') {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', `inline; filename=${ticket.anexo}`);
        }        
        fileStream.pipe(res);
        
    } catch (error) {
        res.status(500).send("Erro ao buscar o anexo");
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

controller.getBaseConhecimento = async (req, res) => {
    
    const { termoDeBusca } = req.params;
   
    try {
        const tickets = await Ticket.findAll({
            where: { titulo: { [sequelize.Op.like]: `%${termoDeBusca}%` } }
        });

        res.status(200).json(tickets);
            
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Erro ao exibir os tickets" + error });
    }
};

controller.getByIdSugestao = async (req, res) => {
    const {ticketId} = req.params

    try{
        
        const ticket = await Ticket.findByPk(ticketId,{
            include: [
                {
                    model: Respostas,
                    // include: [
                    //     {
                    //         model: Pessoa, 
                          
                    //     },
                    // ],
                },
            ],
        })
        
        if (!ticket) {
            return res.status(500).render("pages/error",{error : "ticket não existe!"})
        }
        
        res.status(200).render("ticket/baseConhecimento",{
            ticket : ticket,
            moment : moment,
            // pessoa: pessoa
        })
    }catch(error){
        res.status(500).render("pages/error",{error : "Erro ao exibir o ticket" + error})
    }
    
}



module.exports = controller