import type { NextApiRequest, NextApiResponse } from 'next'

export default async function zonesList(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
            //Fetch ipma locations
            const ipmaLocationsResponse = await fetch('https://api.ipma.pt/public-data/forecast/locations.json');
            const ipmaLocationsResponseJson = await ipmaLocationsResponse.json();

            //Define 7 days of response cache (604800 seconds)
            response.setHeader('Cache-Control','s-maxage=604800,stale-while-revalidate'); 

            //Return ipmaLocationsResponseJson
            response.json(ipmaLocationsResponseJson);
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}
