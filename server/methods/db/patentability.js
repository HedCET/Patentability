Meteor.methods({

    insert_keyword: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var q = input.replace(/[^0-9a-zA-Z]/g, " ").replace(/\s+/g, " ").trim();

        if (q.length) {
            var row = patentability.findOne({
                keyword: q
            });

            if (row) {
                return row;
            } else {
                row = {
                    keyword: q
                };

                row._id = patentability.insert(row);

                // http_proxy(keyword);

                return row;
            }
        } else {
            throw new Meteor.Error(422, "blank input");
        }
    }

});
