const {MissingParamError, InvalidParamError} = require('../../presentation/utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword){
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return  encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGerenatorSpy {
    async generate(userId){
      this.userId = userId
      return this.acessToken
    }
  }
  const tokenGeneratorSpy = new TokenGerenatorSpy()
  tokenGeneratorSpy.acessToken = 'any_token'
  return  tokenGeneratorSpy
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    userId: 'any_id',
    password: 'hashed_password',
  }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const tokenGeneratorSpy = makeTokenGenerator()
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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
  test('Should returns null if an email is provided',async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(acessToken).toBeNull()
  })
  test('Should returns null if an password is provided',async () => {
    const {sut, encrypterSpy} = makeSut()
    encrypterSpy.isValid = false
    const acessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(acessToken).toBeNull()
  })
  test('Should call Encrypter with correct values',async () => {
    const {sut,loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
  test('Should call TokenGenerator with correct userId',async () => {
    const {sut,loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })
  test('Should return null if token return null',async () => {
    const {sut, tokenGeneratorSpy } = makeSut()
    tokenGeneratorSpy.acessToken = null
    const token = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(token).toBeNull()
  })
  test('Should return an acessToken if correct credentials are provided',async () => {
    const {sut, tokenGeneratorSpy } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
    expect(acessToken).toBeTruthy()
  })
})
