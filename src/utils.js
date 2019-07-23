export function formatTime (time){
    if(!time) return null;
    
     let date = new Date(time);
    const hours = '0' + date.getHours();
    const minutes = '0' + date.getMinutes();
    return `${hours.slice(-2)}:${minutes.slice(-2)}`;
}

export function getCoordArrayFromStr(str=''){
    if (!str) return null;
    return str.slice(3, -3).split('],[').map((item) => {
        return {
        lng: parseFloat(item.split(',')[0]),
        lat: parseFloat(item.split(',')[1])
        };
    });
}