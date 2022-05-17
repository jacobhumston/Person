class Person {
    Name
    Age
    Friends
    #createdAt
    Events = ["friendAdded"]
    constructor(Name, Age) {
        this.Name = Name ?? "No Name"
        this.Age = Age ?? 0
        this.Friends = []
        this.#createdAt = new Date(Date.now())
        const NewEvents = {}
        for (const Event of Events) {
            NewEvents[Event] = {
                Functions = [],
                Connect = function(Function) {
                    const Identification = Date.now()
                    Functions.push({
                        Function = Function,
                        Identification = Identification,
                    })
                    return {
                        Disconnect = function() {
                            const Index = Functions.findIndex(Event => Event.Identification == Identification)
                            if (Index != -1) {
                                Functions.splice(Index)
                            } else {
                                throw "Event was already disconnected or removed."
                            }
                        } 
                    }
                },
                Fire = function(...Values) {
                    for (const FunctionObject of Functions) {
                        const Function = FunctionObject.Function
                        Function(Values)
                    }
                }
            }
        }
        this.Events = NewEvents
    }
    addFriend(Person) {
        this.Friends.push(Person)
        return this.Friends
    }
}

