import io from 'socket.io-client'
import EventEmitter from 'events'

const gather = {
  BTC: 1000,
  BCH: 500,
  ETH: 100,
  ETC: 10,
  XRP: 1,
  QTUM: 10,
  LTC: 50,
  IOTA: 10,
  BTG: 50
}

const alias = {
  BCC: 'BCH'
}

const rAlias = {}

for(let c in alias) {
  if(!rAlias[alias[c]]) rAlias[alias[c]] = []
  rAlias[alias[c]].push(c)
}

export class Coinone extends EventEmitter {
  constructor () {
    super()

    this.$conns = {}
  }

  subscribe (coin) {
    coin = coin.toUpperCase()
    if(alias[coin]) {
      coin = alias[coin]
    }
    if(this.$conns[coin]) return

    let $conn = io('wss://push.coinone.co.kr:443/orderbook', {transports: ['websocket']})
    $conn.emit('subscribe', coin, gather[coin])

    $conn.on('update', data => {
      let asks = JSON.parse(data.ASK)
      let bids = JSON.parse(data.BID)
      let ask = asks.reduce((y, x) => parseInt(y.price) > parseInt(x.price) ? x : y)
      let bid = bids.reduce((y, x) => parseInt(y.price) < parseInt(x.price) ? x : y)
      let obj = {ask: parseInt(ask.price), bid: parseInt(bid.price), askQty: parseFloat(ask.qty) / 10000, bidQty: parseFloat(bid.qty) / 10000}
      this.emit(coin.toLowerCase(), obj)
      if(rAlias[coin])
        for(let a of rAlias[coin])
          this.emit(a.toLowerCase(), obj)
    })
    $conn.on('connect_error', e => this.emit('error', e))
    $conn.on('error', e => this.emit('error', e))
    $conn.on('reconnect_error', e => this.emit('error', e))
    this.$conns[coin] = $conn
  }

  end () {
    for(let coin in this.$conns) {
      this.$conns[coin].close()
    }
    this.$conns = {}
  }
}
