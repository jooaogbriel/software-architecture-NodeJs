// TDD: Test Driven Development
// --> EXEMPLO DE TESTE UNITÁRIO VERIFICANDO SE O STATUS CODE RETORNADO É 400 QUANDO NÃO É PASSADO O EMAIL NO CORPO DA REQUISIÇÃO 
class LoginRouter {
    route(httpRequest){
        if(!httpRequest || httpRequest.body === undefined){
            return httpCode.serverError()
        }
        const { email, password } = httpRequest.body
        if(!email){
            return httpCode.badRequest('email')
        }
        if(!password){
            return httpCode.badRequest('password')
        }
    }
}
class httpCode {
   static badRequest (params) {
    return {
        statusCode: 400,
        body: new MissingParamError(params)
    }
   }
   static serverError (params) {
    return {
        statusCode: 500,
        body: new MissingParamError(params)
    }
   }
}

class MissingParamError extends Error{
    constructor(paramName){
        super(`Missing param: ${paramName}`)
        this.name = 'MissingParamError'
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
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: { 
                email: 'any_email'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 500 if no httRequest is provided', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route()
        expect(httpResponse.statusCode).toBe(500)
    })

    test('Should return 500 if no httRequest has no body', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route({})
        expect(httpResponse.statusCode).toBe(500)
    })
})