import type { NextApiRequest, NextApiResponse } from 'next'

export default async function forecast(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
        if(request.body.localCode != undefined && request.body.localCode != null && request.body.localCode != '' ){
            //try catch to handle json unexpected token exception (if throw, probably location code doesnt exist and IPMA API rout, redirect to IPMA home page)
            try{
                //Fetch ipma forecast for a given location code
                const ipmaForecastResponse = await fetch(`https://api.ipma.pt/public-data/forecast/aggregate/${request.body.localCode}.json`);
                const ipmaForecastResponseJson = await ipmaForecastResponse.json();
                
                //Search for location provide on GET
                let ipmaForecast = [];
                ipmaForecastResponseJson.map(obj =>  {
                    if(obj.idPeriodo == 24)
                        ipmaForecast.push(obj);
                });

                //Before return ipmaLocation check if is != empty (true => return location | false => return 404 status)
                if(ipmaForecast.length != 0){
                    response.json(ipmaForecast);
                }else{    
                    response.status(404).json({code:'Not Found'});
                }
            }catch(exception){
                response.status(404).json({code:'Not Found'});
            }
        }else{
            response.status(400).json({code:'Bad Request'}); //return 400 http code if request.body.localCode doesn't exist && == null && == empty
        }
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}

