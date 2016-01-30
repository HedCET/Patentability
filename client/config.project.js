project_progress = function() {
  var A = {};

  _worker.find().fetch().forEach(function(item) {
    _key(A, [item.project]);
  });

  if (document.querySelector("#project-progress")) {
    document.querySelector("#project-progress").hidden = true;
  }

  _.each(A, function(value, key, list) {
    var project = _project.findOne({
      _id: key
    });

    if (project) {
      if (document.querySelector('#project-progress[data-id="' + key + '"]')) {
        document.querySelector('#project-progress[data-id="' + key + '"]').hidden = false;
      }
    }
  });
};

project_save = function() {
  if (document.querySelector("layout-inbox")) {
    document.querySelector("#patentability_db").value = document.querySelector("layout-inbox").project;
  }
};
