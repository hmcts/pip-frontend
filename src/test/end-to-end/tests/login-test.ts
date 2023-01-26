Feature('Home page');

Scenario('I as a system admin should be able to sign-in with the valid credentials', async ({I}) => {
  I.loginAsSystemAdmin();
  I.see('System Admin Dashboard');
  I.logout();
});

Scenario('I as a system admin should be able to see proper error messages when username or password fields are empty', async ({I}) => {
  I.loginAsSystemAdmin('', '');
  I.see('Please enter your Email Address');
  I.see('Please enter your password');
});

Scenario('I as a system admin should be able to see proper error message when username or password is wrong', async ({I}) => {
  I.loginAsSystemAdmin('email@justice.gov.uk', 'password');
  I.see('Invalid username or password.');
});

Scenario('I as a system admin should be able to see proper error message when username is not a valid email address', async ({I}) => {
  I.loginAsSystemAdmin('email..@justice.gov.uk', 'password');
  I.see('Please enter a valid email address.');
});

Scenario('I as a admin should be able to sign-in with the valid credentials', async ({I}) => {
  I.loginAsAdmin();
  I.see('Your Dashboard');
  I.logout();
});

Scenario('I as a admin should be able to see proper error messages when username or password fields are empty', async ({I}) => {
  I.loginAsAdmin('', '');
  I.see('Please enter your Email Address');
  I.see('Please enter your password');
});

Scenario('I as a admin should be able to see proper error message when username or password is wrong', async ({I}) => {
  I.loginAsAdmin('email@justice.gov.uk', 'password');
  I.see('Invalid username or password.');
});

Scenario('I as a admin should be able to see proper error message when username is not a valid email address', async ({I}) => {
  I.loginAsAdmin('email..@justice.gov.uk', 'password');
  I.see('Please enter a valid email address.');
});

Scenario('I as a media user should be able to sign-in with the valid credentials', async ({I}) => {
  I.loginAsMediaUser();
  I.see('Your account');
  I.logout();
});

Scenario('I as a media user should be able to see proper error messages when username or password fields are empty', async ({I}) => {
  I.loginAsMediaUser('', '');
  I.see('Please enter your Email Address');
  I.see('Please enter your password');
});

Scenario('I as a media user should be able to see proper error message when username or password is wrong', async ({I}) => {
  I.loginAsMediaUser('email@justice.gov.uk', 'password');
  I.see('Invalid username or password.');
});

Scenario('I as a media user should be able to see proper error message when username is not a valid email address', async ({I}) => {
  I.loginAsMediaUser('email..@justice.gov.uk', 'password');
  I.see('Please enter a valid email address.');
});
