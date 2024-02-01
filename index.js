import express, { response } from 'express';
import axios from 'axios'

const port = 3000
const app = express();
const router = express.Router()
app.use(express.json());

app.get('/stocks', function(req,res){
    if(req.query.symbol != null){
        const symbol = req.query.symbol.toUpperCase()
        console.log(symbol)
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
        axios.get(uri)
        .then(response =>{
            res.send(response.data)
        })
        .catch(error=>{
            console.error(error)
        })
    }

)

app.listen(port, () =>
  console.log(`Server listenning on ${port}`),
);

function callYahooFinance(symbol){

}

function getLogoOfCompany(symbol){

}