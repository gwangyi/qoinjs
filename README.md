# coinjs

Coin market monitoring library

## Install

```bash
yarn add qoinjs
```

## How to use

```javascript
var qoinjs = require('qoinjs')
var agent = new qoinjs.Coinone()
agent.subscribe('btc')
agent.on('btc', function(info) {
    console.log(info)
})
```

