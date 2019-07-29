/*
Class check if input is valid and the input is a valid UK postcode
Invocation:
  let utils = new inputValidation(app.inputField);
Usage:
    let test = utils.validateInput();

    if(test.valid){
        console.log('Search Postcode')
    } else {
        alert(test.error);
    }
*/
export default class Utils{
    constructor(inputClass){
        this.inputClass = inputClass;
        this.postcode = '';
        // UK postcode regeex
        this.pattern = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    }

    // validation check for inputs
    validateInput(){
        if(this.inputClass.value.length > 0){
            if(this.pattern.test(this.inputClass.value)){
                return {valid: true, error:"Entered Postcode is valid."};
            } else {
                return {valid: false, error:"Enter a valid postcode!"};
            }
        } else {
            return {valid: false, error:"Enter a postcode!"};
        }
    }

    // returns what the input was
    passInput(){
        if(this.inputClass.value){
            return this.inputClass.value;
        }
    }

    // returns lat long for post code
    async getLatLongFromPostcode(postcode){
        try {
            const query = await fetch(`http://api.postcodes.io/postcodes/${postcode}`);
            const result = await query.json();
            return result;
        } catch (error) {
            return error;
        }
    }

    // return closest metro/rail stations in a radius of 500 meters
    async getServices(lat,lon,radius = 1000){
        try {
            console.log((`https://api.tfl.gov.uk/Place?type=NaptanMetroStation,NaptanRailStation&lat=${lat}&lon=${lon}&radius=${radius}`));
            const query = await fetch(`https://api.tfl.gov.uk/Place?type=NaptanMetroStation,NaptanRailStation&lat=${lat}&lon=${lon}&radius=${radius}`);
            const result = await query.json();
            return result;
        } catch (error) {
            return error;
        }
    }

    //path from one lat,lon to another lat,lon
    // https://api.tfl.gov.uk/journey/journeyresults/51.501,-0.123/to/51.585354,-0.016477
    async route(origin_lat,origin_lon, destination_lat,destination_lon){
        try {
            const query = await fetch(`https://api.tfl.gov.uk/journey/journeyresults/${origin_lat},${origin_lon}/to/${destination_lat},${destination_lon}`);
            const result = await query.json();
            return result;
        } catch (error) {
            return error;
        }
    }

    formatTime (time){
        if(!time) return null;    
        let date = new Date(time);
        const hours = '0' + date.getHours();
        const minutes = '0' + date.getMinutes();
        return `${hours.slice(-2)}:${minutes.slice(-2)}`;
    }

    getCoordArrayFromStr(str=''){
        if (!str) return null;
        return str.slice(3, -3).split('],[').map((item) => {
            return {
                lng: parseFloat(item.split(',')[0]),
                lat: parseFloat(item.split(',')[1])
            };
        });
    }
}

