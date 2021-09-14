import fs from 'fs';
import path from 'path';

let attemptCounter = 3;

export class OtpActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'otpCodes.json'), 'utf-8');

  validateOtp(otpCode: number, email: string): any {
    const codes = JSON.parse(this.rawData);
    const code = codes?.results.filter((otp) => otp.code === otpCode && otp.email === email);
    if (code.length) {
      return { otpValid: true, attempts: attemptCounter};
    } else {
      console.log(`Otp code with id ${otpCode} does not exist`);
      return { otpValid: false, attempts: attemptCounter - 1};
    }
  }

  getAttempts(email: string): any {
    const codes = JSON.parse(this.rawData);
    const code = codes?.results.filter((otp) => otp.email === email);
    if (code.length) {
      return attemptCounter;
    }
    else
    {
      return 0;
    }
  }

  decrementAttempts(email: string): any {
    const codes = JSON.parse(this.rawData);
    const code = codes?.results.filter((otp) => otp.email === email);
    attemptCounter = attemptCounter -1;
    if (code.length) {
      return attemptCounter;
    }
    else
    {
      return 0;
    }
  }

  resetAttempts(email: string): any {
    const codes = JSON.parse(this.rawData);
    const code = codes?.results.filter((otp) => otp.email === email);
    attemptCounter = 3;
    if (code.length) {
      return attemptCounter;
    }
    else
    {
      return 0;
    }
  }
}
