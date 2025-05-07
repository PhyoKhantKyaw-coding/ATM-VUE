type TransferPayload = {
    ToAcountNumber: number;
    amount: number;
    pin: number;
    Description: string;
  };
  
  type TransferResponse = {
    message: string;
    status: number;
    data: Transfer;
  };
  
  type HistoryResponse = {
    message: string;
    status: number;
    data: Transfer[];
  };
  
  type TransactionResponse = {
    message: string;
    status: number;
    data: Transaction[];
  };
  
  type Transaction = {
    transactionID: string;
    amount: number;
    transactionDate: string;
    transactionType: string;
  };
  
  type Transfer = {
    senderName: string;
    receiverName: string;
    amount: number;
    description: string;
    transferDate: string;
  };

