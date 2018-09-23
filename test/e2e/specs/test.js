// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser
      .url(`http://localhost:4000/#/rooms`)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#room-list')
      .assert.elementPresent('.filters')
      .assert.elementPresent('.inside-filters')
      .assert.elementPresent('.first-filters')
      .assert.elementPresent('.second-filters')
      .assert.elementPresent('.date-filter')
      .assert.elementPresent('.rooms')
      .assert.elementCount('.rooms .room', 5)
      .assert.elementCount('.container-icon .icon', 3)
      .assert.elementPresent('.picture span')
      .assert.containsText('.picture:nth-of-type(1) span', 'Hermès')
      .assert.elementCount('img', 5)
      .assert.elementCount('.hours', 5)
      .click('.container-icon > .icon:nth-of-type(1)')
      .pause(500)
      .assert.elementCount('.rooms .room', 3)
      .click('.container-icon > .icon:nth-of-type(1)')
      .pause(500)
      .assert.elementCount('.rooms .room', 5)
      .setValue('.first-filters > label > input[type=\'text\']', 'Apollon')
      .assert.elementCount('.rooms .room', 1)
      .assert.containsText('.picture:nth-of-type(1) span', 'Apollon')
      .end();
  },
};
