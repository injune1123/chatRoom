$(document).ready(function() {
    Parse.initialize("Tf4372ftWMso7asbmDNCyxvZ7AziMvpwjwNpCVo0", "874XxU6bvaMMOvtXrOINyhiDhmgHclyf6UzzZ4sn");

    function addMessageToChatBox(username, time, text, divId) {
        if (!divId) {
            $("#liveChat").append("<br>" + time + " <span>" + username + "</span> said : <span>" + text + "</span>");
        } else {
            $("#" + divId).append("<br>" + time + " <span>" + username + "</span> said : <span>" + text + "</span>");
        }

    }

    function clearMessageAfterSubmit() {
        $('textarea').val('');
    }

    var currentUsername = prompt("WELCOME! WELCOME! WELCOME~", "Waht would you like to be called?") || "mysterious user";
    var currenTime = new Date();

    //write curretUsername to CurrentUser table
    var CurrentUser = Parse.Object.extend('CurrentUser');
    var newUser = new CurrentUser();
    newUser.set("name", currentUsername);
    newUser.save();



    // a variable hold current number of user
    var currentUserCounter = 0;
    // a variable hold entertime
    var userEnterTime;;



    // This needs to be fixed
    // join the chat
    $("#liveChat").append("<span>" + currentUsername + "</span>" + " joined the chat ...")
        // display names for all current users

    function displayNewUserName() {
        var query = new Parse.Query('CurrentUser');
        query.ascending('createdAt')
        query.find({
            success: function(result) {
                for (var i = 0; i < result.length; i++) {
                    //console.log(result[i].get('name'))
                    $("#userList").append("<p><span>" + result[i].get('name') + "</span></p>");
                    currentUserCounter++;
                    userEnterTime = result[i].get('createdAt');

                    // if(i==result.length-1){

                    //     latestUser = result[i];

                    // }
                };
            },
            error: function(error) {

            }
        });

    };

    displayNewUserName();
    //check if there is new user in the chatroom, if yes, print to screen, if some one leave, reprint the list
    function updateUser() {
        var queryZero = new Parse.Query(CurrentUser);
        queryZero.find({
            success: function(result) {

                if (result.length < currentUserCounter) {

                    $("#userList").html('');
                    currentUserCounter = 0;
                    displayNewUserName();

                    return;
                }
            },
            error: function(error) {

            }
        });
        var query = new Parse.Query(CurrentUser);

        query.greaterThan('createdAt', userEnterTime);
        query.ascending('createdAt');
        query.find({
            success: function(result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {

                        $("#userList").append("<p><span>" + result[i].get('name') + "</span></p>");
                        //reset lastest user
                        userEnterTime = result[i].get('createdAt');

                        currentUserCounter++;
                    }
                }
            },
            error: function(error) {
                //nothing yet
            }

        })
    }

    function getNewMessage() {
        var newMessage = {};
        newMessage.text = $("textarea[name='message']").val();
        newMessage.date = new Date();
        newMessage.time = " @ " + newMessage.date.getMonth() + "/" + newMessage.date.getDate() + " " + newMessage.date.getHours() + ":" + newMessage.date.getMinutes() + ":" + newMessage.date.getSeconds();
        return newMessage
    }

    function saveNewMessage(username, time, text) {
        var Message = Parse.Object.extend("Message");
        var message = new Message();

        message.set('username', username);
        message.set('text', text);
        message.set('time', time);
        message.save(null, {
            success: function(user) {
                // Execute any logic that should take place after the object is saved.
                // alert('New object created with objectId: ' + user.id);
            },
            error: function(user, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }

    $("#submitButton").click(function() {
        var newMessage = getNewMessage();
        saveNewMessage(currentUsername, newMessage.time, newMessage.text)
        clearMessageAfterSubmit();
    });

    // this displays the past history
    $("textarea[name='message']").keypress(function(e) {
        if (e.which === 13) {
            $("#submitButton").click();
        }
    });

    $("#allChatHistory").click(function() {
        $(this).empty();
        var Message = Parse.Object.extend("Message");
        var query = new Parse.Query(Message);
        query.find({
            success: function(messageList) {
                for (var i = 0; i < messageList.length; i++) {
                    var singleMessage = messageList[i];
                    addMessageToChatBox(singleMessage.get("username"), singleMessage.get("time"), singleMessage.get("text"), "pastHistory");
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })
    });

    // get new messages
    function getNewMessages() {
        var Message = Parse.Object.extend("Message");
        var query = new Parse.Query(Message);
        query.greaterThan("createdAt", currenTime);

        query.find({
            success: function(messageList) {
                for (var i = 0; i < messageList.length; i++) {
                    var singleMessage = messageList[i];
                    addMessageToChatBox(singleMessage.get("username"), singleMessage.get("time"), singleMessage.get("text"));

                    currenTime = singleMessage.createdAt;

                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })

        // query all the data after thisSessionStartTime

        // display them 

    }

    var intervalID = window.setInterval(
        function() {
            updateUser();
            getNewMessages();
        }, 1000);



    // keep doing this in every second
    //listener to window closing
    // $(window).bind("beforeunload", function() {
    //     //destroy user when closing the window
    //     newUser.destroy();
    // })
    $(window).on('beforeunload',function() {
        
        newUser.destroy();
        return "you want to leave?";
    });


});
