import type { NextApiRequest, NextApiResponse } from 'next'

export default async function zones(request: NextApiRequest,response: NextApiResponse){
    //Check if request.method === GET (prevent none GET methods to this endpoint)
    if(request.method === 'GET'){
        if((request.body.local != undefined && request.body.local != null && request.body.local != '' )){
            //Fetch ipma locations
            const covidLocationsResponse = await fetch(`${process.env.CAPSULE_API_DOMAIN}api/covid/list-zones`);
            const covidLocationsResponseJson = await covidLocationsResponse.json();

            //Check if request.body.local exist on covidLocationsResponseJson (check if is a valid location)
            let localExist = false;
            covidLocationsResponseJson.map(local => {
                if(local.toLowerCase() == request.body.local.toLowerCase())
                    localExist = true;
            })

            //Fetch report if local exist
            if(localExist){
                const covidReportResponse = await fetch(`https://covid19-api.vost.pt/Requests/get_last_update_specific_county/${encodeURIComponent(request.body.local)}`);
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
