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
    }

});
