$(function() {
    console.log('inside document ready function');
    var userName; //username
    var peopleArr; // data from jason stored as array
    var person; // user object
    var isTimeReset = false;

    // function call to display the click buttons
    displayDivBoxes();

    // set time interval of 10 seconds before displaying next message
    var timeIntervalVar = setInterval(timeIntervalFunc, 10000);



    // this event  lets the user select any  of the 17 buttons on display.
    $('.display-boxes').on('click', 'div.person', function() {
        userName = $(this).attr('id');
        person = getPersonObject(peopleArr, userName);
        //  console.log(person);
        //displayUserDetails(person);
        resetTimer(true, person);
    });

    // this event is triggered when user clicks on  "next".
    $('.display-boxes').on('click', 'div#next', function() {
        console.log("next buton click.....");
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == (peopleArr.length - 1) || index == -1) {
            //displayUserDetails(peopleArr[0]);
            resetTimer(true, peopleArr[0]);
        } else {
            //displayUserDetails(peopleArr[index + 1]);
            resetTimer(true, peopleArr[index + 1]);
        }
    });


    // this event is triggered when user click on "prev".
    $('.display-boxes').on('click', 'div#prev', function() {
        console.log("previous buton click.....");
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == -1 || index == 0) {
            //displayUserDetails(peopleArr[peopleArr.length-1]);
            resetTimer(true, peopleArr[peopleArr.length - 1]);
        } else {
            // displayUserDetails(peopleArr[index - 1]);
            resetTimer(true, peopleArr[index - 1]);
        }
    });


    // initial ajax call to the nodejs server to fetch data from the json object.
    function displayDivBoxes() {
        $.ajax({
            type: "GET",
            url: "/data",
            success: function(data) {
                peopleArr = data.people;
                //console.log(peopleArr);
                data.people.forEach(function(person) {
                    appendDom(person);
                });
            }
        });
    }

    // this function is called every 10 seconds automatically from  the setInterval method
    function timeIntervalFunc() {
        userName = $('.ajax-data').children('div').attr('id');
        var index = peopleArr.findIndex(function(person) {
            return person.githubUserName == userName;
        });

        if (index == (peopleArr.length - 1) || index == -1) {
            // displayUserDetails(peopleArr[0]);
            resetTimer(false, peopleArr[0]);
        } else {
            // displayUserDetails(peopleArr[index+1]);
            resetTimer(false, peopleArr[index + 1]);
        }
    }

   // this function is call to reset time on  the setInterval function
   // this also calls function displayUserDetails to display user details
    function resetTimer(isTimeReset, person) {
        if (isTimeReset) {
            clearInterval(timeIntervalVar);
            timeIntervalVar = setInterval(timeIntervalFunc, 10000);
            isTimeReset = false;
        }
        displayUserDetails(person);
    }
}); //end of document ready function


// user display details
function displayUserDetails(person) {
     // change the color of clicked div.
    $('.display-boxes').children('#' + person.githubUserName).css("background-color", "tomato");

    // existing username on display stored to a variable
    var userName = $('.ajax-data').children('div').attr('id');

    // reset color of previous div to grey.
    $('.display-boxes').children('#' + userName).css("background-color", "grey");

    var $personDetails = $('<div class="userDetails" id=' + person.githubUserName + '><div><span>' + person.name + '</span></div>');
    $personDetails.append('<div><span>https://github.com/' + person.githubUserName + '</span></div>');
    $personDetails.append('<div><span>' + person.shoutout + '</span></div></div>');

    if (userName != undefined) {
            $('.ajax-data').children('div ' + '#' + userName).fadeOut('slow', function() {
            $('.ajax-data').children('div ' + '#' + userName).remove();
            $('.ajax-data').append($personDetails).hide().fadeIn('slow');
        });
    } else {
          $('.ajax-data').append($personDetails).hide().fadeIn('slow');
    }
}


// iterator to get object from array based on input of userName.
function getPersonObject(peopleArr, userName) {
    var person = peopleArr.find(function(person) {
        return person.githubUserName === userName;
    });
    return person;
}



// append div buttons to the page
function appendDom(person) {
    var $divs = '<div class="person" id="' + person.githubUserName + '"></div>';
    $('.display-boxes').append($divs);
}
