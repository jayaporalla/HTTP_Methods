const http = require("http");
const qs = require("querystring");
let users = [
  {
    id: 1,
    name: "Jayasri",
  },
  {
    id: 2,
    name: "Sassy_tej",
  },
  {
    id: 3,
    name: "Chinni",
  },
];

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    console.log(req.url);
    if (req.url.includes("?")) {
      // const searchParams = new URLSearchParams(req.url);
      // const id = searchParams.get("id");
      const data = qs.decode(req.url);
      console.log(data);
      const id = data.id;
      const user = users.find((u) => u.id === +id);
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({
          user
        })
      );
      res.end();
    }
    res.setHeader("Content-Type", "application/json");
    res.write(
      JSON.stringify({
        users
      })
    );
    res.end();
  } else if (req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        data = JSON.parse(data);
        console.log(data);

        if (!data || !data.name) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          res.write(
            JSON.stringify({
              message: "Invalid Data",
            })
          );
          res.end();
        }
        const user = {
          id: Date.now(),
          name: data.name,
        };
        users.push(user);
        res.statusCode = 201; //created
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            user
          })
        );
        res.end();
      } catch (error) {
        res.statusCode = 500; //created
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            message: "Something went wrong, try again later!",
          })
        );
        res.end();
      }
    });
  } else if (req.method === "PUT") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        data = JSON.parse(data);
        if (!data || !data.name || !data.id) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          res.write(
            JSON.stringify({
              message: "Invalid Data",
            })
          );
          res.end();
        }
        const user = users.find((u) => u.id === data.id);
        user.name = data.name;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            user
          })
        );
        res.end();
      } catch (error) {
        res.statusCode = 500; // Server Error
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            message: "Something went wrong, try again later!",
          })
        );
        res.end();
      }
    });
  } else if (req.method === "DELETE") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        data = JSON.parse(data);
        if (!data || !data.id) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          res.write(
            JSON.stringify({
              message: "Invalid Data",
            })
          );
          return res.end();
        }
        const userExists = users.some((u) => u.id === data.id);
        users = users.filter((u) => u.id !== data.id);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            message: "Successfully Deleted",
          })
        );
        return res.end();
      } catch (error) {
        res.statusCode = 500; // Server Error
        res.setHeader("Content-Type", "application/json");
        res.write(
          JSON.stringify({
            message: "Something went wrong, try again later!",
          })
        );
        return res.end();
      }
    });
  }
});

server.listen(8080, () => console.log("Server open on 8080"));
