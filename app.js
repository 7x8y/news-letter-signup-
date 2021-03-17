const express = require("express");
const app = express();
const https  = require("https");
const bodyparser = require("body-parser");
const request  = require("superagent")


app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
    console.log("page routed")

})

app.post("/", function(req, res){
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email


    var data = {
                 email_address: email,
                 status: "subscribed",
                 merge_fields: {
                     FNAME: firstname,
                     LNAME: lastname
                 }
            };

    request
        .post('https://usx.api.mailchimp.com/3.0/lists/list_id/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic {auth_token_of_node_req}')
        .send(data)
        .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname + "/success.html");
              } else {
                  console.log(response)
                res.sendFile(__dirname + "/faliure.html")

              }
          });



 });


// code for faliure routed
app.post("/faliure", (req, res)=>{
    res.redirect("/")
})







app.listen(process.env.PORT ||3000, () => {
    console.log("server is running at 3000")
})
