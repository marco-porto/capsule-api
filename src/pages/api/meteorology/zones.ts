import type { NextApiRequest, NextApiResponse } from 'next'

export default async function zones(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
        if((request.body.local != undefined && request.body.local != null && request.body.local != '' ) && (request.body.filterBy != undefined && request.body.filterBy != null && request.body.filterBy != '' )){
            //Fetch ipma locations
            const ipmaLocationsResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/meteorology/list-zones`);
            const ipmaLocationsResponseJson = await ipmaLocationsResponse.json();

            //Search for location provide on GET
            let ipmaLocation = [];

            
            if(request.body.filterBy == 'code'){ //-> by code
                ipmaLocationsResponseJson.map(obj =>  {
                    if(obj.globalIdLocal == request.body.local)
                        ipmaLocation.push(obj);
                });
            }else if(request.body.filterBy == 'name'){ //-> by name
                ipmaLocationsResponseJson.map(obj =>  {
                    if(obj.local.toLowerCase() == request.body.local.toLowerCase())
                        ipmaLocation.push(obj);
                });
            }

            //Before return ipmaLocation check if is != empty (true => return location | false => return 404 status)
            if(ipmaLocation.length != 0){
                response.json(ipmaLocation);
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
