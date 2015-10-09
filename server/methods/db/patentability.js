Meteor.methods({

    insert_cluster: function(input) {
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
            input.patent = [];
            input._id = patentability.insert(input);

            Meteor.call("cluster_loop", {
                id: input._id,
                start: 0
            }, function(error, response) {
                if (error) {
                    console.log(error);
                }
            });

            return input;
        }
    },

    insert_seed: function(input) {
        this.unblock();

        check(input, {
            keyword: String
        });

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var row = patentability.findOne({
            cluster_keyword: {
                $exists: false
            },
            keyword: input.keyword
        });

        if (row) {
            return row;
        } else {
            input.patent = [];
            input._id = patentability.insert(input);

            // Meteor.call("seed_loop", input._id, function(error, response) {
            //     if (error) {
            //         console.log(error);
            //     }
            // });

            return input;
        }

    }

});
