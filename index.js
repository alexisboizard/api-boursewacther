import express, { response } from 'express';
import axios from 'axios'

const port = 3000
const app = express();
const router = express.Router()
app.use(express.json());

app.get('/stocks', function(req,res){
    if(req.query.symbol != null){
        const symbol = req.query.symbol.toUpperCase()
        const uri = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        axios.get(uri)
            .then(response=> {
                const logoUri = `https://api.api-ninjas.com/v1/logo?ticker=${symbol}`
                const header = {
                    "X-Api-Key" : "4RUsU+jxeew1Qbf0GiypvA==LNEOrbjRY9HR8KFh",
                }
                const param = {
                    ticker : symbol,
                }
                console.log(logoUri)
                axios.get(logoUri, {headers : header})
                    .then(response2=> {
                        const combinedData = {
                            data : response.data,
                            logo : response2.data
                        }
                        res.send(combinedData)
                    })
                    .catch(error=>{
                        console.error(error)
                    })
            })
            .catch(error=>{
                console.error(error)
            })
    }
});

app.get('/search', function(req,res){
    if(req.body.symbol != null){
        const uri = `https://query1.finance.yahoo.com/v1/finance/search?q=${req.body.symbol}`
        axios.get(uri)
        .then(response =>{
            res.send(response.data)
        })
        .catch(error=>{
            console.error(error)
        })
    }
})

app.get('/daygainers', function(req,res){
        const uri = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_gainers&count=50`
        let resArray = []
        let cpt = 0
        axios.get(uri)
        .then(response =>{
            let array = []
            for (let i = 0; i < response.data.finance.result[0].quotes.length; i++) {
                array.push(response.data.finance.result[0].quotes[i].symbol)
                const logoUri = `https://api.api-ninjas.com/v1/logo?ticker=${response.data.finance.result[0].quotes[i].symbol}`
                const header = {
                    "X-Api-Key" : "4RUsU+jxeew1Qbf0GiypvA==LNEOrbjRY9HR8KFh",
                }
                axios.get(logoUri, {headers : header})
                    .then(response2=> {
                        let newJson = JSON.stringify(response.data.finance.result[0].quotes[i])
                        newJson = newJson.substring(0, newJson.length - 1)
                        if(response2.data[0] != null){
                            newJson += ', "image" :' + JSON.stringify(response2.data[0].image)
                        }else[
                            newJson += ',"name":"null" , "ticker" : "null", "image" : "null"'
                        ]
                        const detailsUri = `https://query1.finance.yahoo.com/v8/finance/chart/${response.data.finance.result[0].quotes[i].symbol}`
                        axios.get(detailsUri)
                            .then(response3=>{
                                const open = response3.data.chart.result[0].indicators.quote[0].open
                                const close = response3.data.chart.result[0].indicators.quote[0].close
                                const volume = response3.data.chart.result[0].indicators.quote[0].volume
                                newJson += ', "open" :' + JSON.stringify(open) + ', "close" :' + JSON.stringify(close) + ', "volume" :' + JSON.stringify(volume) + '}'
                                newJson = JSON.parse(newJson)
                                resArray.push(newJson)
                            })
                    })
                    .catch(error=>{
                        console.error(error)
                    })
                    .finally(() =>{
                        cpt++
                        if(cpt === 50){
                            res.send(resArray)
                        }
                    })
            }
            
        })
        .catch(error=>{
            console.error(error)
        })
    }

)

app.get('/test', function(req,res){
    if(req.query.symbol != null){
        const symbol = req.query.symbol.toUpperCase()
        const uri = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        axios.get(uri)
            .then(response=> {
                res.send(response.data.chart.result[0].indicators.quote[0].open)
            })
            .catch(error=>{
                console.error(error)
            })
    }
});

app.listen(port, () =>
  console.log(`Server listenning on ${port}`),
);