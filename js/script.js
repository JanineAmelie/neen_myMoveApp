/*TODO:

*error message 'something went wrong, please try again' + button to retry.
* Please try the ff:
 * City is not an existing city
 * Street could be found
 * Use google's location API to validation user input.
* Data checking
*form validation
*error handling
*Wiki isn't - error failing
*/

var street;
var city;
var country;
var address;
var nytData;
var imageUrl;
var wikiArticlesList;
var loadFlag = 0;

var origHTML ='<h1 class="text-center">Where do you want to live?</h1> <form id="myForm" class="form-container"> <div class="text-center col-lg4 col-md-4 col-xs-12 ontop"> <input class="text-center" placeholder="street" type="text" id="street" required> </div> <div class="col-lg-4 col-md-4 col-xs-12 ontop"> <input class="text-center" placeholder="city" type="text" id="city" required> </div> <div class="col-lg-4 col-md-4 col-xs-12 ontop"> <input class="text-center" placeholder="country" type="text" id="country" required> </div> <div class="col-md-12 submit-cont"> <button id="submit-btn">Submit</button> </div> </form>'

var loadingHTML = '<h1 class="text-center">Loading</h1> <span class="block"><img src="images/loading.gif" width="60px" height="60px" alt="loading"></span>'

var loadedHTML = '<h1 class="text-center">Data Fetched!<h1>'

$('.data-section').hide();


$(".search-again-btn").click(function() {
    setTimeout(function() {
        clearData();
        $('.data-section').hide();
    }, 2000);
});

function scrollDown() {
    $('html, body').animate({
        scrollTop: $("#data").offset().top
    }, 2000);
    loadFlag = 0;
}

function clearData() {
    $('.media-list').html('');
    $('#wikilist').html('');
}


function backgroundChanger() {
    $('.data-section').css({ 'background': 'linear-gradient(rgba(69, 222, 247, 0.3), rgba(255, 121, 69, 0.45)), url(' + imageUrl + ')no-repeat center center fixed' });
    $('.data-section').css('background-size', 'cover!important')
}

function getUserData() {
    street = $('#street').val();
    city = $('#city').val();
    country = $('#country').val();
    address = street + ', ' + city;
    console.log("STREET: " + street + " | CITY: " + city + " | COUNTRY: " + country);
}

function displayLocationInputted() {
    $('#locationtitle span').text(address);
}

function getNytData() {
    var query = city + '+' + country;
    var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=?' + query + '&sort=newest&api-key=92752e840dc9412385a1415e5f085ccf';
    //function(data) is the callback function will only execute once the data has arrived. 200
    $.getJSON(nytURL, function(data) {
        nytData = data;
        nytData = nytData.response.docs;

        var nytHTML = '<li class="media"><div class="media-body"><span class="block date-span">%nytDate%</span><a href="%nytArtURL%"><h4 class="media-heading">%nytArtHEADLINE%</h4></a><p class="news-disc">%nytArtSNIPPET%</p><a href="%nytArtURL%">Read More..</a> </div></li>'


        var artHTMLholder = '';
        for (var i = 0; i < nytData.length; i++) {

            var tempArtHTML = nytHTML;

            var nyt_artHeadline = nytData[i].headline.main;
            var nyt_artDate = nytData[i].pub_date.slice(0, 9);
            var nyt_artSnippet = nytData[i].snippet;
            var nyt_artURL = nytData[i].web_url;

            tempArtHTML = tempArtHTML.replace('%nytDate%', nyt_artDate);
            tempArtHTML = tempArtHTML.replace('%nytArtURL', nyt_artURL);
            tempArtHTML = tempArtHTML.replace('%nytArtHEADLINE%', nyt_artHeadline);
            tempArtHTML = tempArtHTML.replace('%nytArtSNIPPET%', nyt_artSnippet);

            artHTMLholder += tempArtHTML;
        }
        $('.media-list').append(artHTMLholder);
        console.log("SUCCESS: Fetched NYT Articles")
        loadFlag += 1;
        checkFlag();

    }).fail(function(e) {
        $('h2.data-header:first').html('News articles could not be loaded please try search again');
        $('.news-items:first').remove();
        console.log("FAIL: Could not fetch NYT Articles")
    });
}

function getWikiData() {

    var listItemHTML = '<li><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><a href="%url%">%title%</a></li>'

    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&limit=13&format=json&callback=wikiCallback';

    var wikiHTMLholder = '';


    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
            wikiArticlesList = response[1];
            var partialArtURL = 'http://en.wikipedia.org/wiki/'

            for (var i = 0; i < wikiArticlesList.length; i++) {
                var tempWikiItem = listItemHTML;
                var wikiArtUrl = partialArtURL + wikiArticlesList[i];

                tempWikiItem = tempWikiItem.replace('%url%', wikiArtUrl);
                tempWikiItem = tempWikiItem.replace('%title%', wikiArticlesList[i]);

                wikiHTMLholder += tempWikiItem;

            }
            $('#wikilist').append(wikiHTMLholder);
            console.log("SUCCESS: Fetched Wiki Links");
        }

    }).done(function() {
        loadFlag += 1;
        checkFlag();
    }).fail(function(e) {
        console.log("FAIL: Could not fetch Wiki Links");
    });

}


function getStreetViewData() {
    var myKey = '&key=AIzaSyCnf2MwDkiBzMpQMN3S5EFe3JnRiKzvDDc';
    var urlstr = address.replace(/\s+/g, '');
    imageUrl = 'https://maps.googleapis.com/maps/api/streetview?size=640x400&location='+urlstr + myKey ;

    $.ajax({
        url: imageUrl,
        processData: false,
    }).done(function() {
        console.log("SUCCESS: Fetched Google street-view")
        backgroundChanger();
        loadFlag += 1;
        checkFlag();

    }).fail(function(e) {
        console.log("FAIL: Did not fetch google-street-view")
    });
}


$("#submit-btn").click(function() {
    clearData();
});

function submitAction() {
    $('#top-header').fadeOut(800, function() {
        $('#top-header').empty()
    })
    $('#top-header').fadeIn(200, function() {
        $('#top-header').html(loadingHTML)
    })

    getUserData(); //gets data from the input forms
    displayLocationInputted(); //changes the title to that of the userinputted.
    getStreetViewData();
    getNytData();
    getWikiData();

    $('.data-section').show();

    return false;
}

function checkFlag() {
    if (loadFlag === 3) {
            $('#top-header').fadeOut(200, function() {
                $('#top-header').empty()
            })

            $('.center-block').fadeIn(100, function() {
                $('#top-header').html(loadedHTML);
            })

            setTimeout(function() {
                $('.data-section').show();
                scrollDown();
            }, 2000);

            setTimeout(function() {
                $('#top-header').html(origHTML);
            }, 4000);
            loadFlag = 0;
    } else {
        console.log("not ready yet..")
    }
}


$('.search-again-btn').click(function() {
    $('#top-header').html(origHTML)
    loadFlag = 0;
})

$('#myForm').submit(submitAction);



