### Grammar

ПРОВЕСТИ   ПРЯМУ   ЧЕРЕЗ  ДВІ ТОЧКИ A, B.

ПОБУДУВАТИ  ПЕРПЕНДИКУЛЯР  ДО ПРЯМОЇ   (AB)  В ТОЧЦІ C.

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


<id_point> ::= [A-Z]
<id_line> ::= <id_point><id_point>

<coords> ::= '(' <any_number> ';' <any_number> ')'

<operator> ::= "ПОБУДУВАТИ" | "ПРОВЕСТИ" | "ПОЗНАЧИТИ"

<point> ::= "ТОЧК" ( <id_point> <coords> | <id_point>)
<line> ::= "ПРЯМ" <point> <point>
<line_segment> ::= "ВІДРІЗ" <point> <point>
<perpendicular> ::= "ПЕРПЕНДИКУЛЯР" ( <line> | <line_segment> ) <point>

<object> ::= <point> | <line> | <line_segment>

<command> ::= <operator> <object>

<task> ::= { <command> '.' } 'eos'
