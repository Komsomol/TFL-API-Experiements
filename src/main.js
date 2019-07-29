import utils from './utils';

//https://api.tfl.gov.uk/Place?type=NaptanMetroStation,NaptanRailStation&lat=${lat}&lon=${lon}&radius=${radius}`

// From Old Street to Walthamstow Central
const tflurls = [
  "https://api.tfl.gov.uk/Line/victoria/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/northern/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/circle/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/bakerloo/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/central/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/jubilee/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/district/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/dlr/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/metropolitan/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92",
  "https://api.tfl.gov.uk/Line/piccadilly/Status?app_id=b4a85c72&app_key=477d4bfa78405cbb4359d721fc31dd92"
];


const app = {
    TFL: 'https://api.tfl.gov.uk/journey/journeyresults/1000169/to/1000249',
    goBtn: document.querySelector('.goBtn'),
    statusBtn: document.querySelector('.statusBtn'),
    submitPostcodeBtn: document.querySelector('.submitPostcodeBtn'),
    inputField: document.querySelector('.inputField'),
    init: () =>{
        console.log('init');

        app.bindEvents();
    },

    bindEvents: () =>{
        //validaton check
        app.utils = new utils(app.inputField);

        app.goBtn.addEventListener('click', ()=>{
            console.log('calling API');
            app.getDataAsync(app.TFL).then( (result) =>{
                console.log(result);
                app.displayData(result);
            });
        });

        app.statusBtn.addEventListener('click', ()=>{
            console.log('calling API');
            app.getAllTubeStatus(tflurls).then((result) =>{
                app.showTubeStatus(result);
            });
        });

        app.submitPostcodeBtn.addEventListener('click', ()=>{
            // check if there is an input. 
            // console.log(inputCheck.validateInput());
            let test = app.utils.validateInput();

            if(test.valid){
                // console.log(inputCheck.getLatLongFromPostcode(inputCheck.passInput()));
                app.utils.getLatLongFromPostcode(app.utils.passInput()).then((data)=>{
                    app.nearStations(data.result);
                });
            } else {
                alert(test.error);
            }
        });
    },

    nearStations(location){
        console.log(location.latitude, location.longitude, location.admin_district, location.postcode);

        // search TFL API for stations close to this location. 
        app.utils.getServices(location.latitude, location.longitude).then( (result) =>{
            console.log(result);
        });
    },

    showTubeStatus:(data) => {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            // console.log(element);
            // console.log(typeof element);
            console.log(data[i][0].name + ' ' + data[i][0].lineStatuses[0].statusSeverityDescription);
            // console.log(data[i][0].lineStatuses[0].statusSeverityDescription);
        }
    },

    displayData: (data) =>{
        app.data = data;
        console.log(data.journeyVector.from);
        console.log(data.journeyVector.to);
        console.log(data.journeys[0]);
        console.log(data.journeys[0].arrivalDateTime);
        console.log(data.journeys[0].duration);
    
        console.log(app.utils.formatTime((data.journeys[0].arrivalDateTime)));
        console.log(typeof data.journeys[0].legs);

        data.journeys.forEach(element => {
            console.log(element.legs);
            element.legs.forEach(elem =>{
                console.log(`Depart from ${elem.departurePoint.commonName}`);
                console.log(`Take the ${elem.instruction.detailed}`);
                console.log(`${elem.duration} minutes`);
                console.log(`Arrive at ${elem.arrivalPoint.commonName}`);
            });
        });
        
    },
    
    getAllTubeStatus: async (urls) =>{
        const response = await Promise.all([
            app.getDataAsync(urls[0]),
            app.getDataAsync(urls[1]),
            app.getDataAsync(urls[2]),
            app.getDataAsync(urls[3]),
            app.getDataAsync(urls[4]),
            app.getDataAsync(urls[5]),
            app.getDataAsync(urls[6]),
            app.getDataAsync(urls[7]),
            app.getDataAsync(urls[8]),
            app.getDataAsync(urls[9])
        ]);
        return response;
    },

    getDataAsync: async (url) =>{
        try {
            const response = await fetch(url);
            const data = await response.json();
            return(data);
        } catch (error) {
            return(error);
        }

    },

};

window.onload = app.init;