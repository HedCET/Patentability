Meteor.publish("project", function(project_id) {
    check(project_id, String);

    if (project_id == "#") {
        return _project.find({
            user: this.userId
        }, {
            fields: {
                user: false
            },
            sort: {
                time: -1
            }
        });
    } else {
        return _project.find({
            _id: project_id,
            user: this.userId
        }, {
            fields: {
                user: false
            },
            sort: {
                time: -1
            }
        });
    }
});

Meteor.publish("patent", function(input) {
    check(input, {
        patent: [String],
        project: String
    });

    return _patent.find({
        _id: {
            $in: input.patent
        },
        project: input.project,
        user: this.userId,
        user_removed: {
            $ne: this.userId
        }
    }, {
        fields: {
            project: false,
            user: false,
            user_removed: false
        },
        limit: 250,
        sort: {
            time: -1
        }
    });
});

Meteor.publish("worker", function() {
    return _worker.find({
        status: "",
        user: this.userId
    }, {
        fields: {
            user: false
        },
        limit: 100,
        sort: {
            time_insert: -1
        }
    });
});
