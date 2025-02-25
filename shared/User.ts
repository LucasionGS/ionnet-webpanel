export default class User {
  public name: string;
  public email: string;
  public password: string;
  public id: number;

  constructor(name: string, email: string, password: string, id: number) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.id = id;
  }
}