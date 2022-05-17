class Person {
    Name;
    Age;
    Friends;
    #createdAt;
    Events = ["friendAdded"];
    constructor(Name, Age) {
        this.Name = Name ?? "No Name";
        this.Age = Age ?? 0;
        this.Friends = [];
        this.#createdAt = new Date(Date.now());
        const NewEvents = {};
        for (const Event of this.Events) {
            const Functions = [];
            NewEvents[Event] = {
                Functions: Functions,
                Connect: function (Function) {
                    const Identification = Date.now();
                    Functions.push({
                        Function: Function,
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
                        Function(Values);
                    }
                },
            };
        }
        this.Events = NewEvents;
    }
    addFriend(Person) {
        this.Friends.push(Person);
        this.Events.friendAdded.Fire(Person)
        return this.Friends;
    }
}

const Bob = new Person("Bob", 23)

const Event = Bob.Events.friendAdded.Connect(function(value){
    const Friend = value[0]
    console.log("Added friend: ", Friend.Name)
})

const Jimmy = new Person("Jimmy", 2000)

Bob.addFriend(Jimmy)
Bob.addFriend(Bob)

Event.Disconnect();