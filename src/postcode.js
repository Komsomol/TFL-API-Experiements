//Looks up Postcode by LAT LOG or retunrns PostCode via LAT LONG
// Uses PostCode.io

class Postcode{
    constructor(postcode){
        this.postcode = postcode;
    }

    validatePostcode(postcode){
        let regex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
        if(regex.postcode){
            return true;
        } else {
            return false;
        }
    }

    async postcode2latlong(postcode){
        try {
            const response = await fetch(`http://api.postcodes.io/postcodes/${postcode}`);
            const data = await response.json();
            return(data);
        } catch (error) {
            return(error);
        }
    }
}

module.exports = Postcode;