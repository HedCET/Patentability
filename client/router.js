FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
    FlowRouter.initialize({
        // hashbang: true
    });

    Meteor.setTimeout(function() {
        document.querySelector("#load-awesome").active = false;
    }, 1000 * (Meteor.isCordova ? 10 : 1));
});

FlowRouter.route("/", {
    action: function(p, q) {
        mwcLayout.render("main", {
            body: "user-check"
        });

        switch (FlowRouter.getQueryParam("route")) {
            case "sign-in":
                document.querySelector("user-check-layout").sharedElements = {
                    'ripple': document.querySelector("#sign-in"),
                    'reverse-ripple': document.querySelector("#sign-in")
                };

                document.querySelector("user-check").selected = 1;
                break;

            case "sign-up":
                document.querySelector("user-check-layout").sharedElements = {
                    'ripple': document.querySelector("#sign-up"),
                    'reverse-ripple': document.querySelector("#sign-up")
                };

                document.querySelector("user-check").selected = 2;
                break;
        }
    },
    name: "user-check"
});

FlowRouter.route("/set-password", {
    action: function(p, q) {
        mwcLayout.render("set-password", {
            opt: "set-password"
        });
    },
    name: "set-password"
});

var inbox = FlowRouter.group({
    name: "inbox",
    prefix: "/inbox",
    triggersEnter: [function(context, redirect) {
        if (Meteor.status().connected) {
            if (!Meteor.user()) {
                FlowRouter.go("/");
            }
        } else {
            if (!(document.querySelector("#patentability_db").value || []).length) {
                FlowRouter.go("/");
            }
        }
    }]
});

inbox.route("/", {
    action: function(p, q) {
        mwcLayout.render("inbox", {
            "layout-inbox": "layout-inbox",
            "search-view": "search-view"
        });

        switch (FlowRouter.getQueryParam("route")) {
            case "project":
                document.querySelector("#main-page").selected = 1;
                document.querySelector("#inbox-view paper-scroll-header-panel").fire("iron-resize");

                if (FlowRouter.getQueryParam("project_id")) {
                    document.querySelector("#inbox-view").subscribe_project(FlowRouter.getQueryParam("project_id"));
                }
                break;

            case "search":
                document.querySelector("search-view").active = true;
                document.querySelector("search-view paper-scroll-header-panel").fire("iron-resize");
                break;

            default:
                document.querySelector("search-view").active = false;
                break;
        }
    },
    name: "layout-inbox"
});

inbox.route("/sign-out", {
    action: function(p, q) {
        if (Meteor.status().connected) {
            document.querySelector("#patentability_db").value = [];

            Meteor.logout(function(error) {
                if (error) {
                    console.log(error);
                }
            });

            FlowRouter.go("/");
        } else {
            document.querySelector("#polymer-toast").toast("server connection required");
        }
    },
    name: "sign-out"
});
