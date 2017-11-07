// function deleteValue(e){
// 	this.value = '';
// 	this.removeEventListener('keydown', deleteValue);
// }


function generateColor(){
	var color = '#' + Math.floor(Math.random() * 16777300).toString(16);
	return color;	
}

function postNote(){
			var color;
			var title = document.getElementsByTagName("input")[0].value;
			var text = document.getElementsByTagName("textarea")[0].value;
			var findColor = document.getElementsByClassName('color');
			for(var i = 0; i < findColor.length; i++){
				if(findColor[i].style.outline != ''){
					var color = findColor[i].style.background;
					console.log(color);
				}
			}

			var body = 'title=' + title +
  						'&text=' + text +
  						'&color=' + color;

  			if(text != '' && color != undefined){
			var req = getXmlHttpRequest();

			// Метод POST
			req.open("POST", "http://localhost:3000/main", true);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
			// Отправка данных
			req.send(body);
			console.log(body);
			req.onreadystatechange = function(){
					if (req.readyState != 4) return;
					var allData = JSON.parse(req.responseText).notes;
					var data = allData[allData.length-1];
					// console.log(data[data.length-1]);
					// var titleH = document.createTextNode(data.title);
					// var textP = document.createTextNode(data.text);
					// var h = document.createElement('h3').appendChild(titleH);
					// var p = document.createElement('p').appendChild(textP);
					document.getElementsByClassName('notes')[0].innerHTML += `<div class='note', style='background: ${data.color}'><h3>${data.title}</h3><p>${data.text}</p><input type='button', onclick='saveEditNote(this)', value='Сохранить', id='hiddenButton'><p>Дата создания: ${data.created}</p><p class='hidden'>${data._id}</p><input type='button', onclick='deleteNote(this)', value='удалить'><input type='button', onclick='editNote(this)', value='редактировать'></div>`;
					$('.note').last().hide().fadeIn();

					// location.reload(true);
				};
			} else {
				alert('Write your note and choose a color!!');
			} 
						
		}

function deleteNote(el){
			
			var id = el.previousSibling.innerText;

			var req = getXmlHttpRequest();

			// Метод POST
			req.open("PUT", `http://localhost:3000/main${id}/delete`, true);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
			// Отправка данных
			req.send(null);
			req.onreadystatechange = function(){
					if (req.readyState != 4) return;
					$(el).parent('div').toggle('ms(1000)');
					// location.reload(true);
				};
				
						
		}

// Проверка существования пользователя с именем

function checkName(){
	// document.getElementById("login").addEventListener('keydown', function(e){
	// 	e.preventDefault();
	// });
	var newName = document.getElementById("login").value;
	if(newName.length > 0){
			var req = getXmlHttpRequest();
		// Метод PUT
			req.open("PUT", `http://localhost:3000/register${newName}`, true);
			req.setRequestHeader("Content-Type","text/plain; charset=utf-8");
			// Отправка данных
			req.send(null);
			// console.log(newName);
			req.onreadystatechange = function(){
					if (req.readyState != 4) return;
					document.getElementById('nameValid').innerText = req.responseText;
					// var data = JSON.parse(req.responseText);
					// var data = allData[allData.length-1];
					if(req.responseText == 'Имя свободно!'){
						document.getElementById('nameValid').style.color = 'green';
						
					} else {
						document.getElementById('nameValid').style.color = 'red';
					}
					// var titleH = document.createTextNode(data.title);
					// var textP = document.createTextNode(data.text);
					// var h = document.createElement('h3').appendChild(titleH);
					// var p = document.createElement('p').appendChild(textP);
					// document.getElementsByClassName('notes')[0].innerHTML += `<div class='note'><h3>${data.title}</h3><p>${data.text}</p><p>Дата написания: ${data.created.toString()}</p></div>`;
					// location.reload(true);
				};
				
	} else {
		document.getElementById('nameValid').innerText = '';
	}
	
}

// Проверка совпадения паролей в форме регистрации

function checkPassword(){
		var p1 = document.getElementById("password");
		var p2 = document.getElementById("password-confirm");
		var validName = document.getElementById('nameValid').innerText;
		// console.log(validName);
		if(p1.value != p2.value || validName != 'Имя свободно!'){
			alert("Wrong password or nickname!");
			return false;
		}else if(p1.value.length < 4){
			alert("Wrong password");
			return false;
		}else{
			document.forms[0].submit();
			return true;
		}
	}


// Редактор заметки
function editNote(el){
			var p = el.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
			var text = p.innerText;
			

			p.innerHTML = `<textarea name='text', type='text', cols='40', rows='4'>${text}`;
			el.style.display = 'none';
			p.nextSibling.style.display = 'block';
}
function saveEditNote(el){

			var newText = el.previousSibling.childNodes[0].value;
			var noteId = el.nextSibling.nextSibling.innerText;

			var body = 'id=' + noteId +
  						'&text=' + newText;

  			if(newText != ''){
			var req = getXmlHttpRequest();

			// Метод POST
			req.open("POST", `http://localhost:3000/mainedit`, true);
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
			// Отправка данных
			req.send(body);
			req.onreadystatechange = function(){
					if (req.readyState != 4) return;
					el.previousSibling.innerHTML = newText;
					el.style.display = 'none';
					el.nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'block';
					// location.reload(true);
				};
			} else {
				alert('Write something!!');
			} 	
						
		

}

// выбор цвета заметок

// function clickLine(){
// 	var flag = 0;
// 	return function(){
// 		return flag++
// 		}
// }

// function toggle(){
// 	var flag = clickLine();
// 	if(flag == 0){
// 		return this.style.outline = '3px solid red';
// 		flag = 1;
// 		} else {
// 		return this.style.outline = '';
// 			flag = 0;
// 		}
// }

 var colorSquare = document.getElementsByClassName('color');
// var flag = 0;

for(var i = 0; i < colorSquare.length; i++){
	colorSquare[i].style.background = generateColor();
	// colorSquare[i].addEventListener('click', toggle);

}

// Замыкание с выбором цвета
function redToggle(e){
	e.target.flag;
		function f(){
			if(e.target.flag == undefined){
			return e.target.flag = 0;
		} else{
			return e.target.flag += 1;
		}
	}
	var toggle = f();
	if(toggle % 2 == 0){	
	for(var i = 0; i < colorSquare.length; i++){
		colorSquare[i].style.outline = '';
		}
	e.target.style.outline = '2px solid red';
	} else {
		e.target.style.outline = '';
	}

}