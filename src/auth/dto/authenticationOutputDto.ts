export class AuthenticationOutputDto {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    taxpayerNumber: string;
    phoneNumber: string;
  };
  token: string;
}
