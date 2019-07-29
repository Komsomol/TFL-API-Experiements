/*
Class check if input is valid and the input is a valid UK postcode
Invocation:
  let inputCheck = new inputValidation(app.inputField);
Usage:
    let test = inputCheck.validateInput();

    if(test.valid){
        console.log('Search Postcode')
    } else {
        alert(test.error);
    }
*/
export default class InputValidator{
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
            const response = await fetch(`http://api.postcodes.io/postcodes/${postcode}`);
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
}

