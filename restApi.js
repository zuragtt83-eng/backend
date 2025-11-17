import express from "express";
import fs from "fs";
const app = express();
app.get("/get-user/:name/:pass/:verifyPass/:balance", async (req, res) => {
  const { name, pass, verifyPass, balance } = req.params;
  const user = { name, pass, balance, id: Date.now() };
  if (pass !== verifyPass) {
    return res.status(400).send("Password does not match");
  } else {
    fs.writeFileSync("bank.json", JSON.stringify(user));
    console.log(user);
    res.json(user);
  }
});

app.get("/balance/:name/:pass", async (req, res) => {
  const { name, pass } = req.params;
  const data = fs.readFileSync("bank.json", "utf-8");
  const user = JSON.parse(data);
  if (name === user.name && pass == user.pass) {
    res.send(`Welcome ${name}, your balance is ${user.balance}`);
  } else {
    res.status(400).send("user not found");
  }
});

app.get("/Deposit/:name/:pass/:amount", async (req, res) => {
  const { name, pass, amount } = req.params;
  const data = fs.readFileSync("bank.json", "utf-8");
  const user = JSON.parse(data);
  if (name === user.name && pass == user.pass) {
    user.balance = Number(user.balance) + Number(amount);
    fs.writeFileSync("bank.json", JSON.stringify(user));
    res.send(`Deposit successful. New balance is ${user.balance}`);
  } else {
    res.status(400).send("user not found");
  }
});
app.get("/withdraw/:name/:pass/:amount", async (req, res) => {
  const { name, pass, amount } = req.params;
  const data = fs.readFileSync("bank.json", "utf-8");
  const user = JSON.parse(data);
  if (name === user.name && pass == user.pass) {
    user.balance = Number(user.balance) - Number(amount);
    fs.writeFileSync("bank.json", JSON.stringify(user));
    res.send(`Withdraw successful. New balance is ${user.balance}`);
  } else {
    res.status(400).send("user not found");
  }
});
app.get("/transaction/:name/:pass/:toName/:amount", async (req, res) => {
  const { name, toName, amount, pass } = req.params;
  const data = fs.readFileSync("bank.json", "utf-8");
  const user = JSON.parse(data);
  if (name === user.name && pass == user.pass) {
    if (toName !== user.name) {
      user.balance = Number(user.balance) - Number(amount);
      fs.writeFileSync("bank.json", JSON.stringify(user));
      res.send(`transaction successful. New balance is ${user.balance}`);
      console.log(`Transferred ${amount} to ${toName}`);
      console.log(`new balance ${user.balance}`);
    } else {
      res.status(400).send("Cannot transaction to the same account");
    }
  } else {
    res.status(400).send("user not found");
  }
});
app.listen(3000, () => {});
