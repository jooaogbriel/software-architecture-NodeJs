class AddAccountRepository {
  // Método que adiciona uma conta
  async add (email, password) {
      // Criando uma nova conta no banco de dados
      return AccountModel.create({ email, password });
  }
}
