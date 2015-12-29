_worker_patent = function(worker_id) {

    var worker = _worker.findOne({
        _id: worker_id
    });

    // patent

    var patent = _patent.findOne({
        _id: worker.patent
    });

    if (patent) { // patent.p_no exists
        var patent_loop = HTTP.call("GET", http_proxy + "p_no.php", {
            params: {
                post_opt: "pubnumber=" + patent.p_no + "&fields=abstract,assignees,concepts,filing_date,ipcr_classification,keywords,priority_date"
            },
            timeout: 1000 * 60
        });

        if (patent_loop.statusCode === 200) {
            if (Object.prototype.toString.call(JSON.parse(patent_loop.content)) === "[object Array]") {
                var response = JSON.parse(patent_loop.content).filter(Boolean)[0];

                _patent.update({
                    _id: patent._id
                }, {
                    $set: {
                        abstract: (response.abstract ? response.abstract : null),
                        app_date: (response.filing_date ? response.filing_date : null),
                        assignee: (response.assignees ? response.assignees : null),
                        concept: (response.concepts ? response.concepts : null),
                        ipc: (response.ipcr_classification ? response.ipcr_classification : null),
                        keyword: (response.keywords ? response.keywords : null),
                        pri_date: (response.priority_date ? response.priority_date : null)
                    }
                });

                if (1 < response.length) {
                    console.log("p_no.php?pubnumber=" + patent.p_no + "&fields=abstract,assignees,concepts,filing_date,ipcr_classification,keywords,priority_date 1 < p_no result");
                }
            } else {
                console.log("p_no.php?pubnumber=" + patent.p_no + "&fields=abstract,assignees,concepts,filing_date,ipcr_classification,keywords,priority_date JSON != Object");
            }
        } else {
            console.log("p_no.php?pubnumber=" + patent.p_no + "&fields=abstract,assignees,concepts,filing_date,ipcr_classification,keywords,priority_date status-code != 200");
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
        console.log("worker.patent notFound @ " + worker_id);

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
