if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);
        document.addEventListener("pause", pause, false);
        document.addEventListener("searchbutton", search, false);
    }, false);

    function backbutton() {

    }

    function menubutton() {

    }

    function pause() {

    }

    function search() {

    }
}
