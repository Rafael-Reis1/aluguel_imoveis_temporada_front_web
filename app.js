var baseURL = `http://127.0.0.1:3000`;
const indexPage = 'index.html';
const imoveisPage = 'imoveis.html';
const imoveisSettingPage = 'imoveis_settings.html';
const loginPage = 'login.html';
const cadastroPage = 'cadastro.html';

window.onload = function() {
    if (document.title == 'Login') {
        const entrar = document.getElementById('entrar');
        const email = document.getElementById('email');
        const senha = document.getElementById('senha');

        email.onkeydown = function(e) {
            if (e.key === 'Enter' || e.code === 13) {
                login(email, senha);
            }
        }

        senha.onkeydown = function(e) {
            if (e.key === 'Enter' || e.code === 13) {
                login(email, senha);
            }
        }

        entrar.onclick = function() {
            login(email, senha);
        }
    }
    else if (document.title == 'cadastro') {
        const cadastrar = document.getElementById('cadastrar');
        const nome = document.getElementById('nome');
        const emailCadastro = document.getElementById('emailCadastro');
        const senhaCadastro = document.getElementById('senhaCadastro');

        nome.onkeydown = function(e) {
            if (e.key === 'Enter' || e.code === 13) {
                cadastro(nome, emailCadastro, senhaCadastro);
            }
        }

        emailCadastro.onkeydown = function(e) {
            if (e.key === 'Enter' || e.code === 13) {
                cadastro(nome, emailCadastro, senhaCadastro);
            }
        }

        senhaCadastro.onkeydown = function(e) {
            if (e.key === 'Enter' || e.code === 13) {
                cadastro(nome, emailCadastro, senhaCadastro);
            }
        }

        cadastrar.onclick = function() {
            cadastro(nome, emailCadastro, senhaCadastro);
        }
    }
    else if (document.title == 'Home') {
        const login = document.getElementById('irLogin');
        const cadastrar = document.getElementById('irCadastro');
        const usuario = document.getElementById('usuario');
        const nomeUsuario = document.getElementById('nomeUsuario');
        const token = sessionStorage.getItem('token');
        const subMenuSair = document.getElementById('subMenuSair');
        const subMenuImoveis = document.getElementById('subMenuImoveis');

        axios.get(baseURL + `/usuarios/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        })
        .then(response => {
            usuario.style.display = 'block';
            nomeUsuario.innerText = response.data.nome;
        })
        .catch(error =>{
            login.style.display = 'block';
            cadastrar.style.display = 'block';
        });

        login.onclick = function() {
            document.location.href = loginPage;
        }

        cadastrar.onclick = function() {
            document.location.href = cadastroPage;
        }

        subMenuSair.onclick = function() {
            sessionStorage.removeItem('token');
            location.reload(true);
        }

        subMenuImoveis.onclick = function() {
            document.location.href = imoveisPage;
        }

        axios.get(baseURL + `/imoveis/public`)
        .then(response => {
            criaCard(response.data);
        })
        .catch(error =>{
        });
    }
    else if (document.title == 'imóveis') {
        const token = sessionStorage.getItem('token');
        const subMenuSair = document.getElementById('subMenuSair');
        const home = document.getElementById('home');
        const novoImovel = document.getElementById('novoImovel');
        const usuario = document.getElementById('usuario');
        const nomeUsuario = document.getElementById('nomeUsuario');

        axios.get(baseURL + `/usuarios/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            usuario.style.display = 'block';
            nomeUsuario.innerText = response.data.nome;
        })
        .catch(error =>{
            sessionStorage.removeItem('token');
            document.location.href = indexPage;
        });

        subMenuSair.onclick = function() {
            sessionStorage.removeItem('token');
            document.location.href = indexPage;
        }

        home.onclick = function() {
            document.location.href = indexPage;
        }

        novoImovel.onclick = function() {
            document.location.href = imoveisSettingPage;
            sessionStorage.removeItem('imovelId');
        }

        axios.get(baseURL + `/imoveis`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            criaCardSetting(response.data);
        })
        .catch(error =>{
        });
    }
    else if (document.title == 'imóveis settings') {
        const token = sessionStorage.getItem('token');
        const imovelId = sessionStorage.getItem('imovelId');
        const home = document.getElementById('home');
        const subMenuSair = document.getElementById('subMenuSair');
        const subMenuImoveis = document.getElementById('subMenuImoveis');
        const usuario = document.getElementById('usuario');
        const nomeUsuario = document.getElementById('nomeUsuario');
        const cep = document.getElementById('cep');
        const logradouro = document.getElementById('logradouro');
        const bairro = document.getElementById('bairro');
        const cidade = document.getElementById('cidade');
        const estado = document.getElementById('estado');
        const uf = document.getElementById('uf');
        const numero = document.getElementById('numero');
        const preco = document.getElementById('preco');
        const select = document.getElementById('disponibilidade');
        let valorSelecionado;
        const salvarImovel = document.getElementById('salvarImovel');
        const atualizarImovel = document.getElementById('atualizarImovel');

        axios.get(baseURL + `/usuarios/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            usuario.style.display = 'block';
            nomeUsuario.innerText = response.data.nome;
        })
        .catch(error =>{
            sessionStorage.removeItem('token');
            document.location.href = indexPage;
        });

        if (imovelId) {
            salvarImovel.style.display = 'none';
            atualizarImovel.style.display = 'block'

            axios.post(baseURL + `/imoveis/id`, {
                id_imovel: imovelId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                cep.value = response.data.cep;
                logradouro.value = response.data.logradouro;
                numero.value = response.data.numero;
                bairro.value = response.data.bairro;
                cidade.value = response.data.localidade;
                estado.value = response.data.estado;
                uf.value = response.data.uf;
                preco.value = response.data.preco;
                if (response.data.disponivel) {
                    select.value = 'disponivel';
                }
                else {
                    select.value = 'indisponivel';
                }
            })
            .catch(error =>{
            });
        }

        subMenuSair.onclick = function() {
            sessionStorage.removeItem('token');
            document.location.href = indexPage;
        }

        home.onclick = function() {
            document.location.href = indexPage;
        }

        subMenuImoveis.onclick = function() {
            document.location.href = imoveisPage;
        }

        numero.onblur = function() {
            if (numero.value != '') {
                preco.focus();
            }
        }

        select.onchange = function() {
            const indice = select.selectedIndex;
            valorSelecionado = select.options[indice].value;
        }

        salvarImovel.onclick = function() {
            if (cep.value.length == 8) {
                if (logradouro) {
                    if (numero) {
                        if (bairro) {
                            if (cidade) {
                                if (estado) {
                                    if (preco) {
                                        if (valorSelecionado == 'disponivel') {
                                            disponibilidade = true;
                                        }
                                        else {
                                            disponibilidade = false;
                                        }

                                        axios.post(baseURL + `/imoveis`, {
                                            cep: cep.value,
                                            logradouro: logradouro.value,
                                            numero: parseInt(numero.value),
                                            bairro: bairro.value,
                                            localidade: cidade.value,
                                            estado: estado.value,
                                            uf: uf.value,
                                            preco: parseInt(preco.value),
                                            disponivel: disponibilidade
                                        }, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        })
                                        .then(response => {
                                            document.location.href = imoveisPage;
                                        })
                                        .catch(error =>{
                                            alert(JSON.stringify(error.response.data, null, 2));
                                        });
                                    }
                                    else {
                                        alert('Campo preço é obrigatório!');
                                        preco.focus();
                                    }
                                }
                                else {
                                    alert('Campo estado é obrigatório!');
                                    estado.focus();
                                }
                            }
                            else {
                                alert('Campo cidade é obrigatório!');
                                cidade.focus();
                            }
                        }
                        else {
                            alert('Campo bairro é obrigatório!');
                            bairro.focus();
                        }
                    }
                    else {
                        alert('Campo número é obrigatório!');
                        numero.focus();
                    }
                }
                else {
                    alert('Campo logradouro é obrigatório!');
                    logradouro.focus();
                }
            }
            else {
                alert('Campo cep é obrigatório!');
                cep.focus();
            }
        }

        atualizarImovel.onclick = function() {
            if (cep.value.length == 8) {
                if (logradouro) {
                    if (numero) {
                        if (bairro) {
                            if (cidade) {
                                if (estado) {
                                    if (preco) {
                                        if (valorSelecionado == 'disponivel') {
                                            disponibilidade = true;
                                        }
                                        else {
                                            disponibilidade = false;
                                        }

                                        axios.put(baseURL + `/imoveis/atualiza-imovel`, {
                                            id_imovel: imovelId,
                                            cep: cep.value,
                                            logradouro: logradouro.value,
                                            numero: parseInt(numero.value),
                                            bairro: bairro.value,
                                            localidade: cidade.value,
                                            estado: estado.value,
                                            uf: uf.value,
                                            preco: parseInt(preco.value),
                                            disponivel: disponibilidade
                                        }, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        })
                                        .then(response => {
                                            document.location.href = imoveisPage;
                                        })
                                        .catch(error =>{
                                            alert(JSON.stringify(error.response.data, null, 2));
                                        });
                                    }
                                    else {
                                        alert('Campo preço é obrigatório!');
                                        preco.focus();
                                    }
                                }
                                else {
                                    alert('Campo estado é obrigatório!');
                                    estado.focus();
                                }
                            }
                            else {
                                alert('Campo cidade é obrigatório!');
                                cidade.focus();
                            }
                        }
                        else {
                            alert('Campo bairro é obrigatório!');
                            bairro.focus();
                        }
                    }
                    else {
                        alert('Campo número é obrigatório!');
                        numero.focus();
                    }
                }
                else {
                    alert('Campo logradouro é obrigatório!');
                    logradouro.focus();
                }
            }
            else {
                alert('Campo cep é obrigatório!');
                cep.focus();
            }
        }

        cep.onblur = function() {
            if (cep) {
                axios.get(`https://viacep.com.br/ws/${cep.value}/json/`)
                .then(response => {
                    logradouro.value = response.data.logradouro;
                    bairro.value = response.data.bairro;
                    cidade.value = response.data.localidade;
                    estado.value = response.data.estado;
                    uf.value = response.data.uf;
                    numero.focus();
                })
                .catch(error =>{
                    logradouro.value = '';
                    bairro.value = '';
                    cidade.value = '';
                    estado.value = '';
                    uf.value = '';
                    numero.value = '';
                });
            }
        }
    }
}

function login(email, senha){
    if (email.value) {
        if (senha.value) {
            axios.post(baseURL + `/login`, {
                email: email.value,
                password: senha.value
            })
            .then(response => {
                sessionStorage.setItem('token', response.data.access_token);
                document.location.href = indexPage;
            })
            .catch(error =>{
                alert(error);
            });
        }
        else {
            alert("Campo senha é obrigatório");
            senha.focus();
        }
    }
    else {
        alert("Campo email é obrigatório");
        email.focus();
    }
}

function cadastro(nome, emailCadastro, senhaCadastro) {
    if (nome.value) {
        if (emailCadastro.value) {
            if (senhaCadastro.value) {
                axios.post(baseURL + `/usuarios`, {
                    email: emailCadastro.value,
                    senha: senhaCadastro.value,
                    nome: nome.value
                })
                .then(response => {
                    axios.post(baseURL + `/login`, {
                        email: emailCadastro.value,
                        password: senhaCadastro.value,
                    })
                    .then(response => {
                        sessionStorage.setItem('token', response.data.access_token);
                        document.location.href = indexPage;
                    })
                    .catch(error =>{
                        alert(error)
                    });
                })
                .catch(error =>{
                    alert(JSON.stringify(error.response.data, null, 2));
                });
            }
            else {
                alert("Campo senha é obrigatório");
                senhaCadastro.focus();
            }
        }
        else {
            alert("Campo email é obrigatório");
            emailCadastro.focus();
        }
    }
    else {
        alert("Campo nome é obrigatório");
        nome.focus();
    }
}

function criaCard(dados) {
    const cardsImoveis = document.getElementById('cardsImoveis');
    cardsImoveis.innerHTML = '';
  
    const fragment = document.createDocumentFragment();
  
    dados.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('cardImovel');
      card.dataset.id = item.id_imovel;
  
      card.innerHTML = `
        <img src="drawables/ImagePlaceholder.png" alt="Imagem do imóvel">
        <div class="cardDetails">
          <p class="location">${item.logradouro}, ${item.numero} - ${item.bairro}</p>
          <p class="price">R$${item.preco}/dia</p>
        </div>
      `;
  
      card.addEventListener('click', () => {
        // Ação de click aqui
        sessionStorage.setItem('imovelId', card.dataset.id);
        // Abre a página de detalhes do imóvel, por exemplo
      });
  
      fragment.appendChild(card);
    });
  
    cardsImoveis.appendChild(fragment);
  }
  

  function criaCardSetting(dados) {
    const cardsImoveis = document.getElementById('cardsImoveis');
    cardsImoveis.innerHTML = '';
  
    const fragment = document.createDocumentFragment();
  
    dados.forEach(item => {
      const card = document.createElement('div');
      let disponibilidade;
      card.classList.add('cardImovel');
      card.dataset.id = item.id_imovel;

      if (item.disponivel == false) {
        disponibilidade = `<span style="background-color: red; color: white; font-family: Inter; font-size: 1rem; text-align: center; padding: 0.3125rem 0 0.3125rem 0; border-radius: 8px;">Indisponível</span>`; 
      }
      else{
        disponibilidade = `<span style="background-color: green; color: white; font-family: Inter; font-size: 1rem; text-align: center; padding: 0.3125rem 0 0.3125rem 0; border-radius: 8px;">Disponível</span>`;
      }
  
      card.innerHTML = `
        <img src="drawables/ImagePlaceholder.png" alt="Imagem do imóvel">
        <div class="cardDetails">
          <p class="location">${item.logradouro}, ${item.numero} - ${item.bairro}</p>
          <p class="price">R$${item.preco}/dia</p>
          ${disponibilidade}
        </div>
      `;
  
      card.addEventListener('click', () => {
        // Ação de click aqui
        sessionStorage.setItem('imovelId', card.dataset.id);
        document.location.href = imoveisSettingPage;
        // Abre a página de detalhes do imóvel, por exemplo
      });
  
      fragment.appendChild(card);
    });
  
    cardsImoveis.appendChild(fragment);
  }