
export = function () {
  return actor({
    loginAsSystemAdmin: function (username, password) {
      this.amOnPage('/system-admin-dashboard');
      this.see('Sign in with your email address');
      this.fillField('#email', username);
      this.fillField('#password', password);
      this.click('Sign in');
    },
    logout: function () {
      this.click('Sign out');
      this.see('Sign in');
    },
  });
};
