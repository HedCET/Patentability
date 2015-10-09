Template.inbox.rendered = function() {
    patentability.find().observe({
        added: function(row) {
            document.querySelector("layout-inbox").bind(row);
        },

        changed: function(row, old) {
            document.querySelector("layout-inbox").bind(row);
        },

        removed: function(old) {
            document.querySelector("layout-inbox").bind(old, true);
        }
    });
};
