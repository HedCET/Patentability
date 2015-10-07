Meteor.methods({

    cluster: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var http_proxy_response = HTTP.call("GET", http_proxy, {
            params: {
                post: "keywordCluster.php",
                post_opt: "q=(ft:" + input + ")"
            },
            timeout: 1000 * 60
        });

        if (http_proxy_response.statusCode === 200) {
            if (JSON.parse(http_proxy_response.content) instanceof Array) {
                var response = JSON.parse(http_proxy_response.content);

                for (var A = 0; A < response.length; A++) {
                    response[A].cluster_keyword = response[A].keyword;
                    response[A].keyword = input;
                }

                return response;
            } else {
                throw new Meteor.Error(422, "http_proxy_response JSON parse error");
            }
        } else {
            throw new Meteor.Error(422, "http_proxy_response error");
        }
    }

});
