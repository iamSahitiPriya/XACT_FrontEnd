export interface ParameterData{
  categoryId :number,
  categoryName:string,
  categoryStatus ?:boolean,
  moduleId:number,
  moduleName :string,
  moduleStatus ?: boolean,
  topicId:number,
  topicName:string,
  topicStatus ?: boolean,
  topicLevelReference ?:boolean,
  parameterId:number,
  parameterName:string,
  active?:boolean,
  updatedAt ?: number,
  comments ?: string
  isEdit ?: boolean
  openReferences ?: boolean,
  openQuestions ?: boolean,
  parameterLevelReference?:boolean
}
