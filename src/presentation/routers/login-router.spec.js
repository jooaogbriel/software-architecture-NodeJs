// TDD: Test Driven Development
// --> EXEMPLO DE TESTE UNITÁRIO VERIFICANDO SE O STATUS CODE RETORNADO É 400 QUANDO NÃO É PASSADO O EMAIL NO CORPO DA REQUISIÇÃO 
class LoginRouter {
    route(httpRequest){
        if(!httpRequest.body.email){
            return {
                statusCode: 400
            }
        }
    }
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: { 
                password: 'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})