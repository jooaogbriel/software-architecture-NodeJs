class SignUpUseCase {
  // Método que realiza a inscrição
  async signUp (email, password, repeatPassword) {
      // Se a senha e a repetição da senha são iguais, adiciona a conta
      if (password === repeatPassword) {
          new AddAccountRepository().add(email, password);
      }
  }
}