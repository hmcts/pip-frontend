
export = function () {
  return actor({
    loginAs: function (username, password) {
      this.amOnPage('https://localhost:8080/system-admin-dashboard/');
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
