import JXG from "jsxgraph";

// {elementType: 'point', parents: [-1, 1], attributes: {name: 'A'}},
// {elementType: 'point', parents: [2, -1], attributes: {name: 'B'}},
// {elementType: 'line', parents: ["A", "B"]}

type ElementDTO = {
  elementType: 'point' | 'line',
  parents: unknown[],
  attributes?: Record<string, unknown>,
}
async function fetchElements(): Promise<ElementDTO[]> {
  let res = await fetch('http://localhost:3000/')

  return await res.json()
}

function init() {
  let board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});

  fetchElements().then((elements) => {
    for (let element of elements) {
      board.create(element.elementType, element.parents, element.attributes)
    }
  })
}

init()
