// var isAndroid = /Android/i.test(navigator.userAgent);
var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
// var isFireFox = /Firefox/.test(navigator.userAgent);

if (!isChrome) {
    alert("google chrome browser is required");
}
