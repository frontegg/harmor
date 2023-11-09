import { QuestionerResult } from '../questioner/types';
import { HARmorOptions } from '../types';


type BasicTemplate = {
  type: 'basic'
} & QuestionerResult

type AdvancedTemplate = {
  type: 'advanced'
} & HARmorOptions

export type HARmorTemplate = AdvancedTemplate | BasicTemplate
