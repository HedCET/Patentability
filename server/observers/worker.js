_worker.find({
    status: "",
    type: {
        $in: ["cluster", "patent", "seed"]
    }
}).observe({
    added: function(row) {
        switch (row.type) {
            case "cluster":
                Meteor.setTimeout(function() {
                    _worker_cluster(row._id);
                }, 400);
                break;

            case "patent":
                Meteor.setTimeout(function() {
                    _worker_patent(row._id);
                }, 400);
                break;
        }
    }
});
