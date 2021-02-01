import type { NextApiRequest, NextApiResponse } from 'next'

export default async function listZones(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
            //Fetch locations
            const covidLocationsResponse = await fetch('https://covid19-api.vost.pt/Requests/get_county_list/');
            const covidLocationsResponseJson = await covidLocationsResponse.json();

            //Define 7 days of response cache (604800 seconds)
            response.setHeader('Cache-Control','s-maxage=604800,stale-while-revalidate'); 

            //Return CovidLocationsResponseJson
            response.json(covidLocationsResponseJson);
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}
