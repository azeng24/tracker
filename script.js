var tempID = 0;
var profit = 0;

function addItem(){
	var name = document.getElementById('name');
	var size = document.getElementById('size');
	var condo = document.getElementById('condo');
	var notes = document.getElementById('notes');
	var price = document.getElementById('price');
	var sold = document.getElementById('sold');
	var profit = sold.value-price.value;
	profit = profit.toFixed(2);
	var roi = profit/price.value*100;
	roi = roi.toFixed(2);
	if(isNaN(roi)) roi = 'N/A';
	var dataPoint = {
		name: name.value, 
		size: size.value, 
		condo: condo.value, 
		notes: notes.value, 
		purchasePrice: price.value, 
		salesPrice: sold.value, 
		profit: profit, 
		roi: roi
	};
	var item = databaseRef.push(dataPoint);
	name.value = '';
	size.value = '';
	condo.value = '';
	notes.value = '';
	price.value = '';
	sold.value = '';
}

function renderTask(id, x1, x2, x3, x4, x5, x6, x7, x8){
	const info = [x1,x2,x3,x4,x5,x6,x7,x8];
	var table = document.getElementById('table');
	var row = document.createElement('tr');
	row.id = id;
	var buttons = document.createElement('td');
	buttons.innerHTML = `<button class='update'>&#9998;</button>
						<button class='delete'>X</button>`;
	row.appendChild(buttons);
	table.appendChild(row);
	for(var i = 0; i<info.length; i++){
		var item = document.createElement('td');
		item.className = 'content';
		item.innerHTML = info[i];
		row.appendChild(item);
		table.appendChild(row);
	}
	profit+=parseFloat(x7);
	document.getElementById('money').innerHTML = profit;
	firebase.database().ref(databaseRef2).set({profit: profit});

	buttons.getElementsByClassName('delete')[0].addEventListener('click', function(e){remove(e);});
	buttons.getElementsByClassName('update')[0].addEventListener('click', function(e){update(e);})
}

function clearAll(){
	var table = document.getElementById('table');
	var length = table.rows.length;
	for(var i = 1; i<length; i++){
		table.removeChild(table.childNodes[2]);
	}
	profit = 0;
	document.getElementById('money').innerHTML = profit;
	firebase.database().ref('item').remove();
	firebase.database().ref(databaseRef2).set({profit: '0'});
}

function remove(event){
	var parent = event.srcElement.parentNode.parentNode;
	var id = parent.id;
	var content = parent.getElementsByClassName('content');
	profit-=parseFloat(content[6].innerHTML);
	document.getElementById('money').innerHTML = profit;
	firebase.database().ref(databaseRef2).set({profit: profit});
	document.getElementById(id).innerHTML = '';
	firebase.database().ref("item").child(id).remove();
}

function update(event){
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
	document.getElementById('price2').value = t5;
	document.getElementById('sold2').value = t6;
	profit-=parseFloat(content[6].innerHTML);
	firebase.database().ref(databaseRef2).set({profit: profit});
	tempID = id;
}

function edit(){
	if(tempID != 0){
		var t1 = document.getElementById('name2').value;
		var t2 = document.getElementById('size2').value;
		var t3 = document.getElementById('condo2').value;
		var t4 = document.getElementById('notes2').value;
		var t5 = document.getElementById('price2').value;
		var t6 = document.getElementById('sold2').value;
		var newProfit = t6-t5;
		newProfit = newProfit.toFixed(2);
		var newROI = (t6-t5)/t5*100;
		newROI = newROI.toFixed(2);
		var element = document.getElementById(tempID);
		element.getElementsByClassName('content')[0].innerHTML = t1;
		element.getElementsByClassName('content')[1].innerHTML = t2;
		element.getElementsByClassName('content')[2].innerHTML = t3;
		element.getElementsByClassName('content')[3].innerHTML = t4;
		element.getElementsByClassName('content')[4].innerHTML = t5;
		element.getElementsByClassName('content')[5].innerHTML = t6;
		element.getElementsByClassName('content')[6].innerHTML = newProfit;
		element.getElementsByClassName('content')[7].innerHTML = newROI;
		profit+=parseFloat(newProfit);
		document.getElementById('money').innerHTML = profit;
		firebase.database().ref(databaseRef2).set({profit: profit});
		firebase.database().ref("item").child(tempID).update({name: t1, 
														size: t2, 
														condo: t3, 
														notes: t4, 
														purchasePrice: t5, 
														salesPrice: t6, 
														profit: newProfit, 
														roi: newROI});
		cancel();
	}
}

function cancel(){
	document.getElementById('name2').value='';
	document.getElementById('size2').value='';
	document.getElementById('condo2').value='';
	document.getElementById('notes2').value='';
	document.getElementById('price2').value='';
	document.getElementById('sold2').value='';
	tempID = 0;
	document.getElementById("editFunction").style.display = "none";
}

var databaseRef = firebase.database().ref('item');
var databaseRef2 = firebase.database().ref('total profit');
firebase.database().ref(databaseRef2).update({profit: '0'});
databaseRef.on('child_added', (snapshot) => {
	renderTask(snapshot.key, snapshot.val().name, snapshot.val().size, snapshot.val().condo, snapshot.val().notes, snapshot.val().purchasePrice, snapshot.val().salesPrice, snapshot.val().profit, snapshot.val().roi)
});
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('edit').addEventListener('click', edit);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('add').addEventListener('click', addItem);