// Fixed RSA-2048/RS256 test keypair. Generated once; never deployed to production.
// Used to: sign JWTs in tests (private) + serve mock JWKS via outboundService (public).

export const TEST_KID = 'test-key-1';

export const TEST_PUBLIC_JWK = {
  key_ops: ['verify'],
  ext: true,
  alg: 'RS256',
  kty: 'RSA',
  n: 'mZzeJSdohOqsEjDRys1u94WJtW7VtpE5GeA5aT9EjcDG1r1ZUdIUBKIWlrVvjGepqgdX7ymIfNTIZnZzAvJn0Vfo55jZt55Pd6J2U-p7cAEXUC7-nTViS2YJaAY4CTcnih1OzOjIe5InKdNxJi1L6ex0y7BUOunbVe8lI_j4fUPg9Od2hD87bHJVNIVjdacKLT9rwiD-3f97MwLlqhdvrM-Jqg3K4o9X31dxzSEhkbD1qwPEkwf3rMUz7PvuNcm-aT5mfFWC0_wyfdfaI_OCzphDiQhIVSVcRmmAIJSVUil-WZIXkwCVH-D72JbOq6XK-mtY4fk9PUlrgR93Id3uFw',
  e: 'AQAB',
  kid: 'test-key-1',
};

export const TEST_PRIVATE_JWK = {
  key_ops: ['sign'],
  ext: true,
  alg: 'RS256',
  kty: 'RSA',
  n: 'mZzeJSdohOqsEjDRys1u94WJtW7VtpE5GeA5aT9EjcDG1r1ZUdIUBKIWlrVvjGepqgdX7ymIfNTIZnZzAvJn0Vfo55jZt55Pd6J2U-p7cAEXUC7-nTViS2YJaAY4CTcnih1OzOjIe5InKdNxJi1L6ex0y7BUOunbVe8lI_j4fUPg9Od2hD87bHJVNIVjdacKLT9rwiD-3f97MwLlqhdvrM-Jqg3K4o9X31dxzSEhkbD1qwPEkwf3rMUz7PvuNcm-aT5mfFWC0_wyfdfaI_OCzphDiQhIVSVcRmmAIJSVUil-WZIXkwCVH-D72JbOq6XK-mtY4fk9PUlrgR93Id3uFw',
  e: 'AQAB',
  d: 'CcEGyzbhGrZkBQKJuOYXryrH2uW6gE2FhmdjWUqlvATUP_ucR3l6Cjb9Mery2p85VVZLv_uvcrbl6HBBBeVzsHOYSYx1H85FVhaJZqohQ9jbmmXTz-39SUYTZItL-eL4HA3g7shF0Gd5ZbiB9oLpPRx4DPgr7sCZAtTBd9eSdp9o-KB3c1IXFc9aAQHwRQA4AO0nqk3Rw6dCWvq_KF54m4iGnBcXrkvXtHFdnsSyjJEPBfz1xfsfG7LOP11QeYbq5FGYq97BHSCgFV_fRhMWkCkkv-ylWYLylm8dMqNwZzCKTPGHpFbyfT3KOmXhmWhc4kkTI5XR_WITKzULLo7SQQ',
  p: '1FWDAjfDiYXQ4Fq-ER0rm2DJ4a8y_rQ9Sp3YTW1S2taFcFHjtXv7u0w28oskJawnorbiwASmizd-eKV1D8zcZcuEYccZILvpjqHXAf3uf7vwFdmsYP94gbacnm0ieIViMU0WPtpAZaemPaJ8r8-OXjxFSFta3WtPsxYtQAegTBE',
  q: 'uTPuCZaLDJ5maUfqblb5x8Up-iya9zJKWnzX2q2CEKUTf3peZ62dUE-RWeZTTvSEnwe1yAkYtqZ6VtHlwYhonmN7zrGChdEHDZTSWZ6SQHFt5FNmwf4k5PPGiqkN2HEcxWiPLgKkB6FFTcx_FFcO5l3ZqQfZ_AAOiDJ6TYTyX6c',
  dp: 'Jxo8Txs_2kKXbcmoOPSbRDj11Kb0CC3fH6-j1tZsLLrWxhF-krxrZlmpwM7Y8Esc3X06kswIc5jbpJIr1aYPbHunPG5y9TFF2Kt7MfW2hzVwCEYW1aIWaiTcANzuPS2rIJMmppqAw3e1SKJ0vdfGSxpkU-fm-uG5Qqyx1pnQ7lE',
  dq: 'P4P7wvYKQg2g-cJcN_NEPqrztoTNsLFipp3iOXEABk1W3oVNEymLphtjsf033QAm65NtWGkmPJ3jnxrlPPZXStq7fyuJo_MIBDRh37JuXgOIuKGRwD400QB5utw3j19biqhNUm49axB4ADJ98q_YwFC3cSzsKWyrjzIgl61cokk',
  qi: 'B6UHW3SCokwRUcJbxLwTyNAfyJJldZESWSU_mpr0nHNVqFp9CNteyW7ywR3d5o_DJOJMFE29P8GqUVmKp5IGitbXVtl7-9smDhOyDHzNOxJhIO88ma4dlKSOm9leUC-1hu35piy6f_aaH_pD0Ias3bcpdc-TeM4eZOI6rxfzujw',
  kid: 'test-key-1',
};
