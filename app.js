$(document).ready(function() {
    Parse.initialize("Tf4372ftWMso7asbmDNCyxvZ7AziMvpwjwNpCVo0", "874XxU6bvaMMOvtXrOINyhiDhmgHclyf6UzzZ4sn");

    var username = prompt("WELCOME! WELCOME! WELCOME~", "Waht would you like to be called?") || "mysterious user";

    $("#userList").append(username);
    $("#chatbox").append(username + " joined the chat ...");

    var user = new Parse.User();

    $("#submitButton").click(function() {

        var text = $("textarea[name='message']").val();
        var date = new Date();
		var time = " @ "  + date.getHours() + ":"+ date.getMinutes() + ":" + date.getSeconds();

       	$("#chatbox").append( "<br>" + time  + " <span>" + username + "</span> said : <span>" + text +"</span>");
        user.set('username', username);
        user.set('text', text);
        user.set('time', date.getTime()	);
        console.log(user);


    })

    // user.set('',text)
})
