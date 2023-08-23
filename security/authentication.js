const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const Pessoa = require('../models/pessoa');

module.exports = function(passport){
    //função responsável por serializar o usuário e armazenar a 
    //informação necessária para identificá-lo posteriormente. 
    //Neste caso, o user.id é usado como identificador único
    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })

    //responsável por deserializar o usuário com base no 
    //identificador armazenado durante a serialização. Neste 
    //caso, o usuário é recuperado do banco de dados usando o id.
    passport.deserializeUser(async (id, done)=>{
        try{
            const user = await Pessoa.findByPk(id)
            done(null, user)
        }catch(erro){
            done(erro, user)
        }
    })

    passport.use(new localStrategy({
        usernameField:'username',
        passwordField:'password'
    },
    async (username,senha,done) => {
        try{
            const user = await Pessoa.findOne({
                raw: true,
                where: {
                    username: username
                }})

            if(!user){
                return done(null,false,{error:"Esta conta não existe"})
            }
    
            const eValido = await bcrypt.compare(senha, user.password)

            if(!eValido) return done(null, false, {error: "Senha incorreta!"})

            return done(null, user)
        } catch (erro){
            done(erro,false)
        }
    }))   
}