import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

//Enable CORS
    // Initializing the cors middleware
    const cors = Cors({
        methods: ['GET', 'HEAD'],
    });

    // Helper method to wait for a middleware to execute before continuing
    // And to throw an error when an error happens in a middleware
    function runMiddleware(request: NextApiRequest, response:NextApiResponse, fn) {
        return new Promise((resolve, reject) => {
            fn(request, response, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
            })
        })
    };

export default async function zones(request: NextApiRequest,response: NextApiResponse){
    // Run the middleware
    await runMiddleware(request,response, cors)
    
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'POST'){
        if((request.body.local != undefined && request.body.local != null && request.body.local != '' ) && (request.body.filterBy != undefined && request.body.filterBy != null && request.body.filterBy != '' )){
            //Fetch locations list from ./lists/zones
            const locationsResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/meteorology/lists/zones`);
            const locationsResponseJson = await locationsResponse.json();

            //Search for location provide on GET
            let location = [];
            if(request.body.filterBy == 'code'){ //-> by code
                locationsResponseJson.map(obj =>  {
                    if(obj.globalIdLocal == request.body.local)
                        location.push(obj);
                });
            }else if(request.body.filterBy == 'name'){ //-> by name
                locationsResponseJson.map(obj =>  {
                    if(obj.local.toLowerCase() == request.body.local.toLowerCase())
                        location.push(obj);
                });
            }

            //Before return ipmaLocation check if is != empty (true => return location | false => return 404 status)
            if(location.length != 0){
                response.json(location);
            }else{
                response.status(404).json({code:'Not Found'});
            }
        }else{
            response.status(400).json({code:'Bad Request'}); //return 400 http code if request.body.local && request.body.filterBy doesn't exist && == null && == empty
        }
    }else{
        response.status(405).json({code:'Method Not Allowed'}); //return 405 http code if request.method !== GET
    }
}
