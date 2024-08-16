import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "",
  port: 5432
});
try{
  db.connect();
}catch(e){
  console.log("ERROR CONNECTING TO DATABASE\n",e);
}
// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

let items = [];

app.get("/", async (req, res) => {
  try{
    const results = await db.query("SELECT * FROM ITEMS")
    items = results.rows; 
  }catch(e){
    console.log("ERROR FETCHING ITEMS FROM DATABASE\n",e);
  }
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try{
    await db.query("INSERT INTO ITEMS (TITLE) VALUES ($1)",[item])
  }catch(e){
    console.log("insertion failed \n",e);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let id = req.body.updatedItemId;
  let item = req.body.updatedItemTitle
  try{
    await db.query("UPDATE ITEMS SET TITLE =($1) WHERE ID=($2)",[item,id]);
  }catch(e){
    console.log('UPDATE TABLE FAILED \n',e);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  let id = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM ITEMS WHERE ID=($1)",[id]);
  }catch(e){
    console.log("Failed Deleting \n",e);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
