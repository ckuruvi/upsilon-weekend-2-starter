$(function() {
    var userName; //username
    var peopleArr; // data from jason stored as array
    var person; // user object
    var isTimeReset = false;  // resets timer after ever user click

    // function call to display the click buttons
    displayDivBoxes();

    // set time interval of 10 seconds before displaying next message
    var timeIntervalVar = setInterval(timeIntervalFunc, 10000);



    // this event  lets the user select any  of the 17 buttons on display.
    $('.display-boxes').on('click', 'div.person', function() {

        isTimeReset=true;  //timer reset
        userName = $(this).attr('id');
        person = getPersonObject(peopleArr, userName);
        //displayUserDetails(person);
        resetTimer(isTimeReset, person);
    });

    // this event is triggered when user clicks on  "next" button.
    $('.buttons').on('click', '#next', function() {
        isTimeReset=true;  //timer reset
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == (peopleArr.length - 1) || index == -1) {
            //displayUserDetails(peopleArr[0]);
            resetTimer(isTimeReset, peopleArr[0]);
        } else {
            //displayUserDetails(peopleArr[index + 1]);
            resetTimer(isTimeReset, peopleArr[index + 1]);
        }
    });


    // this event is triggered when user click on "prev" button.
    $('.buttons').on('click', '#prev', function() {
        isTimeReset=true;  //timer reset
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == -1 || index == 0) {
            //displayUserDetails(peopleArr[peopleArr.length-1]);
            resetTimer(isTimeReset, peopleArr[peopleArr.length - 1]);
        } else {
            // displayUserDetails(peopleArr[index - 1]);
            resetTimer(isTimeReset, peopleArr[index - 1]);
        }
    });


    // initial ajax call to the nodejs server to fetch data from the json object.
    function displayDivBoxes() {
        $.ajax({
            type: "GET",
            url: "/data",
            success: function(data) {
                peopleArr = data.people;
                var pageLoad=true; //boolean value to display details of the first user on initial load
                data.people.forEach(function(person) {
                  if(pageLoad){
                    appendDom(person,pageLoad);
                    pageLoad=false;
                  }else{
                    appendDom(person,pageLoad);
                  }
                });
            }
        });
    }

    // this function is called every 10 seconds automatically from  the setInterval method
    function timeIntervalFunc() {
        isTimeReset=false;  //timer reset
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == (peopleArr.length - 1) || index == -1) {
            // displayUserDetails(peopleArr[0]);
            resetTimer(isTimeReset, peopleArr[0]);
        } else {
            // displayUserDetails(peopleArr[index+1]);
            resetTimer(isTimeReset, peopleArr[index + 1]);
        }

    }

    // this function is call to reset time on  the setInterval function
    // this also calls function displayUserDetails to display user details
    function resetTimer(isTimeReset, person) {
        if (isTimeReset) {
            clearInterval(timeIntervalVar);
            timeIntervalVar = setInterval(timeIntervalFunc, 10000);
            isTimeReset = false;
            displayUserDetails(person);
        }
        displayUserDetails(person);
    }

}); //jquery document ready function end


// user display details
function displayUserDetails(person) {
    // existing username on display stored to a variable
    var userName = $('.ajax-data').children('div').attr('id');

    // reset color of previous div to grey.
    $('.display-boxes').children('#' + userName).css("background-color", "grey");

    var $personDetails = $('<div class="userDetails" id=' + person.githubUserName + '><div><span>' + person.name + '</span></div>');
    $personDetails.append('<div><span>https://github.com/' + person.githubUserName + '</span></div>');
    $personDetails.append('<div><span>' + person.shoutout + '</span></div></div>');

    if (userName != undefined) {
        $('.ajax-data').children('div ' + '#' + userName).fadeOut('fast', function() {
            $('.ajax-data').children('div ' + '#' + userName).remove();
            $('.ajax-data').append($personDetails).hide().fadeIn('fast');
            // change the color of clicked div.
            $('.display-boxes').children('#' + person.githubUserName).css("background-color", "tomato");
        });
    } else {
        $('.ajax-data').append($personDetails).hide().fadeIn('fast');
        // change the color of clicked div.
        console.log($('.display-boxes').children('#' + person.githubUserName));
        $('.display-boxes').children('#' + person.githubUserName).css("background-color", "tomato");
    }

}  // displayUserDetails function end


// iterator to get object from array based on input of userName.
function getPersonObject(peopleArr, userName) {
    var person = peopleArr.find(function(person) {
        return person.githubUserName === userName;
    });
    return person;
} //getPersonObject function end



// append div buttons to the page
function appendDom(person,pageLoad) {
    if(pageLoad){
      displayUserDetails(person);
    }
    var $divs = '<div class="person" id="' + person.githubUserName + '"></div>';
    $('.display-boxes').append($divs);
}  // appendDom function end
