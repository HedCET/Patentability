Meteor.methods({

    seed_loop: function(input) {
        this.unblock();

        check(input, String);

        // var user = Meteor.user();
        // if (!user) throw new Meteor.Error(422, "userNotFound");

        var row = patentability.findOne({
            _id: input
        });

        var seed_loop = HTTP.call("GET", http_proxy, {
            params: {
                post: "getSeedData.php",
                post_opt: "q=(ft:" + row.keyword + ")"
            },
            timeout: 1000 * 60
        });

        if (seed_loop.statusCode === 200) {
            if (JSON.parse(seed_loop.content) instanceof Object) {
                var seed = JSON.parse(seed_loop.content);

                for (var A = 0; A < seed.d1.length; A++) {
                    var patent_loop = HTTP.call("GET", http_proxy, {
                        params: {
                            post: "getPublicationNumberData.php",
                            post_opt: "pubnumber=" + seed.d1[A].pubNumber + "&fields=abstract,filing_date,assignees,concepts,keywords"
                        },
                        timeout: 1000 * 60
                    });

                    if (patent_loop.statusCode === 200) {
                        if (JSON.parse(patent_loop.content) instanceof Array) {
                            var patent = JSON.parse(patent_loop.content)[0];

                            seed.d1[A].abstract = (patent.abstract ? patent.abstract : null);
                            seed.d1[A].app_date = (patent.filing_date ? patent.filing_date : null);
                            seed.d1[A].assignee = (patent.assignees ? patent.assignees : null);
                            seed.d1[A].concept = (patent.concepts ? patent.concepts : null);
                            seed.d1[A].keyword = (patent.keywords ? patent.keywords : null);

                            if (1 < JSON.parse(patent_loop.content).length) {
                                console.log(seed.d1[A].pubNumber, "1 < result");
                            }
                        } else {
                            throw new Meteor.Error(422, "patent_loop JSON parse");
                        }
                    } else {
                        throw new Meteor.Error(422, "patent_loop");
                    }

                    seed.d1[A].p_no = seed.d1[A].pubNumber;
                    delete seed.d1[A].pubNumber;

                    seed.d1[A]._id = Random.id();

                    patentability.update({
                        _id: input
                    }, {
                        $addToSet: {
                            patent: seed.d1[A]
                        }
                    });
                }
            } else {
                throw new Meteor.Error(422, "seed_loop JSON parse");
            }
        } else {
            throw new Meteor.Error(422, "seed_loop");
        }
    }

});
