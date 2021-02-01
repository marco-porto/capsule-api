function forecast(request,response){
    const dynamicDate = new Date();

    response.json({
        data:dynamicDate
    });

}
export default forecast;
