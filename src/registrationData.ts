export default class RegistrationData {
    private static randomChoice<T>(choices: Array<T>): T  {
        var index = Math.floor(Math.random() * choices.length)
        return choices[index]
    }
    
    public static randomNumber(start: number, end: number): number {
        const range = []
        for (let i = start; i <= end; i++) {
            range.push(i)
        }
        return this.randomChoice(range)
    }
    
    private static randomString(): string {
        const symbols = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'b']
        let str = ""
        
        for (let i = 0; i < symbols.length; i++) {
            str += symbols[i] + this.randomNumber(0, 10)
        }

        return str
    }

    static username(): string {
        const names = [
            "Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "Elijah", "Amelie", "James", "Ava", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn","Theodore",	"Harper"
        ]   
        return this.randomChoice(names)
    }

    static surname(): string {
        const surnames = [
            "Smith", "English", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Spanish", "Miller", "Davis", "Welsh", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson", "Taylor"
        ]
        
        return this.randomChoice(surnames)
    }

    static email(): string {
       return this.randomString()
    }

    static password(): string {
        return this.randomString().toUpperCase()
    }
}