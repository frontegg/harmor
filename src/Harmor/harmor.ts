import { HARmorOptions, HARmorRule } from '../types';
import HarmorBuilder from './builder';


export default class Harmor {

  static builder() {
    return new HarmorBuilder()
  }

  constructor(options: HARmorOptions) {
  }
}
//
// const harmor = async (options: HARmorOptions): Promise<string> => {
//
//   const { input, rules } = options;
//   let content = input;
//   for (const rule of rules) {
//
//     switch (rule.action) {
//       case 'replace':
//
//         if (typeof rule.value === 'string') {
//           content = content.replace(rule.selector, rule.value);
//         } else {
//           content = content.replace(rule.selector, rule.value);
//         }
//         break;
//     }
//     // rule.action === 'replace' && replace(content, rule);
//   }
//
//   return content
// }


// export default harmor
