import { LoginApi } from "./LoginApi";

export class LoginInteractor {
  static async login({ email }) {
    return LoginApi.login(email);
  }
}
