const express = require('express');
const app = express();
const port = 5000;

const mainApp = require('./app.js');
const requests = require("requests");

const router = express.Router();
const twilio = require('twilio');

function getCurrentTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, '0'); // Ensures the hour is 2 digits
  let minutes = now.getMinutes().toString().padStart(2, '0'); // Ensures the minute is 2 digits

  return `${hours}:${minutes}`;
}

require('dotenv').config();

const client = new twilio('AC46611c888d6b4e1996df88a656a91817', 'e2e7d0019e848d8d9d9857b1d8ee7d87');

app.use(express.json());

console.log(mainApp);

require('dotenv').config();

//const message 

/** 
app.use('/app', (req, res) => { client.messages.create({
  body: "Hello",
  from: "+17577859215",
  to: "+14372238244",
})
.then(message => {
  console.log(message.sid);
  res.send(message.sid);
})
.catch(error => {
  console.error(`Error sending message: ${error.message}`);
  res.status(500).send(`Error sending message: ${error.message}`);
})
});
*/

app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




const api_url = 'https://restrack-2c920-default-rtdb.firebaseio.com/users.json';
console.log("hello");
async function collectData(apiURL){
    try { 

      
      let response = await fetch(apiURL);
      let data = await response.json();

      console.log("data: " + data);
        
      return data;

    }
    catch(err){
      console.log("This is an " + err);
    }
}

setInterval(() => {
  collectData(api_url)
      .then(data => {
          console.log("Received data:", data);

          for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let sendTime = data[key].send_time;
                let goal = data[key].goal;
                console.log(`Send time for ${key}: ${sendTime}`);

                const currentTime = getCurrentTime();
                
                if(currentTime==sendTime){
                  client.messages.create({
                    body: goal,
                    from: "+17577859215",
                    to: "+14372238244",
                  })
                  .then(message => {
                    console.log(message.sid);
                  })
                  .catch(error => {
                    console.error(`Error sending message: ${error.message}`);
                  })
                }
                
            }
          }


      })
      .catch(error => {
          console.error("Error:", error);
      });
}, 5000);
