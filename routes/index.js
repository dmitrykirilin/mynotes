
/*
 * GET home page.
 */
var NoteSchema = require('../add/UserSchema');
var e = require('../add/error');

module.exports = function(db){
  functions = {};
  var data = [];


// GET запрос на /
  functions.slash = function(req, res){
  	if(req.session.user === undefined){
      res.redirect('/login')
    } else {
      res.redirect('/main');
    }
  }

// GET запрос на /login
  functions.login = function(req, res){
  	res.render('login', {title: 'Вход для зарегистрированных пользователей'});
  	
  }

// POST запрос на /login
	functions.postLogin = function(req, res, next){
  	var login = req.body.username;
	var pass = req.body.password;
		NoteSchema.findOne({name: login}, function(err, curUser){
			if(err) next(err);
			if(curUser){
				if(curUser.checkPassword(pass)){
					req.session.user = curUser._id;
					res.status(302);
					res.setHeader('Location', '/main')
					res.end();
				}else{
					next(e.setError(401));
				}
			}else{
				next(e.setError(401));
			}
		})
  }

// GET запрос на /logout
	functions.logout = function(req, res, next){
  	delete req.session.user;
  	res.redirect('/login');
  }

// GET запрос на /register		
	 functions.register = function(req, res){
  res.render('register', {title: 'Регистрация нового пользователя'});
  	
  }

// PUT запрос на /register
	functions.putRegister = function(req, res){
		// console.log(req.params.name);
  NoteSchema.findOne({name: req.params.name}, function(err, curUser){
  	// console.log(curUser);
  	 if(curUser){res.end('Пользователь с таким именем уже существует!');
  } else {
  	res.end('Имя свободно!');
  }
 })
}
// POST запрос на /register
	functions.postRegister = function(req, res, next){
		// console.log(req.body);
	var bodyPost = {name: req.body.login,
					password: req.body.password};
	var newUser = new NoteSchema(bodyPost);
	newUser.save(function(err){
        if(err){
          next(err);
        }
        req.session.user = newUser._id;
		res.redirect('/main');
      });
	// console.log(newUser);
	
 }

// GET запрос на /main
  functions.main = function(req, res, next){
  	if(req.session.user === undefined){
      res.redirect('/login')
    } else {
  	NoteSchema.findById(req.session.user, function(err, user){
  		if(err) next(err);
  		res.render('index', {title: `Wellcome, ${user.name}!! These ara Your Notes`,
  						data: user.notes});
  	// console.log(user.notes);
  	});
  	}
  }

// POST запрос на /main
  functions.postNote = function(req, res, next){
  	console.log(req.body);
  	
  	NoteSchema.findByIdAndUpdate(req.session.user, {$push: {notes: {title: req.body.title,
  																	text: req.body.text,
  																	color: req.body.color,
  																	created: new Date()}}}, {new: true}, function(err, user){
    if(err) next(err);
    console.log("Обновленный объект", user);
    res.json(user);
})
  	// var recordNote = new NoteSchema(req.body);
   //  recordNote.save(function(err){
   //      if(err){
   //        console.log(err);
   //      }
   //    });
  	// data.push(req.body);
  	// console.log(recordNote);
  	
}

// POST edit запрос на /main
  functions.editNote = function(req, res, next){
  	console.log(req.body);
  	NoteSchema.findById(req.session.user, function(err, user){
  	
  		for(var i = 0; i < user.notes.length; i++){
  			if(user.notes[i]._id.toString() == req.body.id){
  			user.notes[i].text = req.body.text;
  			user.notes[i].created = Date.now();
  			}
  		}
  		NoteSchema.findByIdAndUpdate(req.session.user, user, {new: true}, function(err, updateUser){
		    if(err) next(err);
		    console.log("Обновленный объект", updateUser.notes);
		    res.json(updateUser.notes);
	})
})

//   	NoteSchema.findByIdAndUpdate(req.session.user, {notes: {_id: req.body.noteId,
//   															text: req.body.text}}, {new: true}, function(err, user){
//     if(err) next(err);
//     console.log("Обновленный объект", user.notes);
//     res.json(user.notes);
// })
}

// Удаление заметки
 functions.deleteNote = function(req, res, next){
  	var delNoteId = req.params.id;
  	console.log(delNoteId);
  	NoteSchema.findByIdAndUpdate(req.session.user, {$pull: {notes: {_id: delNoteId}}}, function(err, user){
  		if(err) next(err);
    console.log("Удаленный объект", user);
    res.json(user);
  	})
  // 	NoteSchema.findByIdAndUpdate(req.session.user, {$pull: {notes: {title: req.body.title,
  // 																	text: req.body.text}}}, {new: true}, function(err, user){
     
	 //    if(err) return console.log(err);
	 //    res.json(doc);
	 //    console.log("Удалена заметка ", doc);
	 //  });
  }

  return functions;
};