Meteor.startup(function() {
    Accounts.loginServiceConfiguration.remove({
        service: "google"
    });

    Accounts.loginServiceConfiguration.insert({
        service: "google",
        clientId: "184189345015-tlm317uu95uathg70otqr2qk618g27pn.apps.googleusercontent.com",
        secret: "wiq6ZfmcA4B7xZXFgnDwqCCt"
    });
});

Accounts.onCreateUser(function(opts, user) {
    if (user.services.google) {
        var res = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "User-Agent": "Meteor/1.0"
            },

            params: {
                access_token: user.services.google.accessToken
            }
        });

        if (res.error) {
            throw res.error;
        } else {
            user.profile = _.extend(_.pick(res.data, "email", "email_verified", "gender", "locale", "name", "picture", "sub"), {
                time: moment().format()
            });
        }
    }

    return user;
});
