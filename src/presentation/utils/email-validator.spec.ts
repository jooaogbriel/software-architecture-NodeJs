const EmailValidator = require('./email-validator');
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('EmailValidator', () => { 
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailInvalid = sut.isValid('invalid_email@mail.com')
    expect(isEmailInvalid).toBe(false)
  })
  test('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('valid_email@mail.com')
    expect(validator.email).toBe('valid_email@mail.com')
  })
})