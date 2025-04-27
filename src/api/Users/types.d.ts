type User ={
    userID: string
    userName: string
    passwordHash: string
    wallet: number
    isLocked: string
    acountNumber: number
    pin: number
}
type WithdrawPayload = {
    id: string
    amount: number
    pin: number
}
type DepositePayload = {
    id: string
    amount: number
    pin: number
}
