import { LoginApi } from "./LoginApi";

export class LoginInteractor {
  static async login({ email }) {
    await LoginApi.login(email);
  }
}
