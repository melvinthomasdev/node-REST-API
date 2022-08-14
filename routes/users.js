const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async(request, response) => {
    if (request.body.userId == request.params.id || request.body.isAdmin){
        if (request.body.password) {
            try {
                const salt = bcrypt.genSalt(10);
                request.body.password = await bcrypt.hash(request.body.password, salt);
            } catch(error) {
                return reponse.status(500).json({"message": "Some error!"});
            }
        }
        try {
            console.log(request.params.id)
            console.log(request.body.userId)
            const user = await User.findByIdAndUpdate(request.params.id, {
                $set: request.body
            });
            response.status(200).json({"message": "Account has been updated"})
        } catch(error) {
            return response.status(500).json({"message": "Some error2!"})
            // console.log("Error is: " + error)
            return response.status(500).json(error)
        }
    } else {
        return response.status(403).json({"message": "You can only update your account!"})
    }
});

// Delete User
router.delete("/:id", async (request, response) => {
    if (request.body.userId == request.params.id || request.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(request.params.id)
            response.status(200).json({"message": "Account has been deleted"})
        } catch(error) {
            console.log("Error is : " + error)
            return response.status(500).json({"message": error})
        }
    } else {
        return response.status(403).json({"message": "You can only delete your account!"})
    }
});

// Get a user
router.get("/:id", async (request, response) => {
    try {
        const  user = await User.findById(request.params.id);
        if (!user) {
            response.status(404).json({"message": "User not found!"})
        } else {
            return response.status(200).json(user)
        }
    } catch(error) {
        console.log("Error is: " + error)
        response.status(500).json({"message": "Some Error has occured"})
    }
})

// TODO: Follow a User
// TODO: Unfollow a User

module.exports = router