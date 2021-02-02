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

                //get weather,rain and wind types from ./types
                    //-> weather
                    const weatherTypeResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/meteorology/types/weather`);
                    const weatherTypeResponseJson = await weatherTypeResponse.json();

                    //-> rain
                    const rainTypeResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/meteorology/types/rain`);
                    const rainTypeResponseJson = await rainTypeResponse.json();

                    //-> wind
                    const windTypeResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/meteorology/types/wind`);
                    const windTypeResponseJson = await windTypeResponse.json();

                //Search for location provide on GET
                let ipmaForecast = [];
                ipmaForecastResponseJson.map(obj =>  {
                    //Only return object with 24 hour forecast (idPeriodo = 24), prevent return 1 hour forecast (idPeriodo = 1) 
                    if(obj.idPeriodo == 24){ 
                        //ipmaForecast.push(obj);
                        
                        ipmaForecast.push({
                            temperature:{
                                min:obj.tMin,
                                max:obj.tMax
                            },
                            wind:{
                                type:windTypeResponseJson[obj.idFfxVento],
                                direction:obj.ddVento
                            },
                            rain:{
                                type:rainTypeResponseJson[obj.idIntensidadePrecipita],
                                probabilityPercentage:obj.probabilidadePrecipita
                            },
                            weather:weatherTypeResponseJson[obj.idTipoTempo],
                            uv:obj.iUv
                        });
                    }
                });

                //Before return ipmaForecast check if is != empty (true => return forecast | false => return 404 status)
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

