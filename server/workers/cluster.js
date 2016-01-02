_worker_cluster = function(worker_id) {

    var worker = _worker.findOne({
        _id: worker_id
    });

    // cluster

    var project = _project.findOne({
        _id: worker.project
    });

    if (project) {
        var cluster_loop = HTTP.call("GET", http_proxy + "patent.php", {
            params: {
                post_opt: "q=ft:" + project.keyword + "&cluster_keyword=" + project.cluster_keyword + "&action_page=cluster_keywords&start=" + project.position
            },
            timeout: 1000 * 60
        });

        if (cluster_loop.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(cluster_loop.content)) === "[object Object]") {
                var cluster = JSON.parse(cluster_loop.content);

                if (cluster.d) {
                    for (var A = 0; A < cluster.d.length; A++) {
                        cluster.d[A].p_no = cluster.d[A].pubnum;
                        delete cluster.d[A].pubnum; // pubnum => p_no

                        var patent = _patent.findOne({
                            p_no: cluster.d[A].p_no
                        });

                        if (patent) {
                            _patent.update({
                                _id: patent._id
                            }, {
                                $addToSet: {
                                    project: project._id,
                                    user: {
                                        $each: project.user
                                    }
                                },
                                $set: cluster.d[A]
                            });

                            cluster.d[A]._id = patent._id;
                        } else {
                            cluster.d[A].project = [project._id];
                            cluster.d[A].user = project.user;

                            cluster.d[A]._id = _patent.insert(cluster.d[A])
                        }

                        if (!_worker.findOne({
                                patent: cluster.d[A]._id,
                                project: project._id,
                                status: "",
                                type: "patent"
                            })) {
                            _worker.insert({
                                patent: cluster.d[A]._id,
                                project: project._id,
                                status: "",
                                time_insert: moment().format(),
                                type: "patent",
                                user: project.user
                            });
                        }
                    }

                    _project.update({
                        _id: project._id
                    }, {
                        $addToSet: {
                            patent: {
                                $each: _.map(cluster.d, function(value) {
                                    return value._id
                                }).filter(Boolean)
                            }
                        },
                        $set: {
                            match: cluster.count.Matches,
                            position: cluster.count.nextStart
                        }
                    });
                }
            } else {
                console.log("patent.php?q=ft:" + project.keyword + ")&cluster_keyword=" + project.cluster_keyword + "&action_page=cluster_keywords&start=" + project.position + " JSON != Object");
            }
        } else {
            console.log("patent.php?q=ft:" + project.keyword + ")&cluster_keyword=" + project.cluster_keyword + "&action_page=cluster_keywords&start=" + project.position + " status-code != 200");
        }

        _worker.update({
            _id: worker_id
        }, {
            $set: {
                status: "200",
                time_update: moment().format()
            }
        });
    } else {
        console.log("worker.project notFound @ " + worker_id);

        _worker.update({
            _id: worker_id
        }, {
            $set: {
                status: "#",
                time_update: moment().format()
            }
        });
    }

};
