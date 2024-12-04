//const baseURL = `http://192.168.181.175:3000`;
const baseURL = `http://127.0.0.1:3000`;
const indexPage = '/';
const imoveisPage = 'imoveis.html';
const imoveisSettingPage = 'imoveis_settings.html';
const loginPage = 'login.html';
const cadastroPage = 'cadastro.html';
const reservar = 'reservar.html'
const reservas = 'reservas.html'

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

        headers();

        axios.get(baseURL + `/imoveis/public`)
        .then(response => {
            criaCard(response.data);
        })
        .catch(error =>{
        });
    }
    else if (document.title == 'imóveis') {
        const token = localStorage.getItem('token');
        const novoImovel = document.getElementById('novoImovel');

        headers();

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
        const token = localStorage.getItem('token');
        const imovelId = sessionStorage.getItem('imovelId');
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

        headers();

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
                const indice = select.selectedIndex;
                valorSelecionado = select.options[indice].value;

                populateTable(response.data.ReservaTemporada, false)
            })
            .catch(error =>{
            });
        }
        else {
            select.value = 'disponivel';
            const indice = select.selectedIndex;
            valorSelecionado = select.options[indice].value;
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

        cep.onblur = function() {
            if (cep.value) {
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
            else {
                logradouro.value = '';
                bairro.value = '';
                cidade.value = '';
                estado.value = '';
                uf.value = '';
                numero.value = '';
            }
        }
    }
    else if (document.title == 'Reservar') {
        const token = localStorage.getItem('token');
        const enderecoReserva = document.getElementById('enderecoReserva');
        const precoReserva = document.getElementById('precoReserva');
        const cidadeReserva = document.getElementById('cidadeReserva');
        const imovelId = sessionStorage.getItem('imovelId');
        const reservar = document.getElementById('reservar');

        headers();

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
    }
    else if (document.title == 'Reservas') {
        const token = localStorage.getItem('token');

        headers();

        axios.get(baseURL + `/reservas`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            populateTable(response.data, true);
        })
        .catch(error =>{
        });
    }
}

function headers() {
    const usuario = document.getElementById('usuario');
    const nomeUsuario = document.getElementById('nomeUsuario');
    const subMenuSair = document.getElementById('subMenuSair');
    const home = document.getElementById('home');
    const subMenuImoveis = document.getElementById('subMenuImoveis');
    const login = document.getElementById('irLogin');
    const cadastrar = document.getElementById('irCadastro');
    const token = localStorage.getItem('token');
    const subMenuReservas = document.getElementById('subMenuReservas');
    const irLogin = document.getElementById('irLogin');
    const irCadastro = document.getElementById('irCadastro');

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

    subMenuSair.onclick = function() {
        localStorage.removeItem('token');
        document.location.href = indexPage;
    }

    home.onclick = function() {
        document.location.href = indexPage;
    }

    subMenuImoveis.onclick = function() {
        document.location.href = imoveisPage;
    }   

    subMenuReservas.onclick = function() {
        document.location.href = reservas;
    }

    irLogin.onclick = function() {
        window.location.href = loginPage;
    }

    irCadastro.onclick = function() {
        window.location.href = cadastroPage;
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
                localStorage.setItem('token', response.data.access_token);
                document.location.href = indexPage;
            })
            .catch(error =>{
                alert("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
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
                        localStorage.setItem('token', response.data.access_token);
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
    const token = localStorage.getItem('token');
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
        axios.get(baseURL + `/usuarios/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            document.location.href = reservar;
        })
        .catch(error =>{
            localStorage.removeItem('token');
            document.location.href = loginPage;
        });
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
        disponibilidade = `<span style="background-color: red; color: white; font-family: Inter; font-size: 1rem; text-align: center; padding: 0.3125rem 0 0.3125rem 0; border-radius: 8px; width: 100%">Indisponível</span>`; 
      }
      else{
        disponibilidade = `<span style="background-color: green; color: white; font-family: Inter; font-size: 1rem; text-align: center; padding: 0.3125rem 0 0.3125rem 0; border-radius: 8px; width: 100%">Disponível</span>`;
      }
  
      card.innerHTML = `
        <img src="drawables/ImagePlaceholder.png" alt="Imagem do imóvel">
        <div class="cardDetails">
          <p class="location">${item.logradouro}, ${item.numero} - ${item.bairro}</p>
        </div>
        <div class="cardDetailsDisponibilidade"> 
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

function populateTable(data, deletar) {
    const tableReservas = document.getElementById('tableReservas').querySelector('tbody');

    data.forEach(item => {
        if(deletar) {
            const novaLinha = tableReservas.insertRow();

            const logradouroCelula = novaLinha.insertCell();
            logradouroCelula.textContent = `${item.imoveis.logradouro}, ${item.imoveis.numero} - ${item.imoveis.bairro}, ${item.imoveis.localidade} - ${item.imoveis.uf}`;

            const entrada = novaLinha.insertCell();
            let dataFormatada = formatarDataBrasileira(item.data_entrada);
            entrada.textContent = `${dataFormatada}`;

            const saída = novaLinha.insertCell();
            dataFormatada = formatarDataBrasileira(item.data_saida);
            saída.textContent = `${dataFormatada}`;

            const totalDias = novaLinha.insertCell();
            totalDias.textContent = `${item.totalDias}`;

            const valorTotal = novaLinha.insertCell();
            valorTotal.textContent = `${item.totalPreco}`;

            // Adicionar a célula de ações com o botão de deletar
            const acoesCelula = novaLinha.insertCell();
            const botaoDeletar = document.createElement('button');
            botaoDeletar.textContent = 'Deletar';
            botaoDeletar.className = 'btn-delete';
            botaoDeletar.onclick = () => deletarReserva(item.id_reserva, novaLinha);
            acoesCelula.appendChild(botaoDeletar);
        }
        else {
            console.log('teste')
            const novaLinha = tableReservas.insertRow();

            const logradouroCelula = novaLinha.insertCell();
            logradouroCelula.textContent = `${item.usuarios.nome}`;

            const entrada = novaLinha.insertCell();
            let dataFormatada = formatarDataBrasileira(item.data_entrada);
            entrada.textContent = `${dataFormatada}`;

            const saída = novaLinha.insertCell();
            dataFormatada = formatarDataBrasileira(item.data_saida);
            saída.textContent = `${dataFormatada}`;

            const totalDias = novaLinha.insertCell();
            totalDias.textContent = `${item.totalDias}`;

            const valorTotal = novaLinha.insertCell();
            valorTotal.textContent = `${item.totalPreco}`;
        }
    });
}

function formatarDataBrasileira(dataISO) {
    const data = new Date(dataISO);

    // Formatar a data no formato dd/MM/yyyy
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

// Função para deletar uma reserva
function deletarReserva(id, linha) {
    const token = localStorage.getItem('token');

    axios.delete(baseURL + `/reservas/many`, {
        data: [{ id_reserva: id }],
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        linha.remove();
    })
    .catch(error =>{
        console.error('Erro:', error);
        alert('Falha ao se conectar com o servidor.');
    });
}
