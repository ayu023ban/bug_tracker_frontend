function filter(obj, keys) {
    let result = {}
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
}
function setCookie(cname, cvalue, exseconds) {
    var d = new Date();
    d.setTime(d.getTime() + (exseconds* 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
async function login() {
    if(Boolean(sessionStorage.getItem("isLoggedIn"))) return false
    let token = getCookie("token")
    let url = "http://localhost:8000/bug_reporter/users/cookielogin/"
    let headers = { "content-type": "application/json" }
    let body = JSON.stringify({ token: token })
    let res = await fetch(url, { method: "POST", body: body, headers: headers })
    if (res.status === 200) {
        let data = await res.json()
        console.log(data)
        sessionStorage.setItem("token", data.token)
        sessionStorage.setItem("isLoggedIn", true)
        sessionStorage.setItem("user_data", JSON.stringify(data.user_data))
        sessionStorage.setItem("header", JSON.stringify({ Authorization: `Token ${token}` }))
        return true
    }
    return false
}
export { filter, getCookie, setCookie, login }