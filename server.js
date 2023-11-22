const express = require("express")
const routes = require("./routes/routes")
const path = require("path")
const methodOverride = require('method-override');
require("./config/associations")
var session = require("express-session")
const passport = require("passport")
require("./security/authentication")(passport)
const flash = require('express-flash');


const server = express()
const PORT = 3000

server.use(session({
    secret: "V3r7r9$7q0d&p1!2$@PwC$3s8LpV",  //Chave secreta utilizada para assinar as sessões, garantindo a integridade e segurança das mesmas   
    resave: false, //Determina se a sessão deve ser regravada no armazenamento, mesmo que não tenha sido modificada
    saveUninitialized: true, //Define se a sessão deve ser salva no armazenamento, mesmo que não tenha sido modificada
    cookie: { maxAge: 10 * 60 * 1000 } //Define as configurações do cookie de sessão. maxAge está definido como 2 minutos (2 * 60 * 1000 milissegundos), especificando o tempo máximo de vida do cookie antes de expirar
}))
server.use(passport.initialize())
server.use(passport.session())

server.use((req,res, next) => {
    res.locals.user = req.user || null
    next()
})

// const upload = multer({ storage: storage });

//criando um middleware para que substitua requisições POST ou GET por outras quando a URL possui "_method"
server.use(methodOverride("_method",{methods:["POST","GET"]}));

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(routes)

//avisando o express sobre um repositório estático no projeto
server.use(express.static(path.join(__dirname,"public")))

server.use(express.static("public"))

server.use(session({
    secret: '"V3r7r9$7q0d&p1!2$@PwC$3s8LpV"',
    resave: false,
    saveUninitialized: true
  }));

  server.use(flash());


//avisando o express do local das views
server.set("views", path.join(__dirname,"views"))
//setando a engine utilizada para visualização: EJS
server.set("view engine","ejs")

server.listen(PORT,()=>{
    console.log("Servidor executando na porta "+PORT)
})