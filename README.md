# coinjs

Coin market monitoring library

## Install

```bash
yarn add coinjs
```

## How to use

```javascript
var coinjs = require('coinjs')
var agent = new coinjs.Coinone()
agent.subscribe('btc')
agent.on('btc', function(info) {
    console.log(info)
})
```

