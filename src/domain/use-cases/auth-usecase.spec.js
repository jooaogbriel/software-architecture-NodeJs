const {MissingParamError, InvalidParamError} = require('../../presentation/utils/errors')

class AuthUseCase {
  constructor(loadUserByEmailRepository){
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }
  async auth(email, password){
    if(!email){
      throw new MissingParamError('email')
    }
    if(!password){
      throw new MissingParamError('password')
    }
    if(!this.loadUserByEmailRepository){
      throw new MissingParamError('loadUserByEmailRepository')
    }
    if(!this.loadUserByEmailRepository.load){
      throw new InvalidParamError('loadUserByEmailRepository')
    }
    await this.loadUserByEmailRepository.load(email)
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email
    }
  }

const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
return {
  sut,
  loadUserByEmailRepositorySpy
}
}
describe('AuthUseCase', () => {
  test('Should throw if no email is provided',async () => {
    const {sut} = makeSut()
    const promise =  sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if no password is provided',async () => {
    const {sut} = makeSut()
    const promise =  sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call loadUserByEmailRepository with correct email',async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })
  test('Should throws if no loadUserByEmailRepositorySpy is provided',async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })
  test('Should throws if loadUserByEmailRepositorySpy has no load method',async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
})
