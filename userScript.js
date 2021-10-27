function enter() {
    var site = new Object;
    site.sitename = document.getElementById("sitename").value;
    site.keyname = document.getElementById("keyname").value;
    if (site.sitename === "" || site.sitename === null) return alert("Fill in the username!");
    if (site.keyname === "" || site.keyname === null) return alert("Fill in the password!");
    if (localStorage.getItem("userPass")) {
        //if exist username already
        let items = localStorage.getItem("userPass");
        let newItems = JSON.parse("[" + items + `, {"user": "${site.sitename}", "pass": "${site.keyname}"}` + "]");
        let existingAccount = false;
        let existPassword = "";

        (JSON.parse(`[${items}]`)).forEach(e => {
            if (e.user === site.sitename) {
                existingAccount = true;
                existPassword = e.pass;
            }
        });

        if (existingAccount) {
            if (site.keyname !== existPassword) return alert("This user exist. The password is incorrect.");
            document.getElementById("keyname").value = '';
            alert(`Successfully signed into ${site.sitename}`);
            localStorage.setItem("currentAccount", site.sitename);
        } else {
            localStorage.setItem(`userPass`, `${(JSON.stringify(newItems)).substring(1, JSON.stringify(newItems).length - 1)}`);
            localStorage.setItem("currentAccount", site.sitename);
        }
    } else {
        localStorage.setItem(`userPass`, `{"user": "${site.sitename}", "pass": "${site.keyname}"}`);
        localStorage.setItem("currentAccount", site.sitename);
        alert("Account successfully created!");
    }


    document.getElementById("sitename").value = '';
    document.getElementById("keyname").value = '';
    location.href = "index.html";
}

function loadAll() {
    var list = document.getElementById("list");
    if (localStorage.getItem("userPass").length > 0) {
        var result = "<table border='1'>";
        result += "<tr><td>Password</td><td>Username</td><td>网址</td></tr>";
        let items = localStorage.getItem("userPass");
        let itemsJSON = JSON.parse("[" + items + "]");
        itemsJSON.forEach(e => {
            result += "<tr><td>" + e.pass + "</td><td>" + e.user + "</td><td>" + "" + "</td></tr>";
        });

        result += "</table>";
        list.innerHTML = result;
    } else {
        list.innerHTML = "No accounts created...";
    }
}