const makeSut = () => {
  return new AuthUseCase()
}

class AuthUseCase {
  async auth(email, password){
    if(!email){
      throw new Error()
    }
  }
}

describe('AuthUseCase', () => {
  test('Should throw if no email is provided',async () => {
    const sut = makeSut()
    const promise =  sut.auth()
    expect(promise).rejects.toThrow()
  })
})