var baseURL = `http://192.168.15.11:3000`;
//var baseURL = `http://127.0.0.1:3000`;
const indexPage = 'index.html';
const imoveisPage = 'imoveis.html';
const imoveisSettingPage = 'imoveis_settings.html';
const loginPage = 'login.html';
const cadastroPage = 'cadastro.html';
const reservar = 'reservar.html'

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
            const camposObrigatorios = [
              { campo: cep, mensagem: 'Campo CEP é obrigatório!' },
              { campo: logradouro, mensagem: 'Campo logradouro é obrigatório!' },
              { campo: numero, mensagem: 'Campo número é obrigatório!' },
              { campo: bairro, mensagem: 'Campo bairro é obrigatório!' },
              { campo: cidade, mensagem: 'Campo cidade é obrigatório!' },
              { campo: estado, mensagem: 'Campo estado é obrigatório!' },
              { campo: preco, mensagem: 'Campo preço é obrigatório!' },
            ];
          
            for (let i = 0; i < camposObrigatorios.length; i++) {
              const campo = camposObrigatorios[i];
              if (!campo.campo.value || campo.campo.value.length === 0) {
                alert(campo.mensagem);
                campo.campo.focus();
                return;
              }
            }
          
            const disponibilidade = valorSelecionado === 'disponivel';
          
            axios.post(baseURL + `/imoveis`, {
              cep: cep.value,
              logradouro: logradouro.value,
              numero: parseInt(numero.value),
              bairro: bairro.value,
              localidade: cidade.value,
              estado: estado.value,
              uf: uf.value,
              preco: parseInt(preco.value),
              disponivel: disponibilidade,
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              document.location.href = imoveisPage;
            })
            .catch((error) => {
              alert(JSON.stringify(error.response.data, null, 2));
            });
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
    else if (document.title == 'Reservar') {
        const token = sessionStorage.getItem('token');
        const home = document.getElementById('home');
        const enderecoReserva = document.getElementById('enderecoReserva');
        const precoReserva = document.getElementById('precoReserva');
        const cidadeReserva = document.getElementById('cidadeReserva');
        const imovelId = sessionStorage.getItem('imovelId');
        const subMenuSair = document.getElementById('subMenuSair');
        const subMenuImoveis = document.getElementById('subMenuImoveis');
        const reservar = document.getElementById('reservar');

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
            document.location.href = loginPage;
        });

        if (imovelId) {
            axios.post(baseURL + `/imoveis/id`, {
                id_imovel: imovelId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                enderecoReserva.innerHTML = `<p>${response.data.logradouro}, ${response.data.numero} <br> ${response.data.bairro}</p>`;
                precoReserva.innerHTML = `<sup>R$</sup>${response.data.preco}/dia`;
                cidadeReserva.innerText = `${response.data.localidade} - ${response.data.uf}`;
                disableDatesEntrada(response.data, imovelId, token);
            })
            .catch(error =>{
            });
        }

        reservar.onclick = function() {
            // Obtém a data de entrada selecionada
            const entradaSelecionada = $('#dataEntradaReserva').datepicker('getDate');
            const saidaSelecionada = $('#dataSaidaReserva').datepicker('getDate');

            // Verifica se as datas foram selecionadas
            if (!entradaSelecionada || !saidaSelecionada) {
                alert("Por favor, selecione as datas de entrada e saída.");
                return;
            }

            // Converte as datas para o formato ISO 8601
            const formattedEntrada = entradaSelecionada.toISOString();
            const formattedSaida = saidaSelecionada.toISOString();

            console.log(imovelId);
            axios.post(baseURL + `/reservas`, {
                id_imovel: imovelId,
                data_entrada: formattedEntrada,
                data_saida: formattedSaida
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                document.location.href = indexPage;
            })
            .catch(error =>{
                alert(JSON.stringify(error.response.data, null, 2));
            });
        }

        home.onclick = function() {
            document.location.href = indexPage;
        }

        subMenuImoveis.onclick = function() {
            document.location.href = imoveisPage;
        }

        subMenuSair.onclick = function() {
            sessionStorage.removeItem('token');
            document.location.href = indexPage;
        }
    }
}

function disableDatesEntrada(axiosData) {
    const imovel = axiosData;
    const intervals = [];

    if (imovel.ReservaTemporada && imovel.ReservaTemporada.length > 0) {
        imovel.ReservaTemporada.forEach(reserva => {
            const entrada = new Date(reserva.data_entrada);
            const saida = new Date(reserva.data_saida);

            // Adiciona 1 dia nas datas
            entrada.setDate(entrada.getDate() + 1);
            saida.setDate(saida.getDate() + 1);

            const start = entrada.toISOString().split('T')[0];
            const end = saida.toISOString().split('T')[0];

            intervals.push({ start, end });
        });
        intervals.sort((a, b) => new Date(a.start) - new Date(b.start));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let disabledDates = [];
    intervals.forEach(interval => {
        const start = new Date(interval.start);
        const end = new Date(interval.end);
        
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        disabledDates = disabledDates.concat(getDatesInRange(start, end));
    });

    function getDatesInRange(start, end) {
        const dates = [];
        let currentDate = new Date(start);
        end = new Date(end);
        currentDate.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    $('#dataEntradaReserva').datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        todayHighlight: true,
        autoclose: true,
        beforeShowDay: function (date) {
            const currentDate = new Date(date);
            currentDate.setHours(0, 0, 0, 0);
    
            if (currentDate.getTime() < today.getTime()) {
                return { enabled: false, classes: 'text-muted', tooltip: 'Data indisponível' };
            }
    
            const isReserved = disabledDates.some(d => d.getTime() === currentDate.getTime());
    
            if (isReserved) {
                return { 
                    enabled: false, 
                    classes: 'reserved-date', 
                    tooltip: 'Data reservada' 
                };
            }
    
            return { enabled: true };
        }
    });    

    $('#dataEntradaReserva').on('changeDate', function(e) {
        const entradaSelecionada = e.date; 
        const dataSaida = new Date(entradaSelecionada);
        dataSaida.setDate(dataSaida.getDate() + 1); 

        $('#dataSaidaReserva').datepicker('setStartDate', dataSaida);
        $('#dataSaidaReserva').datepicker('setDate', dataSaida);
        $('#dataSaidaReserva').prop('disabled', false);
    });

    $('#dataSaidaReserva').datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        todayHighlight: true,
        autoclose: true,
        beforeShowDay: function (date) {
            const selectedEntradaDate = $('#dataEntradaReserva').datepicker('getDate');
            const isReserved = disabledDates.some(d => d.getTime() === date.getTime());
    
            if (selectedEntradaDate) {
                const minSaidaDate = new Date(selectedEntradaDate);
                minSaidaDate.setDate(minSaidaDate.getDate() + 1);
    
                // Desabilita datas anteriores à data mínima de saída
                if (date < minSaidaDate) {
                    return { 
                        enabled: false, 
                        classes: 'text-muted', 
                        tooltip: 'Data de saída deve ser depois da data de entrada.' 
                    };
                }
    
                // Verifica a última data de reserva e a próxima reserva
                let lastReservedEnd = null;
                let nextReservedStart = null;
    
                intervals.forEach(interval => {
                    const start = new Date(interval.start);
                    const end = new Date(interval.end);
    
                    if (!lastReservedEnd || end > lastReservedEnd) {
                        lastReservedEnd = end; // Última data de saída
                    }
    
                    if (!nextReservedStart && start > selectedEntradaDate) {
                        nextReservedStart = start; // Próxima data de entrada
                    }
                });
    
                // Desabilita a saída se coincidir ou passar a próxima reserva
                if (nextReservedStart && date >= nextReservedStart) {
                    return { 
                        enabled: false, 
                        classes: 'text-muted', 
                        tooltip: 'Data de saída deve ser antes da próxima data reservada.' 
                    };
                }
    
                // Habilita todas as datas após a última reserva
                if (selectedEntradaDate > lastReservedEnd) {
                    return true;
                }
            }
    
            // Aplica a classe personalizada para reservas
            if (isReserved) {
                return { 
                    enabled: false, 
                    classes: 'reserved-date', 
                    tooltip: 'Data reservada' 
                };
            }
    
            return { enabled: true }; // Data habilitada
        }
    });    
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
        sessionStorage.setItem('imovelId', card.dataset.id);
        document.location.href = reservar;
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
        sessionStorage.setItem('imovelId', card.dataset.id);
        document.location.href = imoveisSettingPage;
      });
  
      fragment.appendChild(card);
    });
  
    cardsImoveis.appendChild(fragment);
  }