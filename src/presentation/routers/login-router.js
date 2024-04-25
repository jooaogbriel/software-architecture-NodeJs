const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
    constructor(authUseCase){
        this.authUseCase = authUseCase
    }
    route(httpRequest){
        try {
            const { email, password } = httpRequest.body
            if(!email){
                return HttpResponse.badRequest('email')
            }
            if(!password){
                return HttpResponse.badRequest('password')
            }
            const acessToken = this.authUseCase.auth(email, password)
            if(!acessToken){
                return HttpResponse.unauthorizedError()
            }
            return HttpResponse.ok({ acessToken })
        } catch (error) {
            return HttpResponse.serverError()
        }
    }
}
