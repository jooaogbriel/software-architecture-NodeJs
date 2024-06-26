const { MissingParamError, InvalidParamError} = require('../utils/errors')
const{ ServerError, UnauthorizedError} = require('../errors')
const  LoginRouter = require('../routers/login-router')

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidator()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
    return {
        sut, 
        authUseCaseSpy, 
        emailValidatorSpy
    }
}
const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid(email){
            this.email = email
            return this.isEmailValid
        }
    }
    const emailValidatorSpy = new EmailValidatorSpy()
    emailValidatorSpy.isEmailValid = true
    return emailValidatorSpy
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth(email, password) {
            this.email = email
            this.password = password
            return this.acessToken
        }
    }
    const authUseCase = new AuthUseCaseSpy()
    AuthUseCaseSpy.acessToken = 'valid_token'
    return authUseCase
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        auth () {
            throw new Error()
        }
    }
    return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid () {
            throw new Error()
        }
    }
    return new EmailValidatorSpy()
}


describe('Login Router', () => {
    test('Should return 400 if no email is provided', async () => {
        const httpRequest = {
            body: { 
                password: 'any_password'
            }
        }
        const { sut } = makeSut()
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', async () => {
        const httpRequest = {
            body: { 
                email: 'any_email'
            }
        }
        const {sut} = makeSut()
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 500 if no httRequest is provided', async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.route()
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if no httRequest has no body', async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.route({})
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should call AuthUseCase with correct params', async () => {
        const {sut, authUseCaseSpy} = makeSut()
        const httpRequest = {
            body: { 
                email: 'any_email@email.com',
                password: 'any_password'
            }
        }
        sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
    })
    test('Should return 401 when invalid credentials are provided', async () => {
        const {sut, authUseCaseSpy} = makeSut()
        authUseCaseSpy.acessToken = null
        const httpRequest = {
            body: { 
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(401)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
       
    })
    test('Should return 200 when valid credentials are provided', async () => {
        const {sut, authUseCaseSpy} = makeSut()
        authUseCaseSpy.acessToken = 'valid_token'
        const httpRequest = {
            body: { 
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
    })
    test('Should return 500 if useCase is provided', async () => {
        const sut = new LoginRouter()
        const httpRequest = {
            body: { 
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 500 if useCase has no auth method', async () => {
        const sut = new LoginRouter({})
        const httpRequest = {
            body: { 
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 500 if AuthUseCase throws', async () => {
        const authUseCaseSpy = makeAuthUseCaseWithError()
        const sut = new LoginRouter(authUseCaseSpy)
        const httpRequest = {
            body: { 
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
    })
    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorSpy } = makeSut()
        emailValidatorSpy.isEmailValid = false
        const httpRequest = {
            body: { 
                email: 'invalid_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should return 500 if no emailValidator is provided', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const sut = new LoginRouter(authUseCaseSpy)
        const httpRequest = {
            body: { 
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 500 if no emailValidator has no provided', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const sut = new LoginRouter(authUseCaseSpy, {})
        const httpRequest = {
            body: { 
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 500 if EmailValidator throws', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const emailValidatorSpy = makeEmailValidatorWithError()
        const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
        const httpRequest = {
            body: { 
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorSpy } = makeSut()
        const httpRequest = {
            body: { 
                email: 'correct_email@email.com',
                password: 'any_password'
            }
        }
        sut.route(httpRequest)
        expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
    })
})