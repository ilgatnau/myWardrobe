app.factory('Instagram', function($http) {
  var Instagram = function() {
    this.items = [];
    this.busy = false;
    this.next_max_id = -1;
    this.next_url = '';
    //this.after = '';
  };

  Instagram.prototype.nextPageFeed = function() {
    if (this.busy) return;
    this.busy = true;

    var url_feed = "https://api.instagram.com/v1/users/self/feed?access_token=" + user_token + "&callback=JSON_CALLBACK";
    url_feed += "&count=10";
    if (this.next_max_id != -1) {
      url_feed += "&max_id=" + this.next_max_id;
    }

    $http.jsonp(url_feed).success(function(returnJSONP) {
      console.log(returnJSONP.pagination);
      console.log(returnJSONP.pagination.next_max_id);
      this.next_max_id = returnJSONP.pagination.next_max_id;
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

    var url_feed = "https://api.instagram.com/v1/users/self/feed?access_token=" + user_token + "&callback=JSON_CALLBACK";
    url_feed += "&count=10";
    if (this.next_max_id != -1) {
      url_feed += "&max_id=" + this.next_max_id;
    }

    $http.jsonp(url_feed).success(function(returnJSONP) {
      console.log(returnJSONP.pagination);
      console.log(returnJSONP.pagination.next_max_id);
      this.next_max_id = returnJSONP.pagination.next_max_id;
      var items = returnJSONP.data;
      for (var i = 0; items && i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.busy = false;
    }.bind(this));
  };

  return Instagram;
});