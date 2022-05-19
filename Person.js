const { v4: createId } = require("uuid");

class Person {
    Name;
    Age;
    #Money;
    #isDead;
    #Friends;
    #Id;
    #isPerson;
    #createdAt;
    #Events = ["friendAdded", "friendRemoved", "Died", "moneyChanged"];

    constructor(Name, Age) {
        this.Name = Name ?? "No Name";
        this.Age = Age ?? 0;
        this.#Money = 100;
        this.#isDead = false;
        this.#Friends = [];
        this.#Id = createId();
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
                                throw "Function was already disconnected or removed.";
                            }
                        },
                        disconnectAll: function () {
                            if (Functions.length > 0) {
                                Functions.length = 0;
                            } else {
                                throw "All functions have already been disconnected or removed.";
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

    get Money() {
        return this.#Money;
    }

    get isDead() {
        return this.#isDead;
    }

    get Friends() {
        const ShallowCopy = [];
        for (const Friend of this.#Friends) {
            ShallowCopy.push(Friend);
        }
        return ShallowCopy;
    }

    get Id() {
        return this.#Id;
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

    #safetyCheck() {
        if (this.#isDead == true) {
            throw this + " is dead.";
        }
    }

    #addMoney(Amount) {
        this.#Money = this.#Money + Amount;
        this.moneyChanged.Fire(this.#Money);
    }

    #subtractMoney(Amount) {
        this.#Money = this.#Money - Amount;
        this.moneyChanged.Fire(this.#Money);
    }

    #setMoney(Amount) {
        this.#Money = this.#Money = Amount;
        this.moneyChanged.Fire(this.#Money);
    }

    disconnectAllEvents() {
        const Success = [];
        const Errors = [];
        for (const Event of this.#Events) {
            const Connection = this[Event].Connect(function () {});
            try {
                Connection.disconnectAll();
                Success.push(Event);
            } catch (Message) {
                Errors.push({
                    Event: Event,
                    Error: Message,
                });
            }
        }
        return {
            Success: Success,
            Errors: Errors,
        };
    }

    addFriend(Person, dontThrowIfAlreadyFriends) {
        this.#safetyCheck();
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
        this.#safetyCheck();
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

    Say(Message, returnString) {
        Message = Message ?? "nothing";
        returnString = returnString ?? false;
        if (returnString == false) {
            console.log(this + " said: " + Message);
        } else if (returnString == true) {
            return this + " said: " + Message;
        }
    }

    Kill() {
        this.#isDead = true;
        this.Died.Fire();
    }

    Clone() {
        const NewPerson = new Person(this.Name, this.Age);
        // Maybe clone everything else later? For now that doesn't seem needed.
        return NewPerson;
    }

    toString() {
        return this.Name;
    }

    Log() {
        console.log(this);
    }
}

module.exports = {
    Person: Person,
};
