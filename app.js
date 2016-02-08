$(document).ready(function() {
    Parse.initialize("Tf4372ftWMso7asbmDNCyxvZ7AziMvpwjwNpCVo0", "874XxU6bvaMMOvtXrOINyhiDhmgHclyf6UzzZ4sn");

    function addMessageToChatBox(username, time, text,divId) {
        if(!divId){
        $("#chatbox").append("<br>" + time + " <span>" + username + "</span> said : <span>" + text + "</span>");
        }else{
            $("#"+divId).append("<br>" + time + " <span>" + username + "</span> said : <span>" + text + "</span>");
        }

    }

    function clearMessageAfterSubmit() {
        $('textarea').val('');
    }

    var currentUsername = prompt("WELCOME! WELCOME! WELCOME~", "Waht would you like to be called?") || "mysterious user";

    (function displayNewUserName() {
        $("#userList").append("<span>" + currentUsername + "</span>");
        $("#chatbox").append("<span>" + currentUsername + "</span>" + " joined the chat ...");
    })()

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
        addMessageToChatBox(currentUsername, newMessage.time, newMessage.text);
        saveNewMessage(currentUsername, newMessage.time, newMessage.text)
        clearMessageAfterSubmit();
    });

    // this displays the past history
    $("#allChatHistory").click(function() {
        $(this).empty();
        var Message = Parse.Object.extend("Message");
        var query = new Parse.Query(Message);
        query.find({
            success: function(messageList) {
                for (var i = 0; i < messageList.length; i++) {
                    var singleMessage = messageList[i];
                    addMessageToChatBox(singleMessage.get("username"), singleMessage.get("time"), singleMessage.get("text"),"pastHistory");

                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })
    });

    // get new messages
    



})
