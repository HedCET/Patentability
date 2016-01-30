_worker_echarts = function(worker_id) {

  var worker = _worker.findOne({
    _id: worker_id
  });

  // cluster

  var project = _project.findOne({
    _id: worker.project
  });

  if (project) {
    var patent = _.map(_patent.find({
      project: project._id
    }, {
      fields: {
        p_no: true
      }
    }).fetch(), function(value) {
      return value.p_no
    }).filter(Boolean);

    if (patent.length) {
      var post_opt = "q=" + (project.keyword ? "(ft:" + (project.cluster_keyword ? project.cluster_keyword : project.keyword) + ") AND " : "") + "(pn:(" + patent.join(" OR ") + "))&tf=all&type=line&xinput=allYears";

      var response = HTTP.call("GET", http_proxy + "echarts.php", {
        params: {
          post_opt: post_opt
        },
        timeout: 1000 * 60
      });

      if (response.statusCode === 200) {
        if (Object.prototype.toString.call(JSON.parse(response.content)) === "[object Object]") {
          var A = JSON.parse(response.content);

          if (A.x) {
            var Z = {};

            Z.echarts = {
              category: A.x
            };

            Z.echarts.series = {};

            A.y.forEach(function(item) {
              if (-1 < ["Filed", "Priority", "Published"].indexOf(item.name)) {
                Z.echarts.series[item.name] = (item.data ? item.data : []);
              }
            });

            _project.update({
              _id: project._id
            }, {
              $set: Z
            });
          }
        } else {
          console.log("echarts.php?" + post_opt + " JSON != Object");
        }
      } else {
        console.log("echarts.php?" + post_opt + " status-code != 200");
      }
    } else {
      console.log("patent notFound @ " + worker_id);
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
