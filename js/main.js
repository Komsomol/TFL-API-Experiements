// From Old Street to Walthamstow Central
app = {
    TFL: 'https://api.tfl.gov.uk/journey/journeyresults/1000169/to/1000249',
    goBtn: document.querySelector('.goBtn'),
    init: () =>{
        console.log('init');

        app.bindEvents();
    },

    bindEvents: () =>{
        app.goBtn.addEventListener('click', ()=>{
            console.log('calling API');
            app.call();
        });
    },

    call:()=>{
        app.getDataAsync(app.TFL).then( (result) =>{
            console.log(result);
            app.displayData(result);
        });
    },
    
    displayData: (data) =>{
        app.data = data;
        console.log(data.journeyVector.from);
        console.log(data.journeyVector.to);
        console.log(data.journeys[0]);
        console.log(data.journeys[0].arrivalDateTime);
        console.log(data.journeys[0].duration);
        console.log(new Date(data.journeys[0].arrivalDateTime).toTimeString());
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