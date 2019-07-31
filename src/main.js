import utils from './utils';
import './css/main.css';
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
    submitRouteBtn: document.querySelector('.submitRouteBtn'),
    originInput: document.querySelector('.originInput'),
    destInput: document.querySelector('.destInput'),
    resultscreen: document.querySelector('.results'),
    tubestatus: document.querySelector('.tubestatus'),
    init: () =>{
        console.log('init');

        app.bindEvents();
    },

    bindEvents: () =>{
        //validaton check
        app.utils = new utils(app.originInput);
        app.utils_des = new utils(app.destInput);
        
        // search using station id from work to home
        app.goBtn.addEventListener('click', ()=>{
            console.log('calling API');
            app.getDataAsync(app.TFL).then( (result) =>{
                console.log(result);
                app.displayData(result);
            });
        });
        
        // tube status for all lines
        app.statusBtn.addEventListener('click', ()=>{
            console.log('calling API');
            app.getAllTubeStatus(tflurls).then((result) =>{
                app.showTubeStatus(result);
            });
        });
        
        // look up postcode to find local stations
        app.submitPostcodeBtn.addEventListener('click', ()=>{
            // check if there is an input. 
            let test = app.utils.validateInput();

            if(test.valid){
                app.utils.getLatLongFromPostcode(app.utils.passInput()).then((data)=>{
                    app.nearStations(data.result);
                });
            } else {
                alert(test.error);
            }
        });

        // route from point to point
        app.submitRouteBtn.addEventListener('click', ()=>{
            //route postcode to postcode
            console.log("routing");

            let origin = app.utils.validateInput();
            let dest = app.utils_des.validateInput();

            if(origin.valid && dest.valid){
                console.log("both valid");
                //transfrom both postcodes to lat long
                app.route = [];
                app.utils.getLatLongFromPostcode(app.utils.passInput()).then((data)=>{
                    app.route.push(data.result);
                    app.utils.getLatLongFromPostcode(app.utils_des.passInput()).then((data)=>{
                        app.route.push(data.result);
                        app.routingSystem();
                    });
                });
            } else {
                alert(`${origin.error} ... ${dest.error}`);
            }
            
        });
    },

    routingSystem:()=>{
        console.log(app.route);
        console.log(app.route[0].latitude, app.route[0].longitude);
        app.utils.route(app.route[0].latitude, app.route[0].longitude, app.route[1].latitude, app.route[1].longitude).then( (data)=>{
            console.log(data);
            app.renderData(data);
        });
    },

    renderData:(data)=>{
        console.log(data.journeys.length);

        for (let i = 0; i < data.journeys.length; i++) {
            const element = data.journeys[i];
            console.log(`Estimated time of arrival is ${app.utils.formatTime(data.journeys[i].arrivalDateTime)}`);
            console.log(`Duration of journey is ${data.journeys[i].duration}`);
        }
    },

    nearStations(location){
        console.log(location.latitude, location.longitude, location.admin_district, location.postcode);

        // search TFL API for stations close to this location. 
        app.utils.getServices(location.latitude, location.longitude).then( (result) =>{
            console.log(result);
        });
    },

    // tube status
    showTubeStatus:(data) => {
        const c = document.createDocumentFragment();

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let e = document.createElement("div");
            e.className = `tube-status ${data[i][0].name}`;
            e.textContent = `${data[i][0].name} is currently running with a ${data[i][0].lineStatuses[0].statusSeverityDescription}`;
            c.appendChild(e);
            console.log(data[i][0].name + ' ' + data[i][0].lineStatuses[0].statusSeverityDescription);
            // console.log(data[i][0].lineStatuses[0].statusSeverityDescription);
        }

        app.tubestatus.appendChild(c);
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