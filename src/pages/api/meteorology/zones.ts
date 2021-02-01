import type { NextApiRequest, NextApiResponse } from 'next'

import ipmaLocationsResponseJson from './data-temp/meteorology-locations.json'

export default async function zones(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET')
        if(request.body.local != undefined && request.body.local != null && request.body.local != '' ){
            //Fetch ipma locations
            /*const ipmaLocationsResponse = await fetch('https://api.ipma.pt/public-data/forecast/locations.json');
            const ipmaLocationsResponseJson = await ipmaLocationsResponse.json();*/

            //Search for location provide on GET
            let ipmaLocation = [];
            ipmaLocationsResponseJson.map(obj =>  {
                if(obj.local.toLowerCase() == request.body.local.toLowerCase())
                    ipmaLocation.push(obj);
            });

            //Define 10 seconds response cache
            response.setHeader('Cache-Control','s-maxage=10,stale-while-revalidate');

            //Before return ipmaLocation check if is != empty (true => return location | false => return 404 status)
            if(ipmaLocation.length != 0)
                response.json(ipmaLocation);
            else    
                response.status(404).json({code:'Not Found'});
        }else
            response.status(400).json({code:'Bad Request'}); //return 400 http code if request.body.local doesn't exist && == null && == empty
    else
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
}

