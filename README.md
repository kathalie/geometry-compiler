## Граматика мови
```
<нуль> ::= 0
<ненульова цифра> ::= 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
<цифра> ::= <нуль> | <ненульова цифра>
<довільна послідовність цифр> ::= <цифра> | <цифра><довільна послідовність цифр>
<послідовність цифр> ::= <нуль> | <ненульова цифра> | <цифра><послідовність цифр>
<натуральне число> ::= <цифра> | <ненульова цифра><послідовність цифр>

<positive_int> ::= <цифра> | <ненульова цифра><послідовність цифр>
<positive_float> ::= <int_num>"."<довільна послідовність цифр>
<negative_int> ::= "-"<positive_int>
<negative_float> ::= "-"<positive_float>

<any_number> ::= <positive_int> | <negative_int> | <positive_float> | <negative_float>

<point_keyword> ::= "ТОЧ"
<line_keyword> ::= "ПРЯМ"
<line_segment_keyword> ::= "ВІДРІЗ"

<coords> ::= '(' <any_number> ';' <any_number> ')'

<point_id> ::= [A-Z]
<point> ::= <point_id> | <point_id> <coords>
<point_with_possibly_keyword> ::= <point_keyword>? <point> 

<line> ::= <line_keyword> <point_with_possibly_keyword> <point_with_possibly_keyword>
<line_segment> ::= <line_segment_keyword> <point_with_possibly_keyword> <point_with_possibly_keyword>
//<parallel_line> ::= <line_keyword>? "ПАРАЛЕЛЬН"
<perpendicular> ::= "ПЕРПЕНДИКУЛЯ" <point> (<line> | <line_segment>)

<object> ::= <point_keyword> <point> | <line> | <line_segment> | <perpendicular>

<operator> ::= "ПОБУД" | "ПРОВ" | "ПОЗНА"

<command> ::= <operator> <object>

<task> ::= { <command> '.' } 'eos'
```

## Приклади
### Приклади обʼєктів, у які буде перекладено вхідний текст і передено на клієнт для подальшого відмалювання геометричних зображень відповідно до значень цих обʼктів.
```
ПОЗНАЧИТИ ТОЧКУ: 
{
    elementType: 'point', 
    parents: [-10, 1], 
    attributes: {name: 'C'}
},
ПРОВЕСТИ ПРЯМУ:
{
    elementType: 'line', 
    parents: ["A", "B"]
}
ПОБУДУВАТИ ВІДРІЗОК:
{
    elementType: 'line',
    parents: ["A", "B"],
    attributes: {straightFirst:false, straightLast:false}
}
```

### Приклади команд

`ПОЗНАЧИТИ ТОЧКУ A З КООРДИНАТАМИ (0, 0).`

`ПРОВЕСТИ ПРЯМУ ЧЕРЕЗ ДВІ ТОЧКИ A, B.`

`ПОБУДУВАТИ ПЕРПЕНДИКУЛЯР ДО ПРЯМОЇ AB В ТОЧЦІ C.`

`ПОБУДУВАТИ ТРИКУТНИК ПО ТРЬОМ ВЕРШИНАМ А,В,С.`
