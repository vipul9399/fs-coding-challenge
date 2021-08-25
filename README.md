# Coding-Challenge
## _Movie Database Rest API Backend_


## Framework

- ExpressJs - https://expressjs.com/

## Packages

- JOI - https://www.npmjs.com/package/joi - For Request Schema Validation
- Bookshelf - https://www.npmjs.com/package/bookshelf - ORM for Database Management
- bcrypt- https://www.npmjs.com/package/bcrypt - For hashing Passwords
- nodemon - For monitoring changes in files in dev mode

## Packages

- JOI - https://www.npmjs.com/package/joi - For Request Schema Validation
- Bookshelf - https://www.npmjs.com/package/bookshelf - ORM for Database Management
- bcrypt- https://www.npmjs.com/package/bcrypt - For hashing Passwords
- nodemon - For monitoring changes in files in dev mode



## Step to run this API locally

- Clone the repository form the following URL: https://github.com/vipul9399/fs-coding-challenge
- Do npm install or yarn at the root of the repository
- Import challenge-assignment.sql file into phpmyadmin or mysql server.
- Change the database configurations in the following file `/src/config/db.js` as per the credentials.
- At the root of the derectory run the following command `npm run dev-win` Or `yarn dev-win` for windows and `npm run dev` Or `yarn dev` for linux to start the api using nodemon.
- Import Postman Collection `Assignment.postman_collection.json` from root dir into POSTMAN
-- It contains all the API calls mentioned in the assignment itself

# Steps to run POSTMAN Collection for Authorized routes
- Create new user using `Register POST` menthod
- Do Login via `Authenticate POST` mentod
-- Response Body will contains ```token``` which is used for further API calls 
-- Update the token Globally inside the POSTMAN Collection.
-- Authorization method should have `type: Bearer Token`
-- Update token over the `token field` received from `Authenticate` API response
- Once above step is done, all other authorized API can be used further