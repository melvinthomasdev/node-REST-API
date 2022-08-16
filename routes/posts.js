const router = require("express").Router();
const { request } = require("express");
const Post = require("../models/Post");


// Create post
router.post("/", async (request, response) => {
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
    }
});

// Update a post
router.put("/:id", async (request, response) => {
    try {
        const post = Post.findById(request.params.id);
        if (post.userId === request.body.userId){
            await post.updateOne({$set: request.body})
            response.status(200).json({
                "message": "post Updated",
                "post": post
            })
        } else {
            response.status(403).json({"message": "You can only update your own post!"})
        }
    } catch(error) {
        console.log("Error is: " + error);
        response.status(500).json({"message": "Some Error!"});
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
        response.status(500).json({"message": "Some Error"})
    }
});

// Like a  post
router.put("/:id/like", async (request, response) => {
    try {
        const post = Post.findById(request.params.id);
        if (!post.likes.includes(request.body.userId)){
            post.updateOne({$push: {likes: request.body.userId}});
            response.status(200).json({"message": "Liked post"})
        } else {
            response.status(403).json({"message": "You already liked this post"})
        }
    } catch(error){
        console.log("Error is: " + error);
        response.status(500).json({"message": "Some Error"});
    }
})

// Unike a  post
router.put("/:id/unlike", async (request, response) => {
    try {
        const post = Post.findById(request.params.id);
        if (post.likes.includes(request.body.userId)){
            await post.updateOne({$pull: {likes: request.body.userId}});
            response.status(200).json({"message": "Unliked post"})
        } else {
            response.status(403).json({"message": "You haven't liked this post!"})
        }
    } catch(error){
        console.log("Error is: " + error);
        response.status(500).json({"message": "Some Error"});
    }
})

// Get a post
router.get("/:id", async (request, response) => {
    try {
        const post = Post.findById(request.params.id);
        response.status(200).json(post);
    } catch(error){
        console.log("Error is: " + error);
        response.status(500).json({"message": "Some Error"});
    }
})

// get timeline posts

module.exports = router;