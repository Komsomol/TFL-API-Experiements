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
        // UK postcode regeex
        this.pattern = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    }

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
}

