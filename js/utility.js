
//Index Utility 

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

////////////////////////////////

   function playSound() {
      const sound = new Audio();
      sound.src = "sound/new_msg_notify.mp3";
      sound.volume = 1.0;
      sound.play().catch(function() {
         console.log("Audio Not Supporteed for this broowser");
       });

    }

    function notifyMe(permission  = null, username = null, text =null, image=null, chat_date = null) {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
              alert("This browser does not support system notifications");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
              // If it's okay let's create a notification
              if (permission == "chat_notify") {

                var img = image;
                var msg = ""+username+":  "+text+ "    "+chat_date+".";
                var notification = new Notification('Hookies, New message from:', { body: msg, icon: img });

              }else if(permission == "permission_notify1"){

                var msg = "A new member "+username+" just joined the chat.";
                var notification = new Notification('Hookies, New Member:', { body: msg});   

              }else if(permission == "permission_notify2"){

                var msg = ""+username+" is currently online.";
                var notification = new Notification('Hookies,Member Online:', { body: msg});    

              }
              
            }
            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== 'denied') {
              Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                  var notification = new Notification("Hello Welcome to Hookies");
                }
              });
            }
        }