import type { NextApiRequest, NextApiResponse } from 'next'

export default async function weatherTypes(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
            //Fetch ipma rain types
            const ipmaRainTypesResponse = await fetch('https://www.ipma.pt/bin/file.data/raintypes.json');
            const ipmaRainTypesResponseJson = await ipmaRainTypesResponse.json();

            //Define 7 days of response cache (604800 seconds)
            response.setHeader('Cache-Control','s-maxage=604800,stale-while-revalidate'); 

            //Return ipmaRainTypesResponseJson
            response.json(ipmaRainTypesResponseJson);
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}
