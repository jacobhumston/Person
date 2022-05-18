class Person {
    Name;
    Age;
    #Friends;
    #ID;
    #isPerson;
    #createdAt;
    #Events = ["friendAdded", "friendRemoved"];

    constructor(Name, Age) {
        this.Name = Name ?? "No Name";
        this.Age = Age ?? 0;
        this.#Friends = [];
        this.#ID = "ID-" + Date.now();
        this.#isPerson = true;
        this.#createdAt = new Date(Date.now());
        for (const Event of this.#Events) {
            const Functions = [];
            this[Event] = {
                Functions: Functions,
                Connect: function (Function, isAsync) {
                    const Identification = Date.now();
                    Functions.push({
                        Function: Function,
                        isAsync: isAsync ?? false,
                        Identification: Identification,
                    });
                    return {
                        Disconnect: function () {
                            const Index = Functions.findIndex((Event) => Event.Identification == Identification);
                            if (Index != -1) {
                                Functions.splice(Index);
                            } else {
                                throw "Event was already disconnected or removed.";
                            }
                        },
                    };
                },
                Fire: function (...Values) {
                    for (const FunctionObject of Functions) {
                        const Function = FunctionObject.Function;
                        const isAsync = FunctionObject.isAsync;
                        if (isAsync == true) {
                            (async () => {
                                await Function(Values);
                            })();
                        } else if (isAsync == false) {
                            Function(Values);
                        }
                    }
                },
            };
        }
    }

    get Friends() {
        const ShallowCopy = [];
        for (const Friend of this.#Friends) {
            ShallowCopy.push(Friend);
        }
        return ShallowCopy;
    }

    get ID() {
        return this.#ID;
    }

    get isPerson() {
        return this.#isPerson;
    }

    get createdAt() {
        return this.#createdAt;
    }

    get eventList() {
        const ShallowCopy = [];
        for (const Event of this.#Events) {
            ShallowCopy.push(Event);
        }
        return ShallowCopy;
    }

    #validatePerson(Person, Context) {
        let isPerson = false;
        if ((typeof Person == "object") == true) {
            if (Person.isPerson == true) {
                isPerson = true;
            }
        }
        if (isPerson == false) {
            throw "Argument provided is not a person. Context: '" + Context + "' Type provided was: '" + typeof Person + "'";
        }
    }

    #getContext(Method) {
        return "Person: " + this + ", Method: " + Method;
    }

    addFriend(Person, dontThrowIfAlreadyFriends) {
        dontThrowIfAlreadyFriends = dontThrowIfAlreadyFriends ?? false;
        this.#validatePerson(Person, this.#getContext("addFriend"));
        if (Person == this) throw this + " can't be friends with themself.";
        if (this.#Friends.findIndex((Friend) => Person.ID == Friend.ID) != -1) {
            if (dontThrowIfAlreadyFriends == false) throw this + " is already friends with " + Person + ".";
            return;
        }
        this.#Friends.push(Person);
        this.friendAdded.Fire(Person);
        Person.addFriend(this, true);
        return this.#Friends;
    }

    removeFriend(Person, dontThrowIfNotFriends) {
        dontThrowIfNotFriends = dontThrowIfNotFriends ?? false;
        this.#validatePerson(Person, this.#getContext("addFriend"));
        const Index = this.#Friends.findIndex((Friend) => Person.ID == Friend.ID);
        if (Index != -1) {
            this.#Friends.splice(Index);
        } else {
            if (dontThrowIfNotFriends == true) throw "These two people are not friends.";
            return;
        }
        this.friendRemoved.Fire(Person);
        Person.removeFriend(this);
        return this.#Friends;
    }

    toString() {
        return this.Name;
    }

    Log() {
        console.log(this);
    }
}

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

Bob.addFriend(Jimmy);
Jimmy.removeFriend(Bob);
