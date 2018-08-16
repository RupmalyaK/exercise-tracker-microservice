const router = require("express").Router();
const User = require("../../models/user");
const Exercise = require("../../models/exercise");


function formValidator(req , res , next){
if (req.body.username.length > 20)
  {
    res.status(400).send('<pre style="word-wrap: break-word; white-space: pre-wrap;">username too long</pre>');
    return;
  }
  next(); 
}

router.post("/new-user" , formValidator , (req , res) => {

  User.findOne({"username":req.body.username}) .exec()
  .then(doc => {
  if(doc)
  {
    res.status(400).send('<pre style="word-wrap: break-word; white-space: pre-wrap;">username already taken</pre>');
    return; 
  }
  
  new User({
  "username":req.body.username
  }) .save()
  .then(doc => res.status(200).json({
  "username":doc.username,
  "_id":doc._id  
  })); 
    
})
  .catch(err => res.status(500).json(err)); 
  
});


router.post("/add",(req,res) => { console.log("DEBUG ENTRY POINT");
new Exercise({
"description":req.body.description,
"duration":req.body.duration,
"date":req.body.date
}) .save() 
  .then(doc => { 
  User.findById(req.body.userId) .exec()
 .then(user => { 
  if(!user)
  {
    res.status(400).send('<pre style="word-wrap: break-word; white-space: pre-wrap;">unknown _id</pre>');
    return;
  }
  user.exercises.push(doc._id);
  user.save();  
  res.status(200).json({"_id":user._id,
                       "username":user.name,
                        "description":doc.description,
                        "duration":doc.duration,
                        "date":doc.date.toDateString()
                       }); 
  })
  
})
  .catch(err => res.status(500).json(err));
});


router.get("/log", (req , res) => {
  User.findById(req.query.userId) .populate({"path":"exercises" , "model": "Exercise"}) .exec()
  .then(doc => { 
    
  if (!doc)
  {
    res.status(400).send('<pre style="word-wrap: break-word; white-space: pre-wrap;">unknown userId</pre>');  
    return; 
  }
  const fromDate = new Date(req.query.from || 1);
  const toDate = new  Date(req.query.to || "9999-12-12"); 
  console.log(fromDate , toDate , req.query.from , req.query.to);
    
  const exercises = doc.exercises.sort((a,b) => b.date.getTime() - a.date.getTime()); 
  
  let newExercises = []; 
  exercises.forEach(exercise => {
  if(exercise.date.getTime() >= fromDate.getTime() && exercise.date.getTime() <= toDate.getTime())  
  {
  newExercises.push({
  "description":exercise.description,
  "duration":exercise.duration,
  "date":exercise.date.toDateString() 
  })
  }
  });  
  newExercises = newExercises.slice(0 , req.query.limit || newExercises.length);  
  const jsonObj = {
  "_id":doc._id,
  "username":doc.username, 
  "count":newExercises.length,  
  }  
  
   if (req.query.from) {jsonObj.from = fromDate.toDateString();}
   if (req.query.to)  {jsonObj.to = toDate.toDateString();}
  
  jsonObj.exercises = newExercises;
  
  res.status(200).json(jsonObj);  
  })
  .catch();
});




router.get("/all", (req,res) => {
  const fromDate = new Date(null || "9999-12-12");
  const toDate = new  Date(null || 1); 
  console.log(fromDate>toDate);
User.find() .populate({"path":"exercises" , model:"Exercise"}) .exec().then(docs => res.json(
  docs
)); 
});


module.exports = router; 
