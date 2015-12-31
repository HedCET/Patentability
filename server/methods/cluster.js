Meteor.methods({

    cluster: function(input) {
        this.unblock();

        check(input, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var http_proxy_response = HTTP.call("GET", http_proxy + "cluster.php", {
            params: {
                post_opt: "q=ft:" + input
            },
            timeout: 1000 * 60
        });

        if (http_proxy_response.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(http_proxy_response.content)) === "[object Array]") {
                var response = JSON.parse(http_proxy_response.content);

                for (var A = 0; A < response.length; A++) {
                    response[A].cluster_keyword = response[A].keyword;
                    response[A].keyword = input;
                }

                return response;
            } else {
                throw new Meteor.Error(422, "cluster.php?q=ft:" + input + " JSON != Array");
            }
        } else {
            throw new Meteor.Error(422, "cluster.php?q=ft:" + input + " status-code != 200");
        }
    },

    insert_cluster: function(input) {
        this.unblock();

        check(input, {
            cluster_keyword: String,
            keyword: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var row = _project.findOne(input);

        if (row) {
            _project.update({
                _id: row._id
            }, {
                $addToSet: {
                    user: user._id
                }
            });

            input.user = row.user;
            input._id = row._id;
        } else {
            input.match = 0;
            input.patent = [];
            input.position = 0;
            input.user = [user._id]

            input._id = _project.insert(input);
        }

        if (!_worker.findOne({
                project: input._id,
                status: "",
                type: "cluster"
            })) {
            _worker.insert({
                project: input._id,
                status: "",
                time_insert: moment().format(),
                type: "cluster",
                user: input.user
            });
        }

        return input;
    }

});
