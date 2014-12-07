app.factory('Instagram', function($http, $rootScope) {

  //console.log($rootScope.user_id);
  //console.log($rootScope.user_token);

  var Instagram = function() {
    this.items = [];
    this.busy = false;
    this.next_max_id = -1;
    this.next_url = '';
    this.user_id = $rootScope.user.id;
    this.user_token = $rootScope.user.token;
    //this.after = '';
  };

  Instagram.prototype.nextPageFeed = function() {
    if (this.busy) return;
    this.busy = true;

    //console.log(this.user_id);
    //console.log(this.user_token);

    var url_feed = "https://api.instagram.com/v1/users/self/feed?access_token=" + this.user_token + "&count=10&callback=JSON_CALLBACK";
    if (this.next_max_id != -1) {
      url_feed += "&max_id=" + this.next_max_id;
    }

    // next_url does not include max_id parameter by default
    //if(this.next_url !== ''){
    //  url_feed = this.next_url;
    //}

    $http.jsonp(url_feed).success(function(returnJSONP) {
      //console.log(returnJSONP.pagination);
      //console.log(returnJSONP.pagination.next_max_id);
      this.next_max_id = returnJSONP.pagination.next_max_id;
      this.next_url = returnJSONP.pagination.next_url;
      var items = returnJSONP.data;
      for (var i = 0; items && i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.busy = false;
    }.bind(this));
  };

  Instagram.prototype.nextPageFollows= function() {
    if (this.busy) return;
    this.busy = true;

    var url_feed = "https://api.instagram.com/v1/users/" +
        this.user_id + "/follows?access_token=" + 
        this.user_token + "&callback=JSON_CALLBACK";

    //console.log(url_feed);
    //console.log(this.next_url);

    if(this.next_url !== ''){
      url_feed = this.next_url;
    }

    $http.jsonp(url_feed).success(function(returnJSONP) {
      //console.log(returnJSONP.pagination);
      //console.log(returnJSONP.pagination.next_max_id);
      this.next_max_id = returnJSONP.pagination.next_max_id;
      this.next_url = returnJSONP.pagination.next_url;
      var items = returnJSONP.data;
      for (var i = 0; items && i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.busy = false;
    }.bind(this));
  };

  return Instagram;
});