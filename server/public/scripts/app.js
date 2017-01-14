$(function() {
    console.log('inside document ready function');
    var userName; //username
    var peopleArr; // data from jason stored as array
    var person; // user object
    displayDivBoxes();

    $('.display-boxes').on('click', 'div.person', function() {
        userName = $(this).attr('id');
        person = getPersonObject(peopleArr, userName);
        console.log(person);
        displayUserDetails(person);

    });





    function displayDivBoxes() {
        $.ajax({
            type: "GET",
            url: "/data",
            success: function(data) {
                peopleArr = data.people;
                console.log(peopleArr);
                data.people.forEach(function(person) {
                    appendDom(person);
                });
            }
        });
    }


}); //end of document ready function


function displayUserDetails(person) {
    var personId = $('.ajax-data').children('div').attr('id');
    var $personDetails = $('<div id=' + person.githubUserName + '><div><span>' + person.name + '</span></div>');
    $personDetails.append('<div><span>https://github.com/' + person.githubUserName + '</span></div>');
    $personDetails.append('<div><span>' + person.shoutout + '</span></div></div>');
    if (personId != undefined) {
        $('.ajax-data').children('div ' + '#' + personId).fadeOut('slow', function() {
            $('.ajax-data').children('div ' + '#' + personId).remove();
            $('.ajax-data').append($personDetails).hide().fadeIn('slow');
        });
    } else {
        $('.ajax-data').append($personDetails).hide().fadeIn('slow');

    }
}

function getPersonObject(peopleArr, userName) {

    var person = peopleArr.find(function(person) {
        return person.githubUserName === userName;
    });
    return person;
}


function appendDom(person) {

    var $divs = '<div class="person" id="' + person.githubUserName + '"></div>';
    $('.display-boxes').append($divs);


}
