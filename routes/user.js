const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
  const rawUsers = fs.readFileSync(__dirname + "/../data/users.json", "utf-8");
  const usersData = JSON.parse(rawUsers);

  const response = {
    data: usersData,
    total: usersData.length,
  };
  return res.status(200).json(response);
});

router.patch("/:id", (req, res) => {
  const userId = req.params.id;
  const userBody = req.body;

  if (!userId) return res.status(403).json({ message: "Incorrect id" });

  const rawUsers = fs.readFileSync(__dirname + "/../data/users.json", "utf-8");
  const rawRoles = fs.readFileSync(__dirname + "/../data/roles.json", "utf-8");
  let usersData = JSON.parse(rawUsers);
  let userRoles = JSON.parse(rawRoles);

  const userExists = usersData.some((user) => user.id === userId);
  if (!userExists) return res.status(405).json({ message: "User not found" });

  let updatedUser = {};

  const modifiedUsers = usersData.map((user) => {
    if (user.id === userId) {
      for (const [key, value] of Object.entries(userBody)) {
        // ading / removing role name to roles array
        if (key === "roleIds") {
          const newRoles = userRoles
            .filter((role) => value.includes(role.id))
            .map((role) => role.name);
          user.roles = newRoles;
        }
        user[key] = value;
      }
      updatedUser = user;
    }
    return user;
  });

  try {
    fs.writeFileSync(
      __dirname + "/../data/users.json",
      JSON.stringify(modifiedUsers),
      {
        encoding: "utf-8",
      }
    );
    return res.status(203).json({ data: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch" });
  }
});

module.exports = router;
