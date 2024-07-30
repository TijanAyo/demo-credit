# Demo Credit

## Overview

This project is an MVP (Minimum Viable Product) for a wallet service in a mobile lending application. The wallet service allows users to perform the following actions:

- Create an account
- Fund their account
- Transfer funds to another user's account
- Withdraw funds from their account

## Tech Stack

- Node.js (LTS version)
- TypeScript
- Knex.js ORM
- MySQL database
- Jest (for unit testing)

## Setup Instruction

1. **Clone the repository**

   ```sh
   git clone https://github.com/TijanAyo/demo-credit.git

   # Change directory into project
   cd demo-credit
   ```

2. **Install dependencies**

   ```sh
   yarn install
   ```

3. **Configure the database**

   Ensure you have a MySQL database running. Update the `.env` file with your database credentials. Use `.env.example` as a reference for the required environment variables.

   Run the migrations to set up the database schema:

   ```sh
    yarn knex:push
   ```

4. **Run the application**

   ```sh
   # Run application in dev mode
   yarn start:dev

   # Run application
   yarn start
   ```

## ER-Diagram

[View on Eraser![](https://app.eraser.io/workspace/ZEy67ITx5reS1Pgp1iSJ/preview?elements=IkxkOG4uN95akODrmTUp3g&type=embed)](https://app.eraser.io/workspace/ZEy67ITx5reS1Pgp1iSJ?elements=IkxkOG4uN95akODrmTUp3g)

## Documentation

You can view the documentation for the project [here](https://documenter.getpostman.com/view/19118409/2sA3kaDKkU).

**P.S.**: The server tends to sleep after 15 minutes of inactivity due to Render's hosting policy. To avoid longer response times, please hit the `/` endpoint to wake the server.
