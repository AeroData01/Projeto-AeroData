window.onload = function() {
    listarFeedback();
};


function listarFeedback() {
    // Enviando o valor para função no Model
    fetch(`/feedback/listarFeedback/`, {
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
                        div_tabela.innerHTML = "Sem feedbacks no momento.";
                        return;
                    }
                    var json = JSON.parse(text);
                    var tamanho_lista = json.length;

                    var tabela = '';
                    var modalsExclusao = '';
                    for (var i = 0; i < tamanho_lista; i++) {
                        var nota = json[i].nota;
                        var informacao = json[i].informacao;
                        var nome_usuario = json[i].nome;
                        var email_usuario = json[i].email;

                        tabela += `
                        <tr>
                        <td>
                        <span> ${nome_usuario} </span>
                        </td>
                        <td>
                        <span> ${nota} </span>
                        </td>
                        <td>
                        <span> ${informacao} </span>
                        </td>
                        <td>
                        <span> ${email_usuario} </span>
                        </td>
                        
                        </tr>
                        `;
                    }
                    tbody_tabela.innerHTML =
                        `
                <tr class="tabela-header">
                    <th>Usuário</th>
                    <th>Nota</th>
                    <th>Informação</th>
                    <th>Contato</th>
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