# curls.top

This simple web app allows You to get actual _UAH/USD_ and _UAH/EUR_ exchange rates delivered directly into Your shell via _curl_ or similar command line tools (_wget_, _HTTPie_).

## Usage

You can access this app from a shell via ```curls curls.top``` command:

![Shell output screenshot](http://i.piccy.info/i9/20b771abfea8489068ebf277ab8c18b2/1459083281/49181/1018780/curls.jpg)

## Some details

1. App can return weekly history of _UAH/USD_ and _UAH/EUR_ exchange rates as ANSI escaped text on request of shell tools like _curls_ or _HTTPie_
2. App uses following sources to get information:
  * [National Bank of Ukraine](http://www.bank.gov.ua/control/uk/publish/article?art_id=25327817)
  * [PrivatBank](https://api.privatbank.ua/) - rates actual for [payment cards operations](www.privat24.ua)
  * [Minfin](http://minfin.com.ua/help/api/mb/) - average ["BlackMarket"](http://minfin.com.ua/currency/auction/usd/buy/kiev/) rates
3. Rates are updated every 15 minutes, [Redis](http://redis.io/) is used as a storage

## Installation

To deploy this app locally You will need:

1. Clone project repository
2. Install [Node.js](https://nodejs.org/en/)
3. Install project dependencies via ```npm install```
4. Request _API Key_ from [Minfin](http://minfin.com.ua/help/api/mb/)
5. Set environment variable ```export MINFIN_KEY=[Your_unique_key]```
6. Install and start [Redis](http://redis.io/topics/quickstart)
7. Start app via _Node_ (_pm2_ etc...): ```node app.js```
8. App will listen to ```52190``` port on ```localhost```
9. App will download actual exchange rates in 15 min
10. You can request data from the app via ```curl localhost:52190``` shell command

## ToDo:

1. FrontEnd :)
2. Suggestions?
