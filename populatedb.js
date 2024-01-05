#! /usr/bin/env node

// Load .env file if server is not in production mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
console.log(
    'This script populates some test messages, users, and to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const bcrypt = require("bcryptjs");
  const Message = require("./models/message");
  const User = require("./models/user");
  
  const messages = [];
  const users = [];

  
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // user[0] will always be the blue user, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function userCreate(index, username, email, password, status, isAdmin) {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      // if err, do something
      if(err){
          console.log(err)
          throw new Error(err)
      } else {
      // otherwise, return hashedPassword
          const userDetail = { 
            username: username,
            email: email,
            password: hashedPassword,
            status: status,
            isAdmin: isAdmin, 
          }; 
        const user = new User(userDetail)
        const result = await user.save();
        users[index] = user;
      }
    })
    
    console.log(`Added user: ${username}`);
  }
  
  async function messageCreate(index, title, msg, author) {
    const messageDetail = {
      title: title,
      message: msg,
      author: author,
    }
    const message = new Message(messageDetail);
    await message.save();
    messages[index] = message;
    console.log(`Added message: ${title}`);
  }
  
  
  async function createUsers() {
    
    console.log("Adding users");
    await Promise.all([
      userCreate(0, "Jill", "jill@upthehill.net", process.env.JILL_PASS, "member", false),
      userCreate(1, "Jack", "jack@upthehill.net", process.env.JACK_PASS, "member", false ),
      userCreate(2, "Andy", "andy@netscape.net", process.env.ANDY_PASS,"non-member", false ),
      userCreate(3, "Ally", "ally@gmail.com", process.env.ALLY_PASS, "secret-member", false),
      userCreate(4, "admin", "admin@gmail.com", process.env.ADMIN_PASS, "admin", true),
    ]);
  }
  
  async function createMessages() {
    console.log("Adding Messages");
    await Promise.all([
      messageCreate(0,
        "1st Message",
        "Hi, I'm not JAck",
        users[0]
      ),
      messageCreate(1,
        "2nd Message",
        "Yo! Who you calling Jack!!!?",
        users[1]
      ),
      messageCreate(2,
        "Don't fight",
        "Hey guys, don't fight",
        users[3]
      ),
      messageCreate(3,
        "Don't hurt yourself kid",
        "You know what happened last time, don't want another bump on that head do yah?!",
        users[0]
      ),
      messageCreate(4,
        "Wow",
        "That was all your fault jerk! Never gonna listen to you again...",
        users[1]
      ),
      messageCreate(5,
        "Uhhh",
        "What the heck did I just stumble into?",
        users[3]
      ),
      messageCreate(6,
        "ADMIN: No Threatening of Violence Allowed",
        "Any further threats or unfriendly discourse will result in bans from this platform.",
        users[4]
      ),
      messageCreate(7,
        "Sorry",
        "I was just kidding, I love you Jack",
        users[0]
      ),
      messageCreate(8,
        "Sorry",
        "Love you too Jill",
        users[1]
      ),
      messageCreate(9,
        "LMAO",
        "Ya'll wild!",
        users[3]
      ),
    ]);
  }
  
  
  