var functions = require('firebase-functions');
var request = require('request');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

var API_KEY = "AIzaSyAa8E3U6o2Gm6VhjfvWj0HN2E1HdGfNzHU";
exports.androidPush = functions.database
.ref('/posts')
.onWrite(event =>{
    const post = event.data.val();
    if(post.sanitized){
        return
    }
    console.log("Sanitizing new post " + event.params.pushId)
    console.log(post)
    post.sanitized = true
    sendNotification();
})



function sendNotification(){
    request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      "to": "fJkkuT3fWCw:APA91bHtIyZRTJjcMhfuyIni_EgzcJrr9JirUTAIEQRFPlXJrN0LQ4FUArbam77zivvR_hniLXXVMpbEwi9A3aEEZdW_KEiVLFHeBjvp5D_rA1gHhT1oSVYpwDduH34TGLqc5MrMvctU",
  "notification": {
     "title": "Notification from MessageOnTap",
     "body": "Firebase Database Changed"
  },
  "data": {
     "titulo": "Este es el titular",
     "descripcion": "Aquí estará todo el contenido de la noticia"
  }
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage); 
    }
    else {
    }
  });
}