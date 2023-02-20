export interface TopicData{
  categoryId:number
  categoryName:string
  categoryStatus:boolean
  moduleId:number,
  moduleName:string,
  moduleStatus : boolean
  topicId: number,
  topicName:string,
  active:boolean
  updatedAt : number,
  comments ?: string,
  isEdit ?: boolean

}
