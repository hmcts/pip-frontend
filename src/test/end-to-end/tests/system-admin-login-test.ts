Feature('Home page');

Scenario('I as a system admin should be able to sign-in with the valid credentials', async ({ I }) => {
  I.loginAsSystemAdmin();
  I.see('System Admin Dashboard');
  I.logout();
});

Scenario('I as a system admin should be able to see proper error messages when username or password fields are empty', async ({ I }) => {
  I.loginAsSystemAdmin('','');
  I.see('Please enter your Email Address');
  I.see('Please enter your password');
});

Scenario('I as a system admin should be able to see proper error message when username or password is wrong', async ({ I }) => {
  I.loginAsSystemAdmin('email@test.com','password');
  I.see('Invalid username or password.');
});

Scenario('I as a system admin should be able to see proper error message when username is not a valid email address', async ({ I }) => {
  I.loginAsSystemAdmin('email..@test.com','password');
  I.see('Please enter a valid email address.');
});

