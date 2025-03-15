
export interface QuestionListInfinite extends QuestionList {
  nextCursor: number
}
export interface QuestionList {
  total: Number
  question_list: Question
}
interface Question {
  id: Number
  subject: string | undefined
  content: string | undefined
  create_date: string | undefined
}