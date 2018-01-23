import SockJS from 'sockjs-client'
import EventEmitter from 'events'

const alias = {
  BCH: 'BCC'
}

const rAlias = {}

for(let c in alias) {
  if(!rAlias[alias[c]]) rAlias[alias[c]] = []
  rAlias[alias[c]].push(c)
}

export class Upbit extends EventEmitter {
  constructor () {
    super()
    this._connected = false
    this.$conn = new SockJS('https://crix-websocket.upbit.com/sockjs')
    this.$conn.onopen = () => this._connected = true
    this._subscribes = {}
    this.$conn.onmessage = m => {
      let data = JSON.parse(m.data)
      let sp = data.code.indexOf('-')
      let coin = data.code.substr(sp + 1)
      let obj = {ask: parseInt(data.orderbookUnits[0].askPrice), bid: parseInt(data.orderbookUnits[0].bidPrice),
                 askQty: parseFloat(data.orderbookUnits[0].askSize), bidQty: parseFloat(data.orderbookUnits[0].bidSize)}
      this.emit(coin.toLowerCase(), obj)
      if(rAlias[coin])
        for(let a of rAlias[coin])
          this.emit(a.toLowerCase(), obj)
    }
    this.$conn.onerror = m => this.emit('error', m)
  }

  reconnect () {
    this.$conn.close()
    this._connected = false

    let conn = new SockJS('https://crix-websocket.upbit.com/sockjs')
    conn.onopen = this.$conn.onopen
    conn.onmessage = this.$conn.onmessage
    conn.onerror = this.$conn.onerror
    this.$conn = conn

    this._updateSubscribe()
  }

  _updateSubscribe () {
    let codes = Object.keys(this._subscribes).map(c => "CRIX.UPBIT.KRW-" + c)
    this.$conn.send(JSON.stringify([
      {ticket: "ram macbook"},
      {type: "crixOrderbook", codes}
    ]))
  }

  _subscribe (coin) {
    coin = coin.toUpperCase()
    let msg = coin.toLowerCase()
    if(alias[coin]) coin = alias[coin]
    if(this._subscribes[coin]) return

    this._subscribes[coin] = true
    this._updateSubscribe()
  }

  subscribe (coin) {
    if(this._connected) return this._subscribe(coin)
    let o = this.$conn.onopen
    this.$conn.onopen = () => {
      this._subscribe(coin)
      o()
    }
  }
}
