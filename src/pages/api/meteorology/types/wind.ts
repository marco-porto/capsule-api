import type { NextApiRequest, NextApiResponse } from 'next'

export default async function weatherTypes(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
            //Fetch ipma wind types
            const ipmaWindTypesResponse = await fetch('https://www.ipma.pt/bin/file.data/windtypes.json');
            const ipmaWindTypesResponseJson = await ipmaWindTypesResponse.json();

            //Define 7 days of response cache (604800 seconds)
            response.setHeader('Cache-Control','s-maxage=604800,stale-while-revalidate'); 

            //Return ipmaWindTypesResponseJson
            response.json(ipmaWindTypesResponseJson);
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}
