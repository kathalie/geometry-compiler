export type StemmingInfo = Record<string, string[]>;

export const keywords = {
    point: 'ТОЧ',
    line: 'ПРЯМ',
    lineSegment: 'ВІДРІЗ',
    perpendicular: 'ПЕРПЕНДИКУЛЯ',
}

export const endingsKeywords: StemmingInfo = {
    [keywords.point]: ['КА', 'КУ', 'КИ', 'ЦІ', 'КАМ'],
    [keywords.line]: ['А', 'У', 'І', 'ІЙ', 'ИМ', 'ОЇ'],
    [keywords.lineSegment]: ['ОК', 'КИ', 'КУ', 'КАМ'],
    [keywords.perpendicular]: ['Р', 'РИ', 'РОМ', 'РУ'],
};

export const endingsOperators: StemmingInfo = {
    'ПОБУД': ['УВАТИ', 'УЙ', 'УЙТЕ'],
    'ПРОВ': ['ЕСТИ', 'ЕДІТЬ', 'ЕДИ'],
    'ПОЗНА': ['ЧИТИ', 'ЧТЕ', 'Ч'],
};