-- Fix B migration: normalise quiz_results.topic_key from display names to slugs.
-- Validated against prod: 34 distinct values, all mapped.
UPDATE quiz_results SET topic_key = CASE topic_key
  WHEN 'Angles and Shapes'               THEN 'anglesshapes'
  WHEN 'Antonyms'                        THEN 'antonyms'
  WHEN 'Area and Perimeter'              THEN 'areaperimeter'
  WHEN 'Daily Learning'                  THEN 'daily-learning'
  WHEN 'Data Handling'                   THEN 'datahandling'
  WHEN 'Decimals'                        THEN 'decimals'
  WHEN 'Fractions'                       THEN 'fractions'
  WHEN 'Grammar'                         THEN 'grammar'
  WHEN 'Hidden Words'                    THEN 'hiddenWords'
  WHEN 'Letter Codes'                    THEN 'letterCodes'
  WHEN 'Letter Move'                     THEN 'letterMove'
  WHEN 'Letter Pair Series'              THEN 'letterPairSeries'
  WHEN 'Letter Sums & Missing Numbers'   THEN 'letterSums'
  WHEN 'Logic & Language Puzzles'        THEN 'logicAndLanguage'
  WHEN 'Long Division'                   THEN 'longdivision'
  WHEN 'Long Multiplication'             THEN 'longmultiplication'
  WHEN 'Missing Letters & Words'         THEN 'missingLettersWords'
  WHEN 'Negative Numbers'                THEN 'negativenumbers'
  WHEN 'Number Series'                   THEN 'numberSeries'
  WHEN 'Odd Two Out'                     THEN 'oddTwoOut'
  WHEN 'Percentages'                     THEN 'percentages'
  WHEN 'Place Value and Rounding'        THEN 'placevalue'
  WHEN 'Prime Numbers & Factors'         THEN 'primenumbersfactors'
  WHEN 'Punctuation'                     THEN 'punctuation'
  WHEN 'Ratio & Proportion'              THEN 'ratio'
  WHEN 'Reading Comprehension'           THEN 'comprehension'
  WHEN 'Shared Letter'                   THEN 'sharedLetter'
  WHEN 'Spelling'                        THEN 'spelling'
  WHEN 'Synonyms'                        THEN 'synonyms'
  WHEN 'Verbal Analogies'                THEN 'verbalAnalogies'
  WHEN 'Vocabulary'                      THEN 'vocabulary'
  WHEN 'Volume'                          THEN 'volume'
  WHEN 'Word Class & Grammar'            THEN 'wordClassGrammar'
  WHEN 'Word Patterns & Codes'           THEN 'wordCodeAnalogies'
  ELSE topic_key
END
WHERE topic_key IN (
  'Angles and Shapes','Antonyms','Area and Perimeter','Daily Learning','Data Handling',
  'Decimals','Fractions','Grammar','Hidden Words','Letter Codes','Letter Move',
  'Letter Pair Series','Letter Sums & Missing Numbers','Logic & Language Puzzles',
  'Long Division','Long Multiplication','Missing Letters & Words','Negative Numbers',
  'Number Series','Odd Two Out','Percentages','Place Value and Rounding',
  'Prime Numbers & Factors','Punctuation','Ratio & Proportion','Reading Comprehension',
  'Shared Letter','Spelling','Synonyms','Verbal Analogies','Vocabulary','Volume',
  'Word Class & Grammar','Word Patterns & Codes'
);
