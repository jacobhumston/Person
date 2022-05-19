const { Person } = require("./Person.js");

const Bob = new Person("Bob", 10);
const Jimmy = new Person("Jimmy", 10);

Bob.friendRemoved.Connect(function (Values) {
    const Friend = Values[0];
    console.log("Bob has lost a friend: " + Friend);
});

Bob.friendAdded.Connect(function (Values) {
    const Friend = Values[0];
    console.log("Bob has gained a friend: " + Friend);
});

Jimmy.friendRemoved.Connect(function (Values) {
    const Friend = Values[0];
    console.log("Jimmy has lost a friend: " + Friend);
});

Jimmy.friendAdded.Connect(function (Values) {
    const Friend = Values[0];
    console.log("Jimmy has gained a friend: " + Friend);
});

Bob.Died.Connect(function () {
    console.log("Bob has died.");
});

Jimmy.Died.Connect(function () {
    console.log("Jimmy has died.");
});

console.log(Bob.Id);
console.log(Jimmy.Id);
