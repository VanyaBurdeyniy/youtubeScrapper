youtubeScrapper.controller('CrawlerController', function($rootScope, $scope, $location, $http) {

    $scope.channels = [];
    $scope.isChannels = false;

    var count = 0;
    function getCountries(data) {
        $http.post('/getcountries', data)
            .then(function (data) {
                console.log(data);
                $scope.channels = data.data;
                $scope.isChannels = true;
                $rootScope.loading = false;
            })
            .catch(function (err) {
                console.log(err);
            });
    }


    var nextPageToken, prevPageToken;
    var firstPage=true;
    $(document).ready(function() {
        $('#searchbutton').click(function() {
            $scope.channels = [];
            $rootScope.loading = true;
            gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
        });

        $('#nextPageButton').click(function() {
            console.log(nextPageToken);
            searchYouTubeApi(nextPageToken);
        });

        $('#prevPageButton').click(function() {
            console.log(prevPageToken);
            searchYouTubeApi(prevPageToken);
        });
    });

    function onYouTubeApiLoad() {
        gapi.client.setApiKey('AIzaSyCNtoNfCwKp7FGW09Aa9bRfmIyKkt1LQZc');
        searchYouTubeApi();

    }

    function searchYouTubeApi(PageToken) {
        var searchText= $('#searchtext').val();
        var request = gapi.client.youtube.search.list({
                part: 'snippet',
                q:searchText,
                type: 'channel',
                maxResults:10,
                startIndex: 50,
                order: 'viewCount',
                pageToken:PageToken
            });
        console.log(gapi);
        request.execute(onSearchResponse);
    }

    function formatDateString(date) {
        var yyyy = date.getFullYear().toString();
        var mm = padToTwoCharacters(date.getMonth() + 1);
        var dd = padToTwoCharacters(date.getDate());

        return yyyy + '-' + mm + '-' + dd;
    }

    function padToTwoCharacters(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number.toString();
        }
    }

    function onSearchResponse(response) {

        var responseString = JSON.stringify(response, '', 2);
        var resultCount = response.pageInfo.totalResults;
        nextPageToken=response.nextPageToken;
        prevPageToken=response.prevPageToken;

        console.log(response);
        getChannelStatistic(response.items);

        firstPage=false;
    }


    function getChannelStatistic(channels) {
        var ids = '';
        for (var i = 0; i < channels.length; i++) {
            if (i === channels.length) {
                ids += channels[i].id.channelId;
            } else {
                ids += channels[i].id.channelId + ',';
            }
        }

        $http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics' +
            '&id=' + ids +
            '&key=AIzaSyCNtoNfCwKp7FGW09Aa9bRfmIyKkt1LQZc')
            .then(function(data) {
                console.log(data);
                compareStatistic(data.data.items, channels);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    var channelsList = [];
    function compareStatistic(stats, channels) {
        if (channels[0]) {
            for (var i = 0; i < stats.length; i++) {
                if (channels[0] && stats[i].id === channels[0].id.channelId) {
                    channels[0].subscribers = stats[i].statistics.subscriberCount;
                    channels[0].totalView = stats[i].statistics.viewCount;
                    channelsList.push(channels[0]);
                    channels.splice(0, 1);
                    console.log(channels.length);
                    compareStatistic(stats, channels);
                }
            }
        } else {
            getCountries(channelsList);
        }
    }


});