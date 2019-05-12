var socket = io('http://127.0.0.1:3000');  
var grp_msg_mirage = [];
var token = localStorage.getItem('token');
var username_holder = localStorage.getItem('username');

$("#username_top").html("Hello: "+username_holder);

          $(document).ready(function(){
              $( "#msg" ).prop( "disabled", true );
              getmembers(token);
              getgroupmsg(token);
              notifyMe();
              setInterval( function(){
                  getmembers(token);
              }, 5000);

            socket.on('signup-channel:App\\Events\\UserSignedUp', function(data) {

              var username = data.name;
             
              if (data.permission == "new") {
                 var permission = "permission_notify1";
                  $("#new_user").html($("#new_user").html() +"<li> A new member <span id='identify_member'>"+data.name+" </span>joined the chat...</li>");
                   notifyMe(permission, username);
              }else{
                 var permission = "permission_notify2";
                  $("#new_user").html($("#new_user").html() +"<li><span id='identify_member'>"+data.name+" </span> is online...</li>");
                   notifyMe(permission, username);
              }
               
                setInterval( function(){
                   $("#new_user").html("");
                }, 5000);
            });

            socket.on('message-channel:App\\Events\\MessageSent', function(data) {
                if (data.user.username != username_holder) {
                  var username = data.user.username;
                  var text = data.message.text;
                  var chat_date = new Date(data.message.created_at).toLocaleDateString();
                  var permission = "chat_notify";
                  var image = "http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg";

                 $("#show").animate({scrollTop: $("#show")[0].scrollHeight});              
                 $("#show").html($("#show").html() +"<div class='chat friend'><div class='user-photo_friend'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'></div><p id='chat_message'><span class='sender reciver'>"
                      +data.user.username+"</span><br>"+data.message.text+"<span class='time-right'>&nbsp&nbsp&nbsp&nbsp"+new Date(data.message.created_at).toLocaleDateString()+" "+ new Date(data.message.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+"</span></p></div>"); 
                    playSound(); 
                    notifyMe(permission, username, text, image, chat_date);
                }
            });
                  
  

            $(document).on('submit', '.form_input', function (e) {
                e.preventDefault();
                var message = $("#msg").val();
                var today = new Date();
                var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() ;
                if (!message == "") {
                   $("#show").html($("#show").html() +
                      "<div class='chat self'><div id='chat_message_box'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><p id='chat_message'><span class='sender'>You</span><br> "+ message+
                      "<span class='time-left'>&nbsp&nbsp&nbsp&nbsp&nbsp"+date+" "+ new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+"&nbsp<i class='fa fa-check sent' aria-hidden='true'></i></span></p></div></div>");
                   var settings = {
                      "url": "http://127.0.0.1:8000/api/message",
                      "method": "POST",
                      "timeout": 0,
                      "headers": {
                        "Authorization": "Bearer "+token,
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      "data": {
                        "message": message,
                      }
                    };
                    $("#msg").val(""); 
                    $.ajax(settings).done(function (response) {
                      console.log(response);
                      $("#show").animate({scrollTop: $("#show")[0].scrollHeight}, -500);
                      
                    });

                }
                           
            });

            function getmembers(token){
               var settings = {
                      "url": "http://127.0.0.1:8000/api/all/members",
                      "method": "GET",
                      "timeout": 0,
                      "headers": {
                        "Authorization": "Bearer "+token,
                        "Content-Type": "application/x-www-form-urlencoded"
                      }
                    };
                  $.ajax(settings).done(function (response) {
                
                    const all_member = response.data.all_member;
                      $("#all_member").html("");
                      $("#all_member").html($("#all_member").html() +"<div class='role_member' id='group_chat_box'><div id='group_chat'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><div id='member_username'><h3>All Members<span class='badge badge-light notify_icon'>New</span></h3><p class='online'>you are active in this chat</p></div></div></div>");
                      for (var i = 0; i < all_member.length; i++) {
                        if (all_member[i][1].onlinePresence) {
                          var onlinePresence = '<p class="online">online</p>';

                          $("#all_member").html($("#all_member").html() +"<div class='role_member'><div id='all_member_box'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><div id='member_username'><h3>"+all_member[i][0].username+"<span class='badge badge-light notify_icon'>9</span></h3>"+onlinePresence+"</div></div></div>");
                        }
                        
                      }

                      for (var j = 0; j < all_member.length; j++) {
                        if (!all_member[j][1].onlinePresence) {
                          var onlinePresence = '<p class="offline">offline</p>';

                          $("#all_member").html($("#all_member").html() +"<div class='role_member'><div id='all_member_box'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><div id='member_username'><h3>"+all_member[j][0].username+"<span class='badge badge-light notify_icon'>9</span></h3>"+onlinePresence+"</div></div></div>");
                        }
                        
                      }                     
                        
                  });
            }     
//Get the message from the database
            function getgroupmsg(token){
               var settings = {
                      "url": "http://127.0.0.1:8000/api/group/messages",
                      "method": "GET",
                      "timeout": 0,
                      "headers": {
                        "Authorization": "Bearer "+token,
                        "Content-Type": "application/x-www-form-urlencoded"
                      }
                    };
                  $.ajax(settings).done(function (response) {
                      var grp_msg = response.data.grp_msg;
                      var grp_msg_rev = response.data.grp_msg_rev;
                      var auth_user = response.data.auth_user;

                      $("#show").html("<div id='space'></div>");
                      if (grp_msg_rev == '') {
                        $("#show").html("<div id='no_message'>You have no recent chat...</div>");
                      }else{
                         for (var i = 0; i < grp_msg_rev.length; i++) {
                        
                            if (grp_msg_rev[i][0].owner_id ==  auth_user) {
                                 $("#show").html($("#show").html() +
                                  "<div class='chat self'><div id='chat_message_box'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><p id='chat_message'><span class='sender'>You</span><br> "
                                  + grp_msg_rev[i][0].text+"<span class='time-left'>&nbsp&nbsp&nbsp&nbsp&nbsp"
                                  +new Date(grp_msg_rev[i][0].created_at).toLocaleDateString()+" "+ new Date(grp_msg_rev[i][0].created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+"&nbsp<i class='fa fa-check sent' aria-hidden='true'></i></span></p></div></div>");
                                 $(".sent").css('color', 'lightgreen');
                            }else{                                      
                                 $("#show").html($("#show").html() +
                                  "<div class='chat friend'><div class='user-photo_friend'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'></div><p id='chat_message'><span class='sender reciver'>"
                                  +grp_msg_rev[i][1].username+"</span><br>"+grp_msg_rev[i][0].text+"<span class='time-right'>&nbsp&nbsp&nbsp&nbsp"
                                  +new Date(grp_msg_rev[i][0].created_at).toLocaleDateString()+" "+ new Date(grp_msg_rev[i][0].created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+"</span></p></div>"); 
                            }                    
                          }

                        for (var i = 0; i < grp_msg.length; i++) {
                            var packages = []

                            packages[0] = auth_user;
                            packages[1] = grp_msg[i][0].owner_id;
                            packages[2] = grp_msg[i][1].username;
                            packages[3] = grp_msg[i][0].text;
                            packages[4] = grp_msg[i][0].created_at;

                            var data_count = grp_msg_mirage.push(packages);                       
                          }
                          $("#show").animate({scrollTop: $("#show")[0].scrollHeight}, -500); 
                          $("#offset").val("20");
                      }
                  });
            } 
         
            //Get the message  for scroll purposes from the database
            function getgroupmsgscroll(token){

               var offset  = $("#offset").val();
               offset = Number(offset);
               var settings = {
                      "url": "http://127.0.0.1:8000/api/group/messages/scroll/load",
                      "method": "POST",
                      "timeout": 0,
                      "headers": {
                        "Authorization": "Bearer "+token,
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                        "data": {
                          "offset": offset,
                        }
                    };
                    console.log(offset);
                  $.ajax(settings).done(function (response) {
                      var grp_msg = response.data.grp_msg;
                      var auth_user = response.data.auth_user;
                      var new_offset = response.data.new_offset;

                      $(".messages").hide();

                      if (grp_msg == '') {
                           $(".scroll_info").show();
                      }else{
                          for (var i = 0; i < grp_msg.length; i++) {

                        var packages = [];

                        packages[0] = auth_user;
                        packages[1] = grp_msg[i][0].owner_id;
                        packages[2] = grp_msg[i][1].username;
                        packages[3] = grp_msg[i][0].text;
                        packages[4] = grp_msg[i][0].created_at;

                        var data_count = grp_msg_mirage.push(packages);  
                        
                        
                      }
                        
                      //Clear the space to aviod duplicate of the message flow
                      $("#show").html("<div id='space'></div>"); 
                      //Show the scroll message to the user 
                      for (var i = grp_msg_mirage.length-1; i >= 0; i--) {

                        if (grp_msg_mirage[i][0] ==  grp_msg_mirage[i][1]) {
                             $("#show").html($("#show").html() +
                              "<div class='chat self'><div id='chat_message_box'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'><p id='chat_message'><span class='sender'>You</span><br> "
                              + grp_msg_mirage[i][3]+"<span class='time-left'>&nbsp&nbsp&nbsp&nbsp&nbsp"
                              +new Date(grp_msg_mirage[i][4]).toLocaleDateString()+" "
                              + new Date(grp_msg_mirage[i][4]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+
                              "&nbsp<i class='fa fa-check sent' aria-hidden='true'></i></span></p></div></div>");
                             $(".sent").css('color', 'lightgreen');
                        }else{                                      
                             $("#show").html($("#show").html() +
                              "<div class='chat friend'><div class='user-photo_friend'><img src='http://res.cloudinary.com/getfiledata/image/upload/w_40,c_thumb,ar_4:4,g_face/user.jpg' alt='Avatar'></div><p id='chat_message'><span class='sender reciver'>"
                              +grp_msg_mirage[i][2]+"</span><br>"+grp_msg_mirage[i][3]+
                              "<span class='time-right'>&nbsp&nbsp&nbsp&nbsp"+new Date(grp_msg_mirage[i][4]).toLocaleDateString()+
                              " "+ new Date(grp_msg_mirage[i][4]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                              +"</span></p></div>"); 
                        }
                      }

                      $("#offset").val(new_offset);
  
                      }
                    
                  });
            } 

            $('#show').on('scroll', function() {
              // console.log($(this).scrollTop());
              // console.log($('#show').position().top);
              // console.log($("#show")[0].scrollHeight);

             // var formatter = $("#show")[0].scrollHeight - $(this).scrollTop();
               if($(this).scrollTop() == 0){  
                    $(".messages").show(); 
                    setTimeout(function(){
                      getgroupmsgscroll(token);
                    }, 3000); 
                          
                }

              if ($(this).scrollTop() >= 50) {
                 $(".scroll_info").hide();
              }

              if ($("#show")[0].scrollHeight - $("#show")[0].scrollTop === $("#show")[0].clientHeight){
                 grp_msg_mirage = [];
                 getgroupmsg(token);
               }            
            });
             //Display the group message when the All Member button is clicked
            $(document).on('click', '#group_chat', function(){
                 $("#home").hide();
                 $("#show").show();
                 $("#show").animate({scrollTop: $("#show")[0].scrollHeight}, -500); 
                 $( "#msg" ).prop( "disabled", false );
                 $("#members_toggle").prop("checked", false);
                 $("#all_member").css("display", "none");
                 dropdown(x);

            });
            //Display the member online tab when clicked
      
            $(document).on('click', '#members_toggle', function(){
                   if ($("#members_toggle").prop("checked") == true) {
                      $("#all_member").css("display", "block");
                     }else if ($("#members_toggle").prop("checked") == false){
                      $("#all_member").css("display", "none");
                     }
            });

          

      });
        function dropdown(x) {
          // Get the checkbox
          var checkBox = document.getElementById("members_toggle");
          // Get the output text
          var all_member = document.getElementById("all_member");

          // If the checkbox is checked, display the output text
          if (checkBox.checked == true && x.matches){
            all_member.style.display = "block";
            all_member.style.background = "red";
          }else if (checkBox.checked == false && x.matches) {
            all_member.style.display = "block";
          }else if (checkBox.checked == true && x.matches == false) {
            all_member.style.display = "block";
          }else {
            all_member.style.display = "none";
          }

       
        }

        var x = window.matchMedia("(min-width: 768px)");
        dropdown(x);
        x.addListener(dropdown);