const express = require("express");

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "register.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// app.get("/", (request, response) => {
//   response.send("Hello World!");
// });

// get all users

app.get("/users/", async (request, response) => {
  const ge = `
    SELECT
      *
    FROM
      registeru
    ORDER BY
      id;`;
  const r = await db.all(ge);
  response.send(r);
});

// get deatils of exact userId
app.get("/users/:Id/", async (request, response) => {
  const { bookId } = request.params;
  const ge = `
    SELECT
      *
    FROM
      registeru
    WHERE
      book_id = ${Id};`;
  const r = await db.get(ge);
  response.send(r);
});

//create user

app.post("/user/", async (request, response) => {
  const us = request.body;
  const {
    id,
    name,
    email,
    phonenumber,
    dateofbirth,
    age,
    gender,
    address,
    city,
    pincode,
  } = us;
  const add = `
    INSERT INTO
      registeru (id,name,email,phonenumber,dateofbirth,age,gender,address,city,pincode)
    VALUES
      (
        ${id},
         '${name}',
         '${email}',
         ${phonenumber},
         ${dateofbirth},
        ${age},
         '${gender}',
        '${address}',
        '${city}',
         ${pincode},
        
      );`;

   await db.run(add);
  response.send("inserted");
});


// update user
app.put("/user/:Id/", async (request, response) => {
  const { Id } = request.params;
  const userdetails = request.body;
  const {
    id,
    name,
    email,
    phonenumber,
    dateofbirth,
    age,
    gender,
    address,
    city,
    pincode,
  } = userdetails;
  const updateQuery = `
    UPDATE
      registeru
    SET
    id=${id},
    name='${name}',
    email='${email}',
   phonenumber= ${phonenumber},
   dateofbirth= ${dateofbirth},
   age=${age},
    gender='${gender}',
   address='${address}',
   city='${city}',
    pincode=${pincode}  
    WHERE
      id = ${Id};`;
  await db.run(updateQuery);
  response.send("user Updated Successfully");
});

//del user
app.delete("/del/:Id", async(request,response)=>{
  const ge=request.params
  const q=`DELETE FROM registeru WHERE id=${id};`
  await db.run(q)
  response.send("user deleted")
})

initializeDBAndServer();
