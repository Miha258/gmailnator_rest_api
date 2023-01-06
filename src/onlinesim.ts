import axios from "axios"
import { sendCode, enterCode } from "./gmailnator"


export class Onlinesim {
    private static async get<T>(endpoint: string, params = {}): Promise<T> {
        const token = process.env.OnlinesimToken
        const api = "https://onlinesim.ru/api/"
        const url = api + endpoint

        return await axios.get(url, {
            params: {
                apikey: token,
                ...params
            }
        })
    }


    static async setOperationOk(tzid: string) {
        const res = await this.get<any>('setOperationOk.php', {
            tzid
        })
        return res.data 
    }

 
    static async getNum() {
        const res = await this.get<any>('getNum.php', {
            service: 'google'
        })
        return res.data
    }   


    static async getState(tzid: string): Promise<any> {
        
            let code: any
            let waitingTime = 5000
            let totalWaited = 0
            
            const number = await new Promise((res, rej) => {
                let number = ""
                const codeChecker = setInterval(async () => {
                    totalWaited += waitingTime
                    if (totalWaited > 120000) {
                        await Onlinesim.setOperationOk(tzid)
                        rej('Error code')
                    }
    
       
                    const res = await this.get<any>('getState.php', {
                        tzid,
                        message_to_code: 1,
                        form: 1,
                        msg_list: 0,
                    })
        
                    if (!res.data.response) {
                        if (!number){
                            number = await sendCode(res.data[0].number)
                        }
                        code = res.data[0].msg
                        if (code) {
                            await Onlinesim.setOperationOk(tzid)
                            await enterCode(code)
                            clearInterval(codeChecker)
                        }
                    }
                }, waitingTime)
                res(number) 
            })
            return number
    }
}
