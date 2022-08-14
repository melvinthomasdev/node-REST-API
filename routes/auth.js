const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


// REGISTER
router.post("/register", async (request, response) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword
        });
        const user = await newUser.save();
        response.status(200).json(user);
    } catch(error){
        console.log(error);
        response.status(500).json({"message": "Some Error!"});
    }    
});

router.post("/login", async (request, response) =>{
    try{
        const user = await User.findOne({email: request.body.email});
        console.log(request.body.email)
        // TODO: Rewrite to handle ERR_HTTP_HEADERS_SENT?
        !user && response.status(404).json({"message": "user not found!"})

        const validPassword = await bcrypt.compare(request.body.password, user.password)
        // TODO: Rewrite to handle ERR_HTTP_HEADERS_SENT?
        !validPassword && response.status(400).json({"message": "Wrong password!"})

        response.json({"user": user})
    } catch(error){
        console.log(error);
        response.status(500).json({"message": error});
    }
})


module.exports = router;