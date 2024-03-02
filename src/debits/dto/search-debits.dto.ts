export class SearchDebitsDto {
  page: number;
  limit: number;
  offset: number;
  role?: string;
  status?: string;
  fromDate: Date;
  toDate: Date;
}
