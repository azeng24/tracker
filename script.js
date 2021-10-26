var tempID = 0;
var profit = 0;
let currentAccount = localStorage.getItem('currentAccount')

function addItem() {
    let name = document.getElementById('name');
    let size = document.getElementById('size');
    let age = document.getElementById('age');
    let condo = document.getElementById('condo');
    let notes = document.getElementById('notes');
    let price = document.getElementById('price');
    let sold = document.getElementById('sold');
    let profit = sold.value - price.value;
    profit = profit.toFixed(2);
    let roi = profit / price.value * 100;
    roi = roi.toFixed(2);
    if (isNaN(roi)) roi = 'N/A';

    if (age.value === 'none') age.value = "";

    let dataPoint = {
        name: name.value,
        size: `${size.value}${age.value}`,
        condo: condo.value,
        notes: notes.value,
        purchasePrice: price.value,
        salesPrice: sold.value,
        profit: profit,
        roi: roi
    };
    firebase.database().ref(currentAccount).push(dataPoint);
    name.value = '';
    condo.value = '';
    notes.value = '';
    price.value = '';
    sold.value = '';
}


function logout() {
    var currentUser = localStorage.getItem("currentAccount");
    localStorage.removeItem("currentAccount");
    alert(`Logged out of ${currentUser}`)
    location.href = "user.html";
}

function renderTask(id, x1, x2, x3, x4, x5, x6, x7, x8) {
    const info = [x1, x2, x3, x4, x5, x6, x7, x8];
    var table = document.getElementById('table');
    var row = document.createElement('tr');
    row.id = id;
    var buttons = document.createElement('td');
    buttons.innerHTML = `<button class='update'>&#9998;</button>
						<button class='delete'>X</button>`;
    buttons.className = "utility"
    row.appendChild(buttons);
    table.appendChild(row);
    for (var i = 0; i < info.length; i++) {
        var item = document.createElement('td');
        var addDollarSymbol = [4, 5, 6];
        var addPercentSymbol = [7];
        item.className = 'content';
        if (addDollarSymbol.includes(i)) {
            item.innerHTML = `$${info[i]}`;
        } else if (addPercentSymbol.includes(i)) {
            item.innerHTML = `${info[i]}%`
        } else item.innerHTML = info[i];
        row.appendChild(item);
        table.appendChild(row);
    }

    profit += parseFloat(x7);
    document.getElementById('money').innerHTML = profit;

    buttons.getElementsByClassName('delete')[0].addEventListener('click', function(e) { remove(e); });
    buttons.getElementsByClassName('update')[0].addEventListener('click', function(e) { update(e); });
}

function clearAll() {
    var table = document.getElementById('table');
    var length = table.rows.length;
    for (var i = 1; i < length; i++) {
        table.removeChild(table.childNodes[2]);
    }
    profit = 0;
    document.getElementById('money').innerHTML = profit;
    firebase.database().ref(currentAccount).remove();
    //firebase.database().ref(databaseRef2).set({ profit: '0' });
}

function remove(event) {
    var parent = event.srcElement.parentNode.parentNode;
    var id = parent.id;
    var content = parent.getElementsByClassName('content');

    profit -= parseFloat(content[6].innerHTML.replace('$', ''));
    document.getElementById('money').innerHTML = profit;
    //firebase.database().ref(databaseRef2).set({ profit: profit });
    document.getElementById(id).innerHTML = '';
    firebase.database().ref(currentAccount).child(id).remove();
}

function update(event) {
    document.getElementById("editFunction").style.display = "block";
    var parent = event.srcElement.parentNode.parentNode;
    var id = parent.id;
    var content = parent.getElementsByClassName('content');
    var t1 = content[0].innerHTML;
    var t2 = content[1].innerHTML;
    var t3 = content[2].innerHTML;
    var t4 = content[3].innerHTML;
    var t5 = content[4].innerHTML;
    var t6 = content[5].innerHTML;
    document.getElementById('name2').value = t1;
    document.getElementById('size2').value = t2;
    document.getElementById('condo2').value = t3;
    document.getElementById('notes2').value = t4;
    document.getElementById('price2').value = t5.replace("$", "");
    document.getElementById('sold2').value = t6.replace("$", "");
    profit -= parseFloat(content[6].innerHTML.replace("$", ""));
    //firebase.database().ref(databaseRef2).set({ profit: profit });
    tempID = id;
}

function edit() {
    if (tempID != 0) {
        var t1 = document.getElementById('name2').value;
        var t2 = document.getElementById('size2').value;
        var t3 = document.getElementById('condo2').value;
        var t4 = document.getElementById('notes2').value;
        var t5 = document.getElementById('price2').value;
        var t6 = document.getElementById('sold2').value;
        var newProfit = t6.replace("$", "") - t5.replace("$", "");
        newProfit = newProfit.toFixed(2);
        var newROI = (t6 - t5) / t5 * 100;
        newROI = newROI.toFixed(2);
        var element = document.getElementById(tempID);
        element.getElementsByClassName('content')[0].innerHTML = t1;
        element.getElementsByClassName('content')[1].innerHTML = t2;
        element.getElementsByClassName('content')[2].innerHTML = t3;
        element.getElementsByClassName('content')[3].innerHTML = t4;
        element.getElementsByClassName('content')[4].innerHTML = `$${t5}`;
        element.getElementsByClassName('content')[5].innerHTML = `$${t6}`;
        element.getElementsByClassName('content')[6].innerHTML = newProfit;
        element.getElementsByClassName('content')[7].innerHTML = newROI;
        profit += parseFloat(newProfit.replace("$", ""));
        document.getElementById('money').innerHTML = profit;
        // firebase.database().ref(databaseRef2).set({ profit: profit });
        firebase.database().ref("item").child(tempID).update({
            name: t1,
            size: t2,
            condo: t3,
            notes: t4,
            purchasePrice: t5,
            salesPrice: t6,
            profit: newProfit,
            roi: newROI
        });
        cancel();
    }
}

function cancel() {
    document.getElementById('name2').value = '';
    document.getElementById('size2').value = '';
    document.getElementById('condo2').value = '';
    document.getElementById('notes2').value = '';
    document.getElementById('price2').value = '';
    document.getElementById('sold2').value = '';
    tempID = 0;
    document.getElementById("editFunction").style.display = "none";
}



//var databaseRef = firebase.database().ref('item');
//var databaseRef2 = firebase.database().ref('total profit');
//firebase.database().ref(databaseRef2).update({ profit: '0' });

firebase.database().ref(currentAccount).on('child_added', (snapshot) => {
    renderTask(snapshot.key, snapshot.val().name, snapshot.val().size, snapshot.val().condo, snapshot.val().notes, snapshot.val().purchasePrice, snapshot.val().salesPrice, snapshot.val().profit, snapshot.val().roi)
});

document.getElementById("user").innerHTML = currentAccount;

document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('edit').addEventListener('click', edit);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('add').addEventListener('click', addItem);