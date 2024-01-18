# Odin Members Only

![Screenshot](./members_screen.png)

**:key: Secret Code (case-sensitive):** `jointheOdinclub`

**:point_right: See it live [here]()**

Members Only is an exclusive clubhouse where anyone can come and see the messages but only logged-in users can write new messages. To see who created the message and when users have to get the membership by entering a SECRET code. Users can check their membership status in the navigation menu. There's also an admin who can see all the messages with author, date, and time, and can also delete the messages.

I created this project mainly to practice full-stack development with a focus on authentication and user permissions management.

## Features

- Create and Read public messages.
- User authentication with passport.
- User authorization and permissions management (Admin, secret member, member, and non-member).
- Securing passwords using bcryptjs.
- Club Membership by entering a secret code (that can be easily found).
- Schema validation using Mongoose.


### Prerequisites

- You'll need a running MongoDB instance, either locally or deployed in the cloud. You can deploy one easily following this [documentation](https://www.mongodb.com/docs/atlas/getting-started/).
- Nodejs version `20.9.0` or above.

### Cloning the repository

```bash
# Clone this repository
$ git clone git@github.com:xandernesta/odin-members-only.git

# Go into the repository
$ cd odin-members-only
```

### Getting the project ready

From `members-only` directory run the following commands.

```bash
# Install dependencies
$ npm install
```


### Setting up environment variables

- Populate `.env` located in server with the following environment variables:
  - `PORT`: Your node server will run on this port. Default is 3001. If you want to use a different port, make sure to update it in client's `.env` file.
  - `NODE_ENV`: Default is `development`.
  - `MONGODB_URI`: Update the placeholders with your running MongoDB instance's data.
  - `SECRET_MEMBER_PASSWORD`: The secret code you want users to enter in order to be come a secret club member.
  - `ADMIN_PASSWORD`: The secret code you want users to enter in order to become an Admin and be able to delete posts.
- Update the environment variables and save the file.

### Starting the application

From `odin-members-only` directory, run the following commands:

```bash

# Start the client - dev is a script located in package.json that will use concurrently to run (in parallel) nodemon and tailwindcss
$ npm run dev
```

## Technologies Used

- [Nodejs](https://nodejs.org/)
- [Expressjs](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoosejs](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

<a href="https://github.com/xandernesta/members-only/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License">
</a>
