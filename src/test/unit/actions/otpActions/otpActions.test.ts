import { OtpActions } from '../../../../main/resources/actions/otpActions';

const validOtpCode = 123456;
const invalidOtpCode = 123457;
const email = 'pippo@pluto.com';

const otpActions = new OtpActions();

describe(`validateOtp(${validOtpCode})`, () => {
  const validateOtp = otpActions.validateOtp(validOtpCode, email);


  it('should have return object with validOtp true', () => {
    expect(validateOtp.otpValid).toBe(true);
  });

});

describe(`validateOtp(${invalidOtpCode})`, function () {
  const validateOtp = otpActions.validateOtp(invalidOtpCode, email);

  it(`should return an object with validOtp false`, () => {
    expect(validateOtp.otpValid).toBe(false);
  });
});

describe(`getAttempts(${email})`, function () {
  const validateOtp = otpActions.getAttempts(email);

  it(`should return an object with attempts`, () => {
    expect(validateOtp).toBeGreaterThan(0);
  });
});

describe(`decrementAttempts(${email})`, function () {
  const validateOtp = otpActions.decrementAttempts(email);

  it(`should return an object with left attempts`, () => {
    expect(validateOtp).toBeGreaterThan(0);
  });
});

describe(`resetAttempts(${email})`, function () {
  const validateOtp = otpActions.resetAttempts(email);

  it(`should return an object with 3 attempts`, () => {
    expect(validateOtp).toBe(3);
  });
});



