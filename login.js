// SOLID -> CADA CLASSE DEVE TER APENAS UMA RESPONSABILIDADE

// Importando o módulo express e criando um roteador
const express = require('express');
const router = express.Router();

// Exportando uma função que cria um novo roteador de inscrição e define uma rota POST para '/signup'
module.exports = () => {
    const router = new SignUpRouter();
    // Aqui estamos adaptando nosso roteador para trabalhar com o express, usando a classe ExpressRouterAdapter
    router.post('/signup', ExpressRouterAdapter.adapt(router));
}

// Classe que adapta um roteador para trabalhar com o express
class ExpressRouterAdapter {
    // Método estático que recebe um roteador e retorna uma função que o express pode usar como callback
    static adapt(router){
        return async (req, res) => {
            // Criando um objeto httpRequest a partir do req do express
            const httpRequest = {
                body: req.body
            }
            // Chamando o método route do roteador com o httpRequest e esperando a resposta
            const httpResponse = await router.route(httpRequest)
            // Enviando a resposta para o cliente
            res.status(httpResponse.statusCode).json(httpResponse.body)
        }
    }
}

// PRESENTATION / CLIENT(ROTAS)
// Classe que define o roteador de inscrição
class SignUpRouter {
    // Método que será chamado pelo adaptador do express
    async route (httpRequest) {
        // Extraindo email, password e repeatPassword do corpo da requisição
        const { email, password, repeatPassword } = httpRequest.body;
        // Criando um novo caso de uso de inscrição e chamando o método signUp
        const user = new SignUpUseCase().signUp(email, password, repeatPassword);
        // Retornando a resposta que será enviada para o cliente
        return {
            statusCode: 200,
            body: user
        }
    }
}


// USE CASES -> DOMAIN -> REGRAS DE NEGÓCIO
// Classe que define o caso de uso de inscrição
class SignUpUseCase {
    // Método que realiza a inscrição
    async signUp (email, password, repeatPassword) {
        // Se a senha e a repetição da senha são iguais, adiciona a conta
        if (password === repeatPassword) {
            new AddAccountRepository().add(email, password);
        }
    }
}

// INFRA
// Importando o módulo mongoose e obtendo o modelo de conta
const mongoose = require('mongoose');
const AccountModel = mongoose.model('Account');

// Classe que define o repositório de adição de conta
class AddAccountRepository {
    // Método que adiciona uma conta
    async add (email, password) {
        // Criando uma nova conta no banco de dados
        return AccountModel.create({ email, password });
    }
}
