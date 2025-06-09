function cadastrarObservacao() {
    var nota = Number(document.getElementById("inputNovaNota").value);
    var informacao = document.getElementById("inputNovaInformacao").value;
    var fkCriador = sessionStorage.CPF_USUARIO;

    if (fkCriador.length !== 11) {
        exibirErro("Erro! O CPF deve conter exatamente 11 números.");
        return false;
    } else if (informacao.length > 255 || informacao.length <= 0) {
        exibirErro("Erro! A informação deve ter, no máximo, 255 caracteres.");
    } else if (nota > 10 || nota < 0) {
        exibirErro("Erro! A nota deve estar entre 0 e 10.");
    } else {
        exibirCadastroRealizado("Feedback cadastrado com sucesso!");
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
    fetch("/feedback/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fkCriadorServer: fkCriador,
            informacaoServer: informacao,
            notaServer: nota,
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);
            if (resposta.ok) {
                listarObservacao();
                fecharModal();
                alert("Feedback cadastrado com sucesso!")
            } else {
                throw "Houve um erro ao tentar realizar o cadastro do Feedback!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    return false;
}

function sumirMensagem() {
    cardErro.style.display = "none";
}


var vezesClicadas = 0;

function listarObservacao() {
    var cpf = sessionStorage.CPF_USUARIO;

    // Enviando o valor para função no Model
    fetch(`/feedback/listarFeedbackPorCriador/${cpf}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.text().then(function (text) {
                    if (!text) {
                        div_tabela.innerHTML = "Cadastre um feedback, e ele aparecerá aqui!";
                        return;
                    }
                    var json = JSON.parse(text);
                    var tamanho_lista = json.length;

                    var tabela = '';
                    var modalsExclusao = '';
                    console.log(tamanho_lista);
                    for (var i = 0; i < tamanho_lista; i++) {
                        var nota = json[i].nota;
                        var informacao = json[i].informacao;
                        var idFeedback = json[i].id_feedback;
                        console.log(idFeedback);

                        tabela += `
            <tr>
            <td>
            <input type="number" max="10" min="0" value="${nota}" disabled id="inputNotaFeedback${idFeedback}">
            </td>
            <td>
            <input type="text" value="${informacao}" disabled id="inputInformacaoFeedback${idFeedback}">
            </td>
            <td>
            <button class="btn-confirmar-edicao" id="botaoConfirmar${idFeedback}" onclick="editarUsuario(${idFeedback})">
              Salvar alterações
            </button>
            <button id="botaoHabilitar${idFeedback}" onclick="habilitarEditarUsuario(${idFeedback})">
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
            <button onclick="abrirModalExcluirUsuario(${idFeedback})">
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
            <div id="modalExcluirUsuario${idFeedback}" class="modal-excluir-usuario">
              <div class="conteudo-excluir-usuario">
                <h1>Você tem certeza que deseja excluir essa anotação?</h1>
                <div class="container-botao-confirmacao">
                  <button onclick="excluirObservacao(${idFeedback})">Sim</button>
                  <button onclick="negarExclusao(${idFeedback})">Não</button>
                </div>
             </div>
            </div>`
                    }
                    tbody_tabela.innerHTML =
                        `
                <tr class="tabela-header">
                    <th>Nota</th>
                    <th>Informação</th>
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
        });

    return false;
}

function voltar() {
    var nome =sessionStorage.NOME_USUARIO;
    var email =sessionStorage.EMAIL_USUARIO;
    var cpf=sessionStorage.CPF_USUARIO;
    var cargo =sessionStorage.CARGO_USUARIO; 
    var empresa=sessionStorage.COMPANHIA_USUARIO;

    console.log("Cargo do usuário: ", cargo);
    console.log("Nome do usuário: ", nome);
    console.log("Email do usuário: ", email);
    console.log("CPF do usuário: ", cpf);
    console.log("Empresa do usuário: ", empresa);

    if (cargo === "gerencial") {
        window.location.href = "./dash-gerencial.html";
    }  else if (cargo === "operacional") {
        window.location.href = "./dash-operacional.html";
    } else  {
        window.location.href = "./dash-admin.html";
    }

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

function abrirModalExcluirUsuario(idObservacao) {
    var textoModal = 'modalExcluirUsuario' + idObservacao;

    var modal = document.getElementById(textoModal);

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "flex";

}

function excluirObservacao(idObservacao) {
    fetch("/feedback/excluirFeedback", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            //recebe o funcionário a ser excluído
            idFeedbackServer: idObservacao,
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                alert(`Observação excluído com sucesso!`);
                listarObservacao();
                negarExclusao();
            } else {
                alert(`Houve um erro ao excluir a observação`);
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    return false;
}

function negarExclusao(idObservacao) {
    var textoModal = 'modalExcluirUsuario' + idObservacao;

    var modal = document.getElementById(textoModal);

    modal.style.display = "none";
}

function habilitarEditarUsuario(idObservacao) {
    var textoData = `inputInformacaoFeedback${idObservacao}`;
    var textoDescricao = `inputNotaFeedback${idObservacao}`;
    var textoBotaoHabilitar = `botaoHabilitar${idObservacao}`;
    var textoBotaoConfirmar = `botaoConfirmar${idObservacao}`;

    var inputNome = document.getElementById(textoData);
    var inputEmail = document.getElementById(textoDescricao);
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

function editarUsuario(idObservacao) {
    var textoDescricao = `inputInformacaoFeedback${idObservacao}`;
    var textoData = `inputNotaFeedback${idObservacao}`;

    var dataNova = document.getElementById(textoData).value;
    var observacaoNova = document.getElementById(textoDescricao).value;

    fetch("/feedback/atualizarFeedback", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nota: dataNova,
            informacao: observacaoNova,
            idFeedbackServer: idObservacao
        })
    }).then(function (resposta) {
        if (resposta.ok) {

            console.log(resposta);
            alert('Observação atualizada com sucesso!')
            listarObservacao();
        } else {

            console.log("Houve um erro ao atualizar a observação!");

            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}
