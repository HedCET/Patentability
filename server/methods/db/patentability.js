Meteor.methods({

    insert_patentability: function(input) {
        this.unblock();

        check(input, {
            cluster_keyword: String,
            keyword: String
        });

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var row = patentability.findOne(input);

        if (row) {
            return row;
        } else {
            input._id = patentability.insert(input);

            //     var http_proxy_response = HTTP.call("GET", http_proxy, {
            //         params: {
            //             post: "getData.php",
            //             post_opt: "q=(ft:" + input.keyword + ")&cluster_keyword=" + input.cluster_keyword + "&action_page=cluster_keywords&start=" + start
            //         },
            //         timeout: 1000 * 60
            //     });

            // http_proxy(input);

            return input;
        }
    }

});
