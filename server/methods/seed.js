Meteor.methods({

    seed: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var seed_loop = HTTP.call("GET", http_proxy, {
            params: {
                post: "getSeedData.php",
                post_opt: "q=(ft:" + input + ")"
            },
            timeout: 1000 * 60
        });

        if (seed_loop.statusCode === 200) {
            if (JSON.parse(seed_loop.content) instanceof Object) {
                var seed = JSON.parse(seed_loop.content);

                return seed;
            } else {
                throw new Meteor.Error(422, "seed_loop JSON parse");
            }
        } else {
            throw new Meteor.Error(422, "seed_loop");
        }
    }

});
