Meteor.methods({

    seed: function(input) {
        this.unblock();

        check(input, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var seed_loop = HTTP.call("GET", http_proxy + "seed.php", {
            params: {
                post_opt: "q=ft:" + input
            },
            timeout: 1000 * 60
        });

        if (seed_loop.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(seed_loop.content)) === "[object Object]") {
                var response = JSON.parse(seed_loop.content),
                    seed = {};

                if (response.d1) {
                    for (var A = 0; A < response.d1.length; A++) {
                        response.d1[A].p_no = response.d1[A].pubNumber;
                        delete response.d1[A].pubNumber; // pubNumber => p_no

                        var patent = _patent.findOne({
                            p_no: response.d1[A].p_no
                        });

                        if (patent) {
                            response.d1[A]._id = patent._id;
                        } else {
                            response.d1[A]._id = _patent.insert(response.d1[A]);
                        }
                    }

                    seed.match = response.d1.length;
                    seed.patent = response.d1;
                    seed.position = response.d1.length;
                }

                if (response.concepts) {
                    seed.cluster = [];

                    _.each(response.concepts, function(value, key) {
                        seed.cluster.push({
                            cluster_keyword: key,
                            count: value[0],
                            keyword: input
                        })
                    });

                    seed.cluster = _.sortBy(seed.cluster, "count").reverse();
                }

                return seed;
            } else {
                throw new Meteor.Error(422, "seed.php?q=ft:" + input + " JSON != Array");
            }
        } else {
            throw new Meteor.Error(422, "seed.php?q=ft:" + input + " status-code != 200");
        }
    }

});
