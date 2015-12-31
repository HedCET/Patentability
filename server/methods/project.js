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
            var project_id = _project.insert({
                patent: patent,
                projectName: input.projectName,
                user: [user._id]
            });

            patent.forEach(function(item) {

                if (!_worker.findOne({
                        patent: item,
                        project: project_id,
                        status: "",
                        type: "patent"
                    })) {

                    _worker.insert({
                        patent: item,
                        project: project_id,
                        status: "",
                        time_insert: moment().format(),
                        type: "patent",
                        user: [user._id]
                    });

                }

            });

            return project_id;
        }
    },

    remove_project: function(project_id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(project_id, String);

        var row = _project.findOne({
            _id: project_id,
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
    },

    update_project: function(project_id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(project_id, String);

        var row = _project.findOne({
            _id: project_id,
            user: user._id
        });

        if (row) {
            if (row.match && row.position && row.position < row.match && !_worker.findOne({
                    project: row._id,
                    status: "",
                    type: "cluster"
                })) {
                _worker.insert({
                    project: row._id,
                    status: "",
                    time_insert: moment().format(),
                    type: "cluster",
                    user: row.user
                });
            }
        } else return "notFound";
    }

});
