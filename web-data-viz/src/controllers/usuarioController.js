var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    }
    // else if (nome == undefined) {
    //     res.status(400).send("Seu nome está indefinido!");
    // } 
    else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            cpf: resultadoAutenticar[0].cpf,
                            email: resultadoAutenticar[0].email,
                            cargo: resultadoAutenticar[0].cargo,
                            nome: resultadoAutenticar[0].nome,
                            companhia: resultadoAutenticar[0].companhia,
                        });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function autenticarAdmin(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticarAdmin(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            cpf: resultadoAutenticar[0].cpf,
                            email: resultadoAutenticar[0].email,
                            cargo: resultadoAutenticar[0].cargo,
                            nome: resultadoAutenticar[0].nome,
                            companhia: resultadoAutenticar[0].companhia,
                        });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var tipoConta = req.body.tipoContaServer;
    var tipoCompanhia = req.body.tipoCompanhiaServer;
    var senha = req.body.senhaServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está indefinido!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu cpf está indefinido!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está indefinido!");
    } else if (tipoConta == undefined) {
        res.status(400).send("Seu tipoConta está indefinido!");
    } else if (tipoCompanhia == undefined) {
        res.status(400).send("Seu tipoCompanhia está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    }
    else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, cpf, email, telefone, tipoConta, tipoCompanhia, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function listarFuncionario(req, res) {
    
    var tipoCompanhia = req.body.tipoCompanhiaServer;

    usuarioModel.listarFuncionario(tipoCompanhia)
        .then(
            function (resultadoLista) {
                console.log(`\nResultados encontrados: ${resultadoLista.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoLista)}`); // transforma JSON em String

                if (resultadoLista.length > 0) {
                    var lista_funcionarios = [];
                    var tamanho_lista = resultadoLista.length;
                    for (var i = 0; i < tamanho_lista; i++) {
                        lista_funcionarios.push({
                            cpf: resultadoLista[i].cpf,
                            email: resultadoLista[i].email,
                            nome: resultadoLista[i].nome,
                            fk_sigla_companhia: resultadoLista[i].fk_sigla_companhia,
                            cargo: resultadoLista[i].cargo,
                        })
                    }
                    res.json(lista_funcionarios);
                } else {
                    res.status(204).send("Não tem nenhum funcionário!")
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao listar os funcionários! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function excluirFuncionario(req, res) {
    var cpf = req.body.cpfServer;

    usuarioModel.excluirFuncionario(cpf)
    .then(
        function (resultadoExclusao) {
            res.json(resultadoExclusao);    
        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao excluir o funcionário! Erro: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );

}

function atualizarFuncionario(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;
    var cpf = req.body.cpfServer;

    usuarioModel.atualizarFuncionario(nome, email, cpf)
    .then(
        function (resultadoUpdate) {
            res.json(resultadoUpdate);
        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao editar o funcionário! Erro: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );
}

module.exports = {
    autenticar,
    autenticarAdmin,
    cadastrar,
    listarFuncionario,
    excluirFuncionario,
    atualizarFuncionario
}