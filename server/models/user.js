var pg           = require('pg');

var conString = 'postgres://localhost:5432/flash_cardz_1';

var client = new pg.Client(conString);


function User() {
    this.id = 0;
    this.email = "";
    this.password = ""; //need to declare the things that i want to be remembered for each user in the database

    this.save = function (callback) {
        var conString = 'postgres://localhost:5432/flash_cardz_1';

        var client = new pg.Client(conString);
        client.connect();

        console.log(this.email + ' will be saved');

        client.query('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password], function (err, result) {
            if (err) {
                console.log(err);
                return console.error('error running query', err);
            }
            //console.log(result.rows);
            //console.log(this.email);
        });
        client.query('SELECT * FROM users ORDER BY id desc limit 1', null, function (err, result) {

            if (err) {
                return callback(null);
            }
            //if no rows were returned from query, then new user
            if (result.rows.length > 0) {
                //console.log(result.rows[0] + ' is found!');
                var user = new User();
                //user.username = result.rows[0]['username'];
                //console.log('name is', user.username);
                user.email = result.rows[0]['email'];
                //console.log('email is', user.email);
                user.password = result.rows[0]['password'];
                //console.log('pw is', user.password);


                user.id = result.rows[0]['id'];
                console.log('id is', user.id);
                //console.log(user.email);
                client.end();
                return callback(user);
            }
        });


        //whenever we call 'save function' to object USER we call the insert query which will save it into the database.
        //});
    };
}

User.findOne = function(email, callback){
    console.log('tell me what the email in findOne param is', email);
    var conString = 'postgres://localhost:5432/flash_cardz_1';
    var client = new pg.Client(conString);

    var isNotAvailable = false; //we are assuming the email is taking
    //var email = this.email;
    console.log('take 2 tell me what the email in findOne param is', email);

    //var rowresult = false;
    //console.log(email + ' is in the findOne function test');
    //check if there is a user available for this email;
    client.connect();



    client.query("SELECT * from users where email=$1", [email], function(err, result){
        if(err){
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            isNotAvailable = true; // update the user for return in callback
            ///email = email;
            //password = result.rows[0].password;
            console.log(email + ' is am not available!');
        }
        else{
            isNotAvailable = false;
            //email = email;
            console.log(email + ' is available');
        }


        client.end();
        return callback(false, isNotAvailable, this);


    });
};


User.findById = function(id, callback){
    console.log("we are in findbyid");
    var conString = 'postgres://localhost:5432/flash_cardz_1';
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from users where id=$1", [id], function(err, result){

        if(err){
            return callback(err, null);
        }

        if (result.rows.length > 0){
            //console.log(result.rows[0]['id'] + ' is found!');
            var user = new User();
            user.email= result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.id = result.rows[0]['id'];

            return callback(null, user);
        }
    });
};

module.exports = User;