## Граматика мови (LL(1))
```
<task> ::= { <command> '.' }

<command> ::= <operator> <object>

<operator> ::= "ПОБУД" | "ПРОВ" | "ПОЗНА"

<object> ::= <point_with_keyword> | <line> | <line_segment> | <perpendicular>

<line> ::= <line_keyword> <two_points>
<line_segment> ::= <line_segment_keyword> <two_points>
<two_points> ::= <point> <point>
<perpendicular> ::= <perpendicular_keyword> <point> <perpendicular_to>
<perpendicular_to> ::= <line> | <line_segment>

<point> ::= <point_with_keyword> | <point_without_keyword>
<point_with_keyword> ::= <point_keyword> <point_without_keyword>
<point_without_keyword> ::= <point_id> <predefined_placing>
<predefined_placing> ::= <coords> | ε

<coords> ::= '(' <any_number> ';' <any_number> ')'


<point_id> ::= [A-Z]
<point_keyword> ::= "ТОЧ"
<line_keyword> ::= "ПРЯМ"
<line_segment_keyword> ::= "ВІДРІЗ"
<perpendicular_keyword> ::= "ПЕРПЕНДИКУЛЯ"
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

### Приклади дпустимих задач

`ПОЗНАЧИТИ ТОЧКУ A З КООРДИНАТАМИ (0, 0). ПОЗНАЧИТИ ТОЧКУ B (1.2, 3.5). ПОБУДУВАТИ ВІДРІЗОК AB.`

`ПРОВЕСТИ ПРЯМУ ЧЕРЕЗ ДВІ ТОЧКИ A B. ПОБУДУВАТИ ПЕРПЕНДИКУЛЯР З ТОЧКИ C ДО ПРЯМОЇ AB.`

`ПОБУДУВАТИ ВІДРІЗОК AB. ПРОВЕСТИ ПРЯМУ CD. ПОБУДУВАТИ ПЕРПЕНДИКУЛЯР З ТОЧКИ F ДО ПРЯМОЇ CD. ПОБУДУВАТИ ПЕРПЕНДИКУЛЯР З ТОЧКИ K ДО ВІДРІЗКУ AB.`
