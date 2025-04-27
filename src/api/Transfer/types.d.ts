type TransferPayload = {
    ToAcountNumber: number
    FromId : string
    amount: number
    pin: number
    Description: string
}
type TransferResponse = {
    message: string;
    status: number;    
    data: Transfer;
}
type Transfer = {
    senderName: string
    receiverName: string
    amount: number
    description: string
    transferDate: string    
}