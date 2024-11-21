export type StemmingInfo = Record<string, string[]>;

export const keywords = {
    point: 'точ',
    line: 'прям',
    lineSegment: 'відріз',
    perpendicular: 'перпендикуля',
    triangle: 'трикутни',
}

export const endingsKeywords: StemmingInfo = {
    [keywords.point]: ['ка', 'ку', 'ки', 'ці', 'кам'],
    [keywords.line]: ['а', 'у', 'і', 'ій', 'им', 'ої'],
    [keywords.lineSegment]: ['ок', 'ки', 'ку', 'кам'],
    [keywords.perpendicular]: ['р', 'ри', 'ром', 'ру'],
    [keywords.triangle]: ['к', 'ки', 'ком', 'ку'],
};

export const endingsOperators: StemmingInfo = {
    'побуд': ['увати', 'уй', 'уйте'],
    'пров': ['ести', 'едіть', 'еди'],
    'позна': ['чити', 'чте', 'ч'],
};