class EmailValidator {
  isValid(email){
    return true 
  }
}
describe('EmailValidator', () => { 
  test('any', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })
})