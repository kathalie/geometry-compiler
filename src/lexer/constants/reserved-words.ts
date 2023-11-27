export type StemmingInfo = Record<string, string[]>;

export const endingsKeywords: StemmingInfo = {
    'ТОЧ': ['КА', 'КУ', 'КИ', 'ЦІ', 'КАМ'],
    'ПРЯМ': ['А', 'У', 'І', 'ІЙ', 'ИМ'],
    'ВІДРІЗ': ['ОК', 'КИ', 'КУ', 'КАМ'],
};

export const endingsOperators: StemmingInfo = {
    'ПОБУД': ['УВАТИ', 'УЙ', 'УЙТЕ'],
    'ПРОВ': ['ЕСТИ', 'ЕДІТЬ', 'ЕДИ'],
    'ПОЗНА': ['ЧИТИ', 'ЧТЕ', 'Ч'],
};