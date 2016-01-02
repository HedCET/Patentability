Meteor.methods({

    insert_tag: function(input) {
        this.unblock();

        check(input, {
            patent: String,
            project: String,
            tag_input: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var project = _project.findOne({
            _id: input.project,
            patent: input.patent,
            user: user._id
        });

        if (project) {
            var A = {};

            A["tag." + input.patent] = input.tag_input;

            _project.update({
                _id: project._id
            }, {
                $addToSet: A
            });

            return "1 tag added";
        } else return "notFound";
    },

    remove_tag: function(input) {
        this.unblock();

        check(input, {
            patent: String,
            project: String,
            tag_index: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var project = _project.findOne({
            _id: input.project,
            patent: input.patent,
            user: user._id
        });

        if (project) {
            var A = {};

            A["tag." + input.patent + "." + input.tag_index] = 1;

            _project.update({
                _id: project._id
            }, {
                $unset: A
            });

            A = {};

            A["tag." + input.patent] = null;

            _project.update({
                _id: project._id
            }, {
                $pull: A
            });

            return "1 tag removed";
        } else return "notFound";
    }

});
