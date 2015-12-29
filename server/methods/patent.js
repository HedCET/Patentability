Meteor.methods({

    normalize: function(input) {
        this.unblock();

        check(input, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var http_proxy_response = HTTP.call("GET", http_proxy + "normalize.php", {
            params: {
                post_opt: "pnum=" + input
            },
            timeout: 1000 * 60
        });

        if (http_proxy_response.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(http_proxy_response.content)) === "[object Array]") {
                return JSON.parse(http_proxy_response.content).filter(Boolean);
            } else {
                throw new Meteor.Error(422, http_proxy + "normalize.php?" + input + " JSON != Array");
            }
        } else {
            throw new Meteor.Error(422, http_proxy + "normalize.php?" + input + " status-code != 200");
        }
    },

    patent: function(query) {
        this.unblock();

        check(query, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        var http_proxy_response = HTTP.call("GET", http_proxy + "patent.php", {
            params: {
                post_opt: query
            },
            timeout: 1000 * 60
        });

        if (http_proxy_response.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(http_proxy_response.content)) === "[object Object]") {
                var response = JSON.parse(http_proxy_response.content);

                if (_.has(response, "d")) {
                    for (var A = 0; A < response.d.length; A++) {
                        response.d[A].p_no = response.d[A].pubnum;
                        delete response.d[A].pubnum; // pubnum => p_no

                        var patent = _patent.findOne({
                            p_no: response.d[A].p_no
                        });

                        if (patent) {
                            response.d[A]._id = patent._id;
                        } else {
                            response.d[A]._id = _patent.insert(response.d[A]);
                        }
                    }

                    return {
                        match: response.count.Matches,
                        patent: response.d,
                        position: response.count.nextStart
                    };
                } else {
                    throw new Meteor.Error(422, "patent.php?" + query + " response.d notFound");
                }
            } else {
                throw new Meteor.Error(422, "patent.php?" + query + " JSON != Object");
            }
        } else {
            throw new Meteor.Error(422, "patent.php?" + query + " status-code != 200");
        }
    }

});
