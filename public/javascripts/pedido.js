const produtos = []

const adicionarAoCarrinho = async (event,produtoId,corId) =>{
    event.preventDefault()

    const corSelecionada = document.querySelector('input[name="coresIds[' + produtoId + ']"]:checked').getAttribute('data-cor');

    event.target.innerText = 'Adicionado'; 
    event.target.classList.remove('is-success');
    event.target.classList.add('is-disabled'); 
    event.target.style.pointerEvents = 'none'

    const produto = {produtoId,corSelecionada}
    console.log(produto)
    produtos.push(produto)
    
    const finalizarPedidoBtn = document.getElementById('finalizarPedido');
    finalizarPedidoBtn.style.display = 'block';
}

const finalizarPedido = async (event) =>{
    event.preventDefault()

    try {
        let body = JSON.stringify({
            valor: 0,
            status: "",
            produtosPedido: produtos
        })
        let resposta = await fetch("/pedidos/1",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body : body
        })
        
        let pedidoId = await resposta.json()
        alert(`Pedido nº ${pedidoId} efetuado com sucesso!`)
        window.location.href = `/pedidos/1/${pedidoId}`
        
    } catch (error) {
        alert('Erro ao finalizar o pedido:', error)
        console.log(error)
    }
}