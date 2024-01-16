const asyncHandler = require("express-async-handler");

const details = {
    secretMember: {
        title: "Become a Secret Member",
        description: "by becoming a secret member, you will be able to post messages and see the author and date of each message. (See the passcode in console)",
    },
    
    admin: {
        title: "Become an Admin ",
        description: "by becoming an admin, you will be able to delete messages.",
    }

}

exports.become_secret_member_get = asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect("/login");
    else {
      res.render("membership", details.secretMember);
    }
  });

exports.become_secret_member_post = asyncHandler(async (req, res, next) => {
    if (req.body.password !== process.env.SECRET_MEMBER_PASSWORD) {
      // re-render form with password error
      res.render("membership", {
        ...details.secretMember,
        errors: { password: { msg: "Incorrect member password" } },
        password: req.body.password,
      });
      return;
    }
  
    if (req.user) {
      req.user.status = "secret-member";
      await req.user.save();
  
      res.redirect("/");
    } else {
      const err = new Error("User does not exist");
      err.status = 400;
      next(err);
    }
  });
  

exports.become_admin_get = asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect("/login");
    else {
      res.render("membership", details.admin);
    }
  });

exports.become_admin_post = asyncHandler(async (req, res, next) => {
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      res.render("membership", {
        ...details.admin,
        errors: { password: { msg: "Incorrect admin password" } },
        password: req.body.password,
      });
      return;
    }
  
    if (req.user) {
      req.user.status = "admin";
      req.user.isAdmin = true;
      await req.user.save();
      res.redirect("/");
    } else {
      const err = new Error("User does not exist");
      err.status = 400;
      next(err);
    }
  });