
const Pessoa = require("../models/pessoa")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")
require("dotenv").config()
const segredo = process.env.JWT_TOKEN

const controller = {}

controller.getLoginPage = async (req, res) => {
    try {
        res.status(200).render("pessoas/login")
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.getRegisterPage = async (req, res) => {
    try {
        res.status(200).render("pessoas/form",{
            pessoa : new Pessoa()
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.getUpdatePage = async (req, res) => {
    const {pessoaId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error: "Pessoa não existe!"})

        }
                
        res.status(200).render("pessoas/edit",{
            pessoa : pessoa
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.logar = async (req,res,next) => {
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/form-login",
        failureFlash: true
    }
    
    )(req,res,next)
}

controller.logout = async (req,res,next) => {
    req.logout(function (err) {
        if (err) { 
            return next(err)
        }
        // req.flash('success_msg',"Você saiu!")
        res.redirect('/')
    })}


controller.login = async (req,res) => {
    const {username,password} = req.body

    try{
        const pessoa = await Pessoa.findOne({where:{username:username}})
        if(!pessoa){
            res.status(401).render("pages/error",{error: "Usuário ou senha incorreto(s)!"})
        }else{
            bcrypt.compare(password,pessoa.password).then((bateu)=>{
                if (!bateu){
                    res.status(401).render("pages/error",{error: "Usuário ou senha incorreto(s)!"+error})
                }else{
                    const token = jwt.sign({username:pessoa.username,id:pessoa.id,role:pessoa.role},segredo,{expiresIn:"300"})
                    console.log(token)
                    res.json({pessoa: pessoa,token:token,auth:true})
                }
            }).catch((error)=>{
                res.status(500).render("pages/error",{error: "Erro ao tentar logar!"+error})
            })
        }
    }catch(error){
        res.status(500).render("pages/error",{error: "Erro ao tentar logar!"+error})
    }
}

controller.getAll = async (req, res) => {
    try{
        const pessoas = await Pessoa.findAll({
        })
        res.status(200).render("pessoas/index",{
            pessoas:pessoas
        })
    }catch(error){
        res.status(500).render("pages/error",{error: "Erro ao buscar por pessoas!"})
    }
}

controller.getById = async (req, res) => {
    const {pessoaId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        
        if (!pessoa){
            return res.status(422).render("pages/error",{error: "Usuário não existe!"})
        }

        res.status(200).render("pessoas/show",{
            pessoa : pessoa
        })
    }catch(error){ 
        res.status(422).render("pages/error",{error: "Erro ao buscar usuário!"+error})
    }
}

controller.create = async (req, res) => {
    const {nome,username,password,role} = req.body

    try{
        const hashDaSenha = await bcrypt.hash(password, 10);
        const pessoa = await Pessoa.create({nome,username,password:hashDaSenha,role})
        res.status(200).redirect("/") 
    }catch(error){ 
        res.status(422).render("pages/error",{error: "Erro ao cadastar usuário!"+error})
    }
}

controller.update = async (req, res) => {
    const {pessoaId} = req.params
    const {nome} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            return res.status(422).render("pages/error",{error: "Usuário não existe!"})
        }

        pessoa.nome = nome
        await pessoa.save()
        
    }catch (error){
        return res.status(422).render("pages/error",{error: "Erro ao atualizar o usuário!"})
    }
}

controller.delete = async (req, res) => {
    const {pessoaId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        await pessoa.destroy()
        res.status(200).redirect("/pessoas")
    }catch (error){
        return res.status(422).render("pages/error",{error: "Erro ao remover o usuário!"})
    }
}

module.exports = controller