const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const api = supertest(app);
const helper = require("./test_helper");

describe("User API tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    await new User({ username: "name", passwordHash }).save();
  });

  test("should retrieve an existing user", async () => {
    const usersAtStart = await helper.usersInDb();
    expect(usersAtStart[0].username).toBe("name");
  });

  test("should successfully create a new user", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "user",
      name: "newname",
      password: "password",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  const validateCreationFailure = async (newUser, errorMessage) => {
    const usersAtStart = await helper.usersInDb();
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(errorMessage);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  };

  test("should fail if username is missing", async () => {
    const newUser = { name: "name", password: "password" };
    await validateCreationFailure(
      newUser,
      "username and password are required"
    );
  });

  test("should fail if password is missing", async () => {
    const newUser = { username: "root", name: "name" };
    await validateCreationFailure(
      newUser,
      "username and password are required"
    );
  });

  test("should fail if username is shorter than 3 characters", async () => {
    const newUser = { username: "aa", name: "name", password: "password" };
    await validateCreationFailure(
      newUser,
      "username and password must be at least 3 characters long"
    );
  });

  test("should fail if password is shorter than 3 characters", async () => {
    const newUser = { username: "aaasdsad", name: "name", password: "pa" };
    await validateCreationFailure(
      newUser,
      "username and password must be at least 3 characters long"
    );
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
