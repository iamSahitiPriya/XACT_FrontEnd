export interface SunburstSequenceChild{
  name: string
  rating?: number
  value?:number
  children : SunburstSequenceChild []
}
