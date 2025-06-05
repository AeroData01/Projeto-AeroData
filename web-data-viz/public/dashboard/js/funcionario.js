function revealHidePasswordInput() {
    var passwordInput = document.getElementById("senha_input");
    var eyeButton = document.getElementById("eyeButton1");

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Mostra a senha
        eyeButton.classList.remove("fa-eye-slash");
        eyeButton.classList.add("fa-eye");
    } else {
        passwordInput.type = "password"; // Esconde a senha
        eyeButton.classList.remove("fa-eye");
        eyeButton.classList.add("fa-eye-slash");
    }
}

function revealHidePasswordConfirmInput() {
    var passwordInput = document.getElementById("confirmacao_senha_input");
    var eyeButton = document.getElementById("eyeButton2");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeButton.classList.remove("fa-eye-slash");
        eyeButton.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeButton.classList.remove("fa-eye");
        eyeButton.classList.add("fa-eye-slash");
    }
}

document.querySelectorAll('.custom-select-wrapper').forEach((wrapper) => {
    const customSelect = wrapper.querySelector('.custom-select');
    const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
    const customOptions = customSelect.querySelector('.custom-options');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]'); // Corrigido! Agora pega o input certo dentro da mesma wrapper

    customSelectTrigger.addEventListener('click', () => {
        customOptions.style.display = customOptions.style.display === 'block' ? 'none' : 'block';
    });

    customSelect.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', () => {
            customSelectTrigger.innerHTML = option.innerHTML; // mantém o ícone <i> + texto
            hiddenInput.value = option.getAttribute('data-value');
            customOptions.style.display = 'none';
        });
    });

    // Fechar o select ao clicar fora
    document.addEventListener('click', function (event) {
        if (!wrapper.contains(event.target)) {
            customOptions.style.display = 'none';
        }
    });
});

function cadastrarFuncionario() {
    var tipoVar = document.getElementById("selectNovoTipo").value;
    var nomeVar = document.getElementById("inputNovoNome").value;
    var cpfVar = document.getElementById("inputNovoCpf").value;
    var telefoneVar = document.getElementById("inputNovoTelefone").value;
    var emailVar = document.getElementById("inputNovoEmail").value;
    var senhaVar = document.getElementById("inputNovoSenha").value;
    var confirmacaoSenhaVar = document.getElementById("inputNovoConfirmarSenha").value;
    var tipoCompanhiaVar = "";

    switch (sessionStorage.COMPANHIA_USUARIO) {
        case "Azul":
            tipoCompanhiaVar = "AZU";
            break;
        case "GOL":
            tipoCompanhiaVar = "GLO";
            break;
        case "LATAM":
            tipoCompanhiaVar = "TAM";
            break;
        default:
            tipoCompanhiaVar = null;
    }


    // aguardar();

    var caracteresEspeciais = ['!', '@', '#', '$', '%', '&', '*'];


    function possuiCaracteresEspeciais(string) {
        for (var contador = 0; contador < caracteresEspeciais.length; contador++) {
            if (string.includes(caracteresEspeciais[contador])) {
                return true;
            }
        }
        return false;
    }

    if (nomeVar === "" || cpfVar === "" || telefoneVar == "" || emailVar === "" || tipoVar == "" || senhaVar === "" || confirmacaoSenhaVar === "") {
        exibirErro("Erro! Todos os campos devem ser preenchidos!");
        finalizarAguardar();
        return false;

    } else if (nomeVar.length <= 2) {
        exibirErro("Erro! O campo nome precisa de ao menos 3 letras!");
        finalizarAguardar();
        return false;

    } else if (possuiCaracteresEspeciais(nomeVar)) {
        exibirErro("Erro! O campo nome não deve possuir caracteres especiais!");
        finalizarAguardar();
        return false;

    } else if (cpfVar.length !== 11) {
        exibirErro("Erro! O CPF deve conter exatamente 11 números!");
        finalizarAguardar();
        return false;

    } else if (!emailVar.includes('@')) {
        exibirErro("Erro! O campo e-mail deve possuir um '@'!");
        finalizarAguardar();
        return false;

    } else if (telefoneVar.length < 10 || telefoneVar.length > 11) {
        exibirErro("Erro! O telefone deve ter entre 10 e 11 dígitos (DDD + número)!");
        finalizarAguardar();
        return false;

    } else if (senhaVar.length <= 5) {
        exibirErro("Erro! A senha deve conter ao menos 6 caracteres!");
        finalizarAguardar();
        return false;

    } else if (!possuiCaracteresEspeciais(senhaVar)) {
        exibirErro("Erro! A senha deve conter ao menos 1 caractere especial!");
        finalizarAguardar();
        return false;

    } else if (senhaVar !== confirmacaoSenhaVar) {
        exibirErro("Erro! As senhas não coincidem!");
        finalizarAguardar();
        return false;

    } else {
        exibirCadastroRealizado("Cadastro realizado com sucesso!");
        // setInterval(sumirMensagem, 5000);
    }

    function exibirErro(mensagem) {
        document.getElementById('divMensagem').innerText = mensagem;
        document.getElementById('divMensagem').style.display = 'block';
        setTimeout(sumirMensagem1, 5000);
    }

    function exibirCadastroRealizado(mensagem) {
        document.getElementById('divMensagem').innerText = mensagem;
        document.getElementById('divMensagem').style.display = 'block';
        setTimeout(sumirMensagem1, 5000);
    }

    function sumirMensagem1() {
        document.getElementById('divMensagem').style.display = 'none';
        document.getElementById('divMensagem').style.display = 'none';
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // crie um atributo que recebe o valor recuperado aqui
            // Agora vá para o arquivo routes/usuario.js
            nomeServer: nomeVar,
            cpfServer: cpfVar,
            emailServer: emailVar,
            telefoneServer: telefoneVar,
            tipoContaServer: tipoVar,
            tipoCompanhiaServer: tipoCompanhiaVar,
            senhaServer: senhaVar,

            // idEmpresaVincularServer: idEmpresaVincular
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

                setTimeout(() => {
                    ''
                    window.location = "login.html";
                }, "2000");

                limparFormulario();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar();
        });

    return false;
}

function sumirMensagem() {
    cardErro.style.display = "none";
}


var vezesClicadas = 0;

function listarFuncionario() {
    var tipoCompanhia = sessionStorage.COMPANHIA_USUARIO;
    // Enviando o valor para função no Model
    fetch("/usuarios/listarFuncionario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // atributo do JSON recebe a id do usuário logado atualmente, ou seja, o supervisor
            tipoCompanhiaServer: tipoCompanhia
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.text().then(function (text) {
                    if (!text) {
                        div_tabela.innerHTML = "Cadastre um funcionário, e ele aparecerá aqui!";
                        return;
                    }
                    var json = JSON.parse(text);
                    var tamanho_lista = json.length;

                    var tabela = '';
                    var modalsExclusao = '';
                    console.log(tamanho_lista);
                    for (var i = 0; i < tamanho_lista; i++) {
                        var cpfFuncionario = json[i].cpf;
                        var nomeFuncionario = json[i].nome;
                        var emailFuncionario = json[i].email;
                        tabela += `
            <tr>
            <td>
            <input type="text" value="${nomeFuncionario}" disabled id="inputNomeFuncionario${cpfFuncionario}">
            </td>
            <td>
            <input type="text" value="${emailFuncionario}" disabled id="inputEmailFuncionario${cpfFuncionario}">
            </td>
            <td>
            <button class="btn-confirmar-edicao" id="botaoConfirmar${cpfFuncionario}" onclick="editarUsuario(${cpfFuncionario})">
              Salvar alterações
            </button>
            <button id="botaoHabilitar${cpfFuncionario}" onclick="habilitarEditarUsuario(${cpfFuncionario})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path
            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fill-rule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
            </button>
            </td>
            <td>
            <button onclick="abrirModalExcluirUsuario(${cpfFuncionario})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
            viewBox="0 0 16 16">
            <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
            </button>
            </td>
            </tr>
            `;
                        modalsExclusao += `
            <div id="modalExcluirUsuario${cpfFuncionario}" class="modal-excluir-usuario">
              <div class="conteudo-excluir-usuario">
                <h1>Você tem certeza que deseja excluir esse funcionario?</h1>
                <div class="container-botao-confirmacao">
                  <button onclick="excluirUsuario(${cpfFuncionario})">Sim</button>
                  <button onclick="negarExclusao(${cpfFuncionario})">Não</button>
                </div>
             </div>
            </div>`
                    }
                    tbody_tabela.innerHTML =
                        `<tr class="tabela-header">
                <th>Nome</th>
                <th>Email</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>` +
                        tabela;
                    div_modals.innerHTML = modalsExclusao;
                });
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            //finalizarAguardar();
        });

    return false;
}

function novoFuncionario() {
    var modal = modalNovoFuncionario;

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "flex"
}

function fecharModal() {
    var modal = modalNovoFuncionario;

    modal.style.display = "none";
}

function abrirModalExcluirUsuario(idFuncionario) {
    var textoModal = 'modalExcluirUsuario' + idFuncionario;

    var modal = document.getElementById(textoModal);

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "flex";

}

function excluirUsuario(idFuncionario) {
    fetch("/usuarios/excluirFuncionario", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            //recebe o funcionário a ser excluído
            idFuncionario: idFuncionario,
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                alert(`Funcionário excluído com sucesso!`);
                listarFuncionarios();
            } else {
                alert(`Houve um erro ao excluir o funcionário`);
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar();
        });

    return false;
}

function negarExclusao(idFuncionario) {
    var textoModal = 'modalExcluirUsuario' + idFuncionario;

    var modal = document.getElementById(textoModal);

    modal.style.display = "none";
}

function habilitarEditarUsuario(idFuncionario) {
    var textoNome = `inputNomeFuncionario${idFuncionario}`;
    var textoEmail = `inputEmailFuncionario${idFuncionario}`;
    var textoCpf = `inputCpfFuncionario${idFuncionario}`;
    var textoBotaoHabilitar = `botaoHabilitar${idFuncionario}`;
    var textoBotaoConfirmar = `botaoConfirmar${idFuncionario}`;

    var inputNome = document.getElementById(textoNome);
    var inputEmail = document.getElementById(textoEmail);
    var botaoConfirmar = document.getElementById(textoBotaoConfirmar);
    var botaoHabilitar = document.getElementById(textoBotaoHabilitar);

    if (vezesClicadas == 1) {
        inputEmail.disabled = true;
        inputNome.disabled = true;
        botaoConfirmar.style.display = 'none';
        botaoHabilitar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
      </svg>
    `;
        vezesClicadas = 0;
    } else {
        vezesClicadas++;
        inputEmail.disabled = false;
        inputNome.disabled = false;
        botaoConfirmar.style.display = 'block';
        botaoHabilitar.innerHTML = `<br>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
    </svg>Cancelar
`;
        inputEmail.focus();
    }
}

function editarUsuario(idUsuario) {
    var textoNomeFuncionario = `inputNomeFuncionario${idUsuario}`;
    var textoEmailFuncionario = `inputEmailFuncionario${idUsuario}`;

    var emailNovo = document.getElementById(textoEmailFuncionario).value;
    var nomeNovo = document.getElementById(textoNomeFuncionario).value;

    fetch("/usuarios/atualizarUsuario", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nomeNovo,
            email: emailNovo,
            id_usuario: idUsuario
        })
    }).then(function (resposta) {
        if (resposta.ok) {

            console.log(resposta);
            alert('Funcionário atualizado com sucesso!')
            listarFuncionarios();
        } else {

            console.log("Houve um erro ao atualizar o funcionário!");

            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}
