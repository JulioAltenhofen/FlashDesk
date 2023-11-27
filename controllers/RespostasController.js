const Pessoa = require("../models/pessoa")
const Ticket = require("../models/ticket")
const Respostas = require("../models/resposta")
const multer  = require('multer')
const moment = require('moment');

const controller = {}

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
  
controller.createResposta = async (req, res) => {

    upload.single('anexoResposta')(req, res, () => {
        const {resposta,statusResposta} = req.body
        const {ticketId} = req.params
        if (!req.file) {
          req.file = "null.png"
        }else{
          req.file.originalname
        }
        const nomeanexoResposta = req.file.originalname
        const dataResposta = new Date();
        const dataFormatadaResposta = moment(dataResposta).format('YYYY-MM-DD HH:mm:ss')
        
        try{
            Respostas.create({
              respostas:resposta,
              ticketId:ticketId,
              pessoaId:req.user.id,
              anexoResposta:nomeanexoResposta,
              dataResposta: dataFormatadaResposta,
              statusResposta:statusResposta
              })
            Ticket.update({status:statusResposta},{where:{id:ticketId}})  
            res.status(200).redirect("/") 
        }catch(error){ 
            res.status(422).render("pages/error",{error: "Erro ao criar ticket!"})
        }
    });
}

controller.reabrirTicket = async (req, res) => {
    const {pessoaId,ticketId} = req.params
    try{
        Ticket.update({status:"Reaberto"},{where:{id:ticketId}})  
        res.status(200).redirect(`/ticket/${pessoaId}`) 
    }catch(error){ 
        res.status(422).render("pages/error",{error: "Erro ao reabrir ticket!"+error})
    }
};

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

module.exports = controller