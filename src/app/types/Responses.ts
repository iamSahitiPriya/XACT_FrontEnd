import {DummyResponse} from "./DumyResponse";

export interface Responses{

  products : DummyResponse[];
  total: number;
  skip: number,
  limit:number

}
