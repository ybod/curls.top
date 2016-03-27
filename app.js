'use strict';
const koa = require('koa');
const app = koa();
const view = require('./view/view');
const contr = require('./controller');

function isShellAgent(userAgentStr) {
  return ['curl', 'wget', 'httpie', 'lwp-request']
    .some(agent => userAgentStr.includes(agent));
}

contr.startUpdatingRates();

app.use(function *() {
  const agent = this.request.header['user-agent'];
  if (typeof agent === 'string' && isShellAgent(agent.toLowerCase())) {
    this.type = 'text/plain; charset=utf-8';
    this.body = yield view.text();
  } else {
    this.type = 'html';
    this.body = yield view.html();
  }
});

app.listen(52190);
console.log('Curls listening on 52190');
