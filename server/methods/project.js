Meteor.methods({

  insert_project: function(input) {
    this.unblock();

    check(input, {
      patent: [String],
      projectName: String
    });

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    var project = _project.findOne({
      projectName: input.projectName,
      user: user._id
    });

    var patent = _.uniq(_.map(input.patent, function(item) {
      return (_patent.findOne({
        _id: item
      }) ? item : null);
    }).filter(Boolean));

    if (project) {
      _project.update({
        _id: project._id
      }, {
        $addToSet: {
          patent: {
            $each: patent
          }
        }
      });

      _patent.update({
        _id: {
          $in: patent
        }
      }, {
        $addToSet: {
          project: project._id,
          user: user._id
        }
      }, {
        multi: true
      });

      patent.forEach(function(item) {

        if (!_worker.findOne({
            patent: item,
            project: project._id,
            status: "",
            type: "patent"
          })) {

          _worker.insert({
            patent: item,
            project: project._id,
            status: "",
            time_insert: moment().format(),
            type: "patent",
            user: project.user
          });

        }

      });

      if (!_worker.findOne({
          project: project._id,
          status: "",
          type: "echarts"
        })) {
        _worker.insert({
          project: project._id,
          status: "",
          time_insert: moment().format(),
          type: "echarts",
          user: project.user
        });
      }

      return project._id;
    } else {
      var project_id = _project.insert({
        patent: patent,
        projectName: input.projectName,
        user: [user._id]
      });

      _patent.update({
        _id: {
          $in: patent
        }
      }, {
        $addToSet: {
          project: project_id,
          user: user._id
        }
      }, {
        multi: true
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

      if (!_worker.findOne({
          project: project_id,
          status: "",
          type: "echarts"
        })) {
        _worker.insert({
          project: project_id,
          status: "",
          time_insert: moment().format(),
          type: "echarts",
          user: [user._id]
        });
      }

      return project_id;
    }
  },

  remove_project: function(project_id) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(project_id, String);

    var project = _project.findOne({
      _id: project_id,
      user: user._id
    });

    if (project) {
      _project.update({
        _id: project._id
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

    var project = _project.findOne({
      _id: project_id,
      user: user._id
    });

    if (project) {
      if (project.match && project.position && project.position < project.match && !_worker.findOne({
          project: project._id,
          status: "",
          type: "cluster"
        })) {

        _worker.insert({
          project: project._id,
          status: "",
          time_insert: moment().format(),
          type: "cluster",
          user: project.user
        });

      }
    } else return "notFound";
  }

});
