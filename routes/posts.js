const router = require("express").Router();
const { request } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");


// Create post
router.post("/", async (request, response) => {
    console.log(request.body)
    const newPost = new Post(request.body);
    try {
        const post = await newPost.save();
        response.status(201).json({
            "message": "Post Created",
            "post": post
        });
    } catch(error) {
        console.log("Error is: " + error);
        response.status(500).json({"message": "Some Error"})
        response.status(500).json(error)
    }
});

// Update a post
router.put("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id); 
        if (post.userId === request.body.userId){
            await post.updateOne({$set: request.body})
            response.status(200).json({"message": "post Updated"})
        } else {
            response.status(403).json({"message": "You can only update your own post!"})
        }
    } catch(error) {
        console.log("Error is: " + error);
        response.status(500).json(error);
    }
});

// Delete a post
router.delete("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (post.userId === request.body.userId){
            await post.deleteOne();
            response.status(200).json({"message": "Post has been deleted!"});
        } else {
            response.status(403).json({"message": "you can only delte your own posts!"})
        }
    } catch(error){
        console.log("Error is: " + error)
        response.status(500).json(error)
    }
});

// Like a  post
router.put("/:id/like", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post.likes.includes(request.body.userId)){
            await post.updateOne({$push: {likes: request.body.userId}});
            response.status(200).json({"message": "Liked post"})
        } else {
            await post.updateOne({$pull: {likes: request.body.userId}});
            response.status(200).json({"message": "Unliked post"})
        }
    } catch(error){
        console.log("Error is: " + error);
        response.status(500).json(error);
    }
})

// Get a post
router.get("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        response.status(200).json({"message": post});
    } catch(error){
        console.log("Error is: " + error);
        response.status(500).json(error);
    }
});

// get timeline posts
router.get("/timeline/all", async (request, response) => {
    console.log("OK1")
    const data = [];
    try {
        const currentUser = await User.findById(request.body.userId);
        console.log(currentUser.username);
        console.log(currentUser._id);
        const userPosts = await Post.find({userId: currentUser._id});
        console.log("ok")
        console.log("ibdem bare bannnnn!")
        const friendPosts = Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        console.log(userPosts.length);
        console.log(friendPosts.length);
        response.status(200).json(userPosts.concat(friendPosts));
    }catch(error){
        console.log("Error is: " + error)
        response.status(500).json(error);
    }
})


module.exports = router;