Meteor.methods({

    cluster: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var q = input.replace(/[^0-9a-zA-Z]/g, " ").replace(/\s+/g, " ").trim();

        if (q.length) {
            var http_proxy_response = HTTP.call("GET", http_proxy, {
                params: {
                    q: "keywordCluster.php?q=(ft:" + q + ")"
                },
                timeout: 1000 * 60
            });

            if (http_proxy_response.statusCode === 200) {
                return http_proxy_response.content;
            }
        }
    }

});
