// function Data(status, message, result) {
//     this.status = status;
//     this.message = message;
//     this.result = result;
// }
// export default Data;

export default class Data<T> {
    status: number;
    message: string;
    result: T;
    constructor(status: number, message: string, result: T) {
      this.status = status;
      this.message = message;
      this.result = result;
    }
  }