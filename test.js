app.post('/send',(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var subject = req.body.subject;
    var uid = shortid.generate();
    var data = {
        "name": name,
        "email":email,
        "message": message,
        "subject": subject,
        "uid": uid,
        "staff": null,
        "status": null,
        "time": Math.floor(new Date() / 1000)
    }
    client.channels.cache.get(process.env.c2)
        .send(`We have received a new request:
        **Name**: ${name}
        Subject: ${subject}
        Message: ${message}
        Follow Up: ${email}
        ID: ${uid}
        Status: ${defstatus}`);
    db.collection('urgents').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Urgent request logged!");
    });
    var x=generate.generateOtp();
    var mailOptions={
        from: "ecrimeportal@gmail.com",
        to: req.body.email,
        subject: 'Email Verification',
        html: 'Your OTP for Email Verification is <b>'+x+'</b>'
    };
    sendotp.send(mailOptions,(err,data)=>{
        if(err)
            res.send(err);
        else
        {
            otp.save(req.body.email,x,(error,dataa)=>{
                if(error)
                    res.send(error);
                res.render('pages/verifyOtp.ejs',{email:req.body.email});
            });
        }
    });

});
app.post('/verify',(req,res)=>{
    otp.match(req.body.email,req.body.otp,(err,data)=>{
        if(err)
            res.send(err);
        if(data==undefined)
            res.send("OTP Expired. Kindly try to resend it.");
        else if(data==true)
        {
            otp.remove(req.body.email,(error,dataa)=>{
                if(error)
                    res.send(error);
                else
                    res.send("Success. Verified.");
                    client.channels.cache.get('737253262574485567')
                    .send(`Request ID for ${req.body.email} has been approved!`);
            })
        }
        else
            res.send("Failure. Kindly check again.");
    })
});