export class AuthorizerService {
  constructor({ config }) {
    this.config = config;
  }

  isAuthorized(login, password) {
    const storedPassword = this.config[login];

    console.log('login', login);
    console.log('password', password);
    console.log('storedPassword', storedPassword);

    return login && password && password === storedPassword;
  }
}
