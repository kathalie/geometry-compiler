## Граматика мови (LL(1))
```
<task> ::= { <command> '.' }

<command> ::= <operator> <object>

<operator> ::= "побуд" | "пров" | "позна"

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
<point_keyword> ::= "точ"
<line_keyword> ::= "прям"
<line_segment_keyword> ::= "відріз"
<perpendicular_keyword> ::= "перпендикуля"
<perpendicular_keyword> ::= "трикутни"
```

### Обʼєкти, які генеруються з вхідної стрічки у відповідній послідовності для подальшої відмальовки на клієнті.
```
Точка: 
{
    elementType: 'point', 
    parents: [-10, 1], 
    attributes: {name: 'C'}
}

Пряма:
{
    elementType: 'line', 
    parents: ["A", "B"]
}

Відрізок:
{
    elementType: 'line',
    parents: ["A", "B"],
    attributes: {straightFirst:false, straightLast:false}
}
```

## Приклади допустимих задач

`Позначити точку A з координатами (0, 0). Позначити точку B (1.2, 3.5). Побудувати відрізок AB.`

`Провести пряму через дві точки A B. Побудувати перпендикуляр з точки C до прямої AB.`

`Побудувати відрізок AB. Провести пряму CD. Побудувати перпендикуляр з точки F до прямої CD. Побудувати перпендикуляр з точки K до відрізку AB.`
