Meteor.publish("patentability", function(query) {
    check(query, [String]);

    return patentability.find({
        _id: {
            $in: query
        }
    });
});
