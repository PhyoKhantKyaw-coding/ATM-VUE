type APIResponse = {
    message: string;
    status: number;    
    data: User;
}
type RegisterPayload = {
    userName: string
    password: string
    pin: number
    wallet: number
}
