import type { NextApiRequest, NextApiResponse } from 'next'

function forecast(request: NextApiRequest,response: NextApiResponse){
    const dynamicDate = new Date();

    response.setHeader('Cache-Control','s-maxage=10,stale-while-revalidate');
    
    response.json({
        dataISO:dynamicDate.toISOString(),
        dataUTC:dynamicDate.toUTCString()
    });
}
export default forecast;
