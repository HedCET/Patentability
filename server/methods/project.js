Meteor.methods({

    insert_project: function(input) {
        this.unblock();

        check(input, {
            patent: [String],
            projectName: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var patent = _.uniq(_.map(input.patent, function(item) {

            if (_patent.findOne({
                    _id: item
                })) {

                _patent.update({
                    _id: item
                }, {
                    $addToSet: {
                        user: user._id
                    }
                });

                return item;

            } else {
                return null;
            }

        }).filter(Boolean));

        var row = _project.findOne({
            projectName: input.projectName,
            user: user._id
        });

        if (row) {
            _project.update({
                _id: row._id
            }, {
                $addToSet: {
                    patent: {
                        $each: patent
                    }
                }
            });

            patent.forEach(function(item) {

                if (!_worker.findOne({
                        patent: item,
                        project: row._id,
                        status: "",
                        type: "patent"
                    })) {

                    _worker.insert({
                        patent: item,
                        project: row._id,
                        status: "",
                        time_insert: moment().format(),
                        type: "patent",
                        user: row.user
                    });

                }

            });

            return row._id;
        } else {
            var _id = _project.insert({
                patent: patent,
                projectName: input.projectName,
                user: [user._id]
            });

            patent.forEach(function(item) {

                if (!_worker.findOne({
                        patent: item,
                        project: _id,
                        status: "",
                        type: "patent"
                    })) {

                    _worker.insert({
                        patent: item,
                        project: _id,
                        status: "",
                        time_insert: moment().format(),
                        type: "patent",
                        user: [user._id]
                    });

                }

            });

            return _id;
        }
    },

    remove_project: function(_id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(_id, String);

        var row = _project.findOne({
            _id: _id,
            user: user._id
        });

        if (row) {
            _project.update({
                _id: row._id
            }, {
                $pull: {
                    user: user._id
                }
            });

            return "1 project removed";
        } else return "notFound";
    }

});
