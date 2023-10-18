
const PessoasService = {
    login: async (username, password) => {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        localStorage.setItem('pessoa', JSON.stringify(data.pessoa));
        localStorage.setItem('token', data.token);
        return data.pessoa.id
    }
}

const handleSubmit = async (evt) => {
    evt.preventDefault();
    const username = evt.target.elements.username.value;
    const password = evt.target.elements.password.value;
    console.log(username, password)
    try {
        const pessoaId = await PessoasService.login(username, password);
    } catch (error) {
        console.log(error)
    }
}


// Função para recuperar o token JWT do LocalStorage
function getToken() {
    return localStorage.getItem('token');
}

function enviarRequisicaoComToken(url, metodo, dados) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return fetch(url, {
      method: metodo,
      headers: headers,
      body: JSON.stringify(dados)
    }).then(response => response.json());
  }