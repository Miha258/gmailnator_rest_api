import puppeteer from 'puppeteer-extra'
import { Onlinesim } from './onlinesim'
import fs from 'fs'
import RegistrationData from './registrationData'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Browser, Page } from 'puppeteer'
import { executablePath } from 'puppeteer'
import { scrollPageToBottom } from 'puppeteer-autoscroll-down'
import { SingInSelectors } from './selectors'


interface Proxy {
    host: string | any
    port: string | any
    username: string | any
    password: string | any
}


const timeout = (milliseconds: number) => new Promise(r => setTimeout(r, milliseconds))


const bypassPhoneVerification = (): Promise<any> => new Promise(async (res, rej) => {
    let data = await Onlinesim.getNum()
    data = await Onlinesim.getState(data.tzid)
    res(data)
})



let page: Page
let browser: Browser

export const createEmail = async (proxy: Proxy) => {
    puppeteer.use(StealthPlugin())
    browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=http://${proxy.host}:${proxy.port}`],
        executablePath: executablePath()
    })
    
    page = await browser.newPage()
    
    await page.authenticate({        
        username: proxy.username,
        password: proxy.password
    })
    
    await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=SignUp', {
        waitUntil: 'load',
    })
    const email = RegistrationData.email() 
    const password = RegistrationData.password()

    await page.type(SingInSelectors.Username, RegistrationData.username())
    await page.type(SingInSelectors.Surname, RegistrationData.surname())
    await page.type(SingInSelectors.Email, RegistrationData.email())
    
    await page.type(SingInSelectors.Password, password)
    await page.type(SingInSelectors.ApprovePassword, password)
    
    await page.click(SingInSelectors.NextStep)
    const number = await bypassPhoneVerification()
    const profileId = await continueRegistarion()
    await browser.close()
    return {email, password, profileId, number}
}


const continueRegistarion = async () => {
    await page.waitForSelector(SingInSelectors.BirthDayInput)
    
    await timeout(1000)
    await page.type(SingInSelectors.BirthDayInput, RegistrationData.randomNumber(1, 30).toString())
    await timeout(1000)
    await page.type(SingInSelectors.BirthYearInput, RegistrationData.randomNumber(1980, 2000).toString())
    await timeout(1000)

    await page.$eval(SingInSelectors.BirthMonthSelector, (select: any) => select.selectedIndex = 1)
    await timeout(2000)
    await page.$eval(SingInSelectors.GenderSelector, (select: any) => select.selectedIndex = 1)
    await timeout(2000)

    await page.click(SingInSelectors.NextStep2)
    
    
    await page.waitForNavigation()
    await scrollPageToBottom(page, {
        delay: 500
    })
    const skipButton = await page.waitForSelector(SingInSelectors.TrunOnButton)
    await skipButton?.click()

    await page.waitForNavigation()
    await scrollPageToBottom(page, {
        delay: 500
    }) 
    const acceptButton = await page.waitForSelector(SingInSelectors.AcceptButton)
    await acceptButton?.click()

    await page.waitForNavigation({
        timeout: 60000
    })
    
    let profileId = fs.readdirSync('./profiles').length
    await page.screenshot({path: `profiles/${profileId}.png`})
    return profileId
}


export const sendCode = async (number: string) => {
    const numberInput = await page.waitForSelector(SingInSelectors.NumberInput)
    await numberInput?.type(number)

    await page.click(SingInSelectors.GetCode)
    return number
}
    

export const enterCode = async (code: string) => {
    const codeInput = await page.waitForSelector(SingInSelectors.CodeInput)
    await codeInput?.type(code)
    await page.click(SingInSelectors.CheckCode)
}


