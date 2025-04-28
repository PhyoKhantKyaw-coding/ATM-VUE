type LoginPayload = {
    userName: string
    accountNumber: int
    password: string
}
type LoginResponse = {
    message: string;
    status: number;
    data: {
      message: string;
      data: User;
      issuccess: boolean;
      passwordStatus: boolean;
      accountStatus: boolean;
      token: string;
    };
}