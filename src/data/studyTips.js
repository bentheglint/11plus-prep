// Combined study tips index — imports from all category files
// Tips are loaded per-subject in the Study Toolkit

import mathsTips from './mathsTips';
import englishTips from './englishTips';
import vrTips from './vrTips';
import generalTips from './generalTips';

const allTips = [...mathsTips, ...englishTips, ...vrTips, ...generalTips];

export { mathsTips, englishTips, vrTips, generalTips };
export default allTips;
