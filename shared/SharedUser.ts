export default class SharedUser {
  public id: number;
  public username: string;

  constructor(data: {
    id: number;
    username: string;
  }) {
    this.id = data.id;
    this.username = data.username;
  }
}