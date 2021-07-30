const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://freegeoip.app/json/', (error, response, body) => {
    //console.log('response--', response );
    if (error) {
      callback(error,null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response}`;
      callback(Error(msg), null);
      return;
    }

    if (response.statusCode === 200) {
      let Jres = JSON.parse(body);
      callback(null, Jres['ip']);
      return;
    }
    
  });
};
//fetchMyIP();


const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    //console.log(body);
    if (error) {
      callback(error,null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP.
      Response: ${response}`;
      callback(Error(msg), null);
      return;
    }

    let jRes = JSON.parse(body);
    let out = {};
    out['latitude'] = jRes['latitude'];
    out['longitude'] = jRes['longitude'];
    //console.log(out);
    callback(null, out);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  let lat = coords['latitude'];
  let lon = coords['longitude'];
  request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      let msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response}`;
      callback(Error(msg), null);
      return;
    }
    let jRes = JSON.parse(body);
    let out = jRes['response'];
    callback(null, out);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP( (error, ip) => {
    if(error){
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, data) =>{

    if(error){
      callback(error, null);
      return;
    }
    fetchISSFlyOverTimes(data, (error, timings) => {
      if(error){
        callback(error, null);
        return;
      }
      callback(null, timings);
      


    });
      
    
  });

}
  )}

module.exports = { nextISSTimesForMyLocation };