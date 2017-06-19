//CONSTANTS for the page - search url and youtube api key
var YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
var API_KEY = 'AIzaSyBZXE0vm49KtEyqtucaDKCB_eAek7PNHB8';
var YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';

//Template to be shown on the page after search if implemented
var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<a class="js-result-link" href="" target="_blank">' +
      '<h2 class="js-result-name"></h2>' +
      '<img class="js-video-image" src="" alt=""/>' +
      '<p class="js-video-description"></p>' +
    '</a>' +
  '</div>'
);

//Getting data from the api
//settings includes my URL needed for each one, api key, and various parameters needed for youtub
function getDataFromApi(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      key: API_KEY,
      q: searchTerm + " in:name",
      maxResults: '12'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

//Render the results on the page
//this is where the page will use the template from above and append the information from the API output
function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-result-link").attr('href', YOUTUBE_WATCH_URL+result.id.videoId);
  template.find(".js-result-name").text(result.snippet.channelTitle);
  template.find(".js-video-image").attr("src", result.snippet.thumbnails.high.url).attr('alt', result.snippet.channelTitle);
  template.find(".js-video-description").text(result.snippet.description);

  return template;
}

//This displayes the various renders items on to the full page
function displayYoutubeData(data) {
  var results = data.items.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-search-results').html(results);
}

//submits the keyword to be added to the query string
function watchSubmit() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYoutubeData);
  });
}

// starts the whole process by firing the watch submit function
$(watchSubmit);
