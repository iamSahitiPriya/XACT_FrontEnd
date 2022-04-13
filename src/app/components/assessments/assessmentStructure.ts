export interface AssessmentStructure {
  "assessmentId": number,
  "assessmentName": string,
  "organisation": {
    "organisationId": number,
    "organisationName": string,
    "industry": string,
    "domain": string,
    "size": number
  },
  "description": string,
  "assessmentStatus": string,
  "createdAt": number,
  "updatedAt": number

}
