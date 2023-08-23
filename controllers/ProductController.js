const Product = require('../models/product');
const controller = {}
const Cor = require("../models/cor")


controller.getRegisterPage = async (req, res) => {
    try {
        const cores = await Cor.findAll()
        res.status(200).render("produtos/form",{
            cores : cores,
            produto : new Product(),
            method : "POST"
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.getUpdatePage = async (req, res) => {
    const {produtoId} = req.params
    try {
        const produto = await Product.findByPk(produtoId, {
            include: [
                {
                    model: Cor,
                    through: "produtoCor",
                },
            ],
        })

        if (!produto) {
            return res.status(422).render("pages/error",{error: "Produto não existe!"})
        }
        console.log(produto)
        const cores = await Cor.findAll()
        res.status(200).render("produtos/edit",{
            cores : cores,
            produto : produto
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}



controller.getAll = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: Cor
        })
        //res.status(200).json(products)
        res.status(200).render("produtos/index",{produtos: products})
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar a página!"})
    }
}

//falta implementar front-end
controller.getById = async (req, res) => {
    const { produtoId } = req.params
    try {
        const product = await Product.findByPk(produtoId, {
            include: [
                {
                    model: Cor,
                    through: "produtoCor",
                },
            ],
        })

        if (!product) {
            return res.status(422).render("pages/error",{error: "Produto não existe!"})
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao buscar o produto!"})
    }
}

controller.create = async (req, res) => {
    const { descricao, preco, coresIds } = req.body
    let produto = {}
    const coresBD = await Cor.findAll()

    try {
        const cores = await Cor.findAll({ where: { id: coresIds } });

        produto = await Product.create({ descricao, preco })

        await produto.addCors(cores);

        res.status(200).redirect("/produtos")
    } catch (error) {
        res.status(422).render("produtos/form",
        {
            produto: { ...produto,error}, //criando uma cópia de produto para a página que será chamada
            cores : coresBD
        })
    }

}

controller.update = async (req, res) => {
    const { produtoId } = req.params
    const { descricao, preco, coresIds } = req.body
    try {
        const produto = await Product.findByPk(produtoId)

        if (!produto) {
            return res.status(500).render("pages/error",{error: "Produto não existe!"})
        }

        if (descricao) {
            produto.descricao = descricao
        }
        if (preco) {
            produto.preco = preco
        }
        await produto.save()

        if (coresIds && coresIds.length > 0) {
            const cores = await Cor.findAll({ where: { id: coresIds } });
            await produto.setCors(cores);
        }

        res.status(200).redirect("/produtos")
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao atualizar o produto!"})
    }
}

controller.delete = async (req, res) => {
    const { produtoId } = req.params
    try {
        const produto = await Product.findByPk(produtoId)

        if (!produto) {
            res.status(422).send("Produto não existe!")
        }

        await produto.destroy()

        res.status(200).redirect("/produtos")
    } catch (error) {
        res.status(422).render("pages/error",{error: "Não foi possível remover o produto"})
    }
}

module.exports = controller