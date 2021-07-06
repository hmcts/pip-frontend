module.exports = {
  launch: {
    headless: false, // set to false and uncomment slowMo and args to see tests in realtime
    slowMo: 80,
    args: ['--window-size=1920,1080'],
    ignoreHTTPSErrors: true, // skips 'Your connection is not private' page
  },
};
