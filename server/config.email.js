Accounts.emailTemplates.siteName = "Patentability";
Accounts.emailTemplates.from = "Patentability<request@vcompile.com>";

Accounts.emailTemplates.enrollAccount.subject = function(user) {
    return "enrollAccount URL";
};

Accounts.emailTemplates.enrollAccount.text = function(user, url) {
    return "Hi,\n\nPlease open the URL below in google chrome browser to enroll password\n\n" + url + "\n\nThankYou"
};

Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "reset password URL";
};

Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return "Hi,\n\nPlease open the URL below in google chrome browser to reset your password\n\n" + url + "\n\nThankYou"
};

Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "verify registered mailId";
};

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return "Hi,\n\nPlease open the URL below in google chrome browser to verify your registered mailId\n\n" + url + "\n\nThankYou"
};
