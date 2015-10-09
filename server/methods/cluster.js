Meteor.methods({

    cluster: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var http_proxy_response = HTTP.call("GET", http_proxy, {
            params: {
                post: "keywordCluster.php",
                post_opt: "q=(ft:" + input + ")"
            },
            timeout: 1000 * 60
        });

        if (http_proxy_response.statusCode === 200) {
            if (JSON.parse(http_proxy_response.content) instanceof Array) {
                var response = JSON.parse(http_proxy_response.content);

                for (var A = 0; A < response.length; A++) {
                    response[A].cluster_keyword = response[A].keyword;
                    response[A].keyword = input;
                }

                return response;
            } else {
                throw new Meteor.Error(422, "http_proxy_response JSON parse");
            }
        } else {
            throw new Meteor.Error(422, "http_proxy_response");
        }
    },

    cluster_loop: function(input) {
        this.unblock();

        check(input, {
            id: String,
            start: Match.Integer
        });

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var row = patentability.findOne({
            _id: input.id
        });

        if (row) {
            var cluster_loop = HTTP.call("GET", http_proxy, {
                params: {
                    post: "getData.php",
                    post_opt: "q=(ft:" + row.keyword + ")&cluster_keyword=" + row.cluster_keyword + "&action_page=cluster_keywords&start=" + input.start
                },
                timeout: 1000 * 60
            });

            if (cluster_loop.statusCode === 200) {
                if (JSON.parse(cluster_loop.content) instanceof Object) {
                    var cluster = JSON.parse(cluster_loop.content);

                    for (var A = 0; A < cluster.d.length; A++) {
                        var patent_loop = HTTP.call("GET", http_proxy, {
                            params: {
                                post: "getPublicationNumberData.php",
                                post_opt: "pubnumber=" + cluster.d[A].pubnum + "&fields=abstract,filing_date,assignees,concepts,keywords"
                            },
                            timeout: 1000 * 60
                        });

                        if (patent_loop.statusCode === 200) {
                            if (JSON.parse(patent_loop.content) instanceof Array) {
                                var patent = JSON.parse(patent_loop.content)[0];

                                cluster.d[A].abstract = (patent.abstract ? patent.abstract : null);
                                cluster.d[A].app_date = (patent.filing_date ? patent.filing_date : null);
                                cluster.d[A].assignee = (patent.assignees ? patent.assignees : null);
                                cluster.d[A].concept = (patent.concepts ? patent.concepts : null);
                                cluster.d[A].keyword = (patent.keywords ? patent.keywords : null);

                                if (1 < JSON.parse(patent_loop.content).length) {
                                    console.log(cluster.d[A].pubnum, "1 < result");
                                }
                            } else {
                                throw new Meteor.Error(422, "patent_loop JSON parse");
                            }
                        } else {
                            throw new Meteor.Error(422, "patent_loop");
                        }

                        cluster.d[A].p_no = cluster.d[A].pubnum;
                        delete cluster.d[A].pubnum;

                        cluster.d[A]._id = Random.id();

                        patentability.update({
                            _id: input.id
                        }, {
                            $addToSet: {
                                patent: cluster.d[A]
                            }
                        });
                    }

                    if (cluster.count.nextStart < cluster.count.NumRows) {
                        Meteor.call("cluster_loop", {
                            id: input.id,
                            start: cluster.count.nextStart
                        }, function(error, response) {
                            if (error) {
                                console.log(error);
                            }
                        });

                        if (100 < cluster.count.nextStart) {
                            console.log(input.id, "100 < start");
                        }
                    }
                } else {
                    throw new Meteor.Error(422, "cluster_loop JSON parse");
                }
            } else {
                throw new Meteor.Error(422, "cluster_loop");
            }
        }
    }

});
