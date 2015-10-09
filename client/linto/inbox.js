Template.inbox.rendered = function() {
    patentability.find().observe({
        added: function(row) {
            document.querySelector("layout-inbox").store(row);
        },

        changed: function(row, old) {
            document.querySelector("layout-inbox").store(row);
        },

        removed: function(old) {
            document.querySelector("layout-inbox")._store(old, true);
        }
    });
};
