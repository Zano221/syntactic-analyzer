
HTMLTable = null;

var stack = "S";
var input = null;

let STATE = "S";
var stepAmmount = 0;

/*S ::= cBb | bCa | abC
A ::= aCb | cB | bB
B ::= acC | ε
C ::= cb | bcS */

/*parsingTable = {
  "S": { "c": ["c", "B", "b"], "b": ["b", "C", "a"], "a": ["a", "b", "C"] },
  "A": { "a": ["a", "C", "b"], "c": ["c", "B"], "b": ["b", "B"] },
  "B": { "a": ["a", "c", "C"], "c": ["a", "c", "C"], "$": ["ε"], "b": ["ε"] },
  "C": { "c": ["c", "b"], "b": ["b", "c", "S"] } 
}*/

parsingTableStep = {
  "S": { "c": "B", "b": "C", "a": "C"},
  "A": { "a": "C", "c": "B", "b": ["b", "B"] },
  "B": { "a": ["a", "c", "A"], "c": ["a", "c", "A"], "b": [], "$": ["ε"] },
  "C": { "c": ["c", "b"], "b": ["b", "c", "S"] }
}

parsingTable = {
  "S": { "a": ["a", "A", "c"], "b": ["b", "C", "a"] },
  "A": { "a": ["a", "B", "a"], "b": ["b", "C", "b"], "c": ["c", "S", "b"] },
  "B": { "b": ["b", "A", "a"], "c": ["c", "S"] },
  "C": { "c": ["c", "S", "c"], "$": ["ε"], "a": ["ε"], "b": ["ε"] }
};

function getProduction(STATE, char) {
  return parsingTable[STATE][char].reverse().toString().replaceAll(",", "");
}

function isUpperCase(char) {
  return /^[A-Z]+$/.test(char)
}

function stackPop() {
  return stack.slice(0, stack.length - 1);
}

function genResultsTable() {
  return $("#results").append(`
                <table id="results-table">
                  <thead>
                      <tr>
                          <th>
                              #
                          </th>
                          <th>
                              Pilha
                          </th>
                          <th>
                              Entrada
                          </th>
                          <th>
                              Ação
                          </th>
                      </tr>
                  </thead>
                  <tbody id="table-body">
                      
                  </tbody>
                </table>`)
}

function getResultsTable() {
  return $("#results-table");
}

function resetResultsTable() {
  getResultsTable().empty();
  return genResultsTable();
}

function step() {
  /*$("#table-body").append(`<tr id="step=${step}">
                          </tr>`)*/
  
                          
  //$(`#step=${step}`).append(`<td class="table-terminal-head">`);
  
  if(parsingTable[STATE][input[0]] == undefined) {
    console.log("\n\n\n ERROR ME IS UNDEFINED LOL \n\n\n")
    return
  }

  if(input.length < 0 && stack.length < 0) return

  console.log(stack, input)
  let production;
  //TESTAR UPPERCASE
  if (stack && stack.length > 0 && isUpperCase(stack[stack.length - 1])) {
    STATE = stack[stack.length - 1];
    production = getProduction(STATE, input[0]);
    stack = stackPop()
    stack += production;
  }
  // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
  else if (stack && stack.length > 0 && stack[stack.length - 1] === input[0]) {
    // Le a produção
    stack = stackPop();
    input = input.slice(1);
  }
  else {
    console.log("\n\n\n ERRO EM SLA ITERAÇÕES \n\n\n");
    finished = true;
    return;
  }
  
}

function EXECUTE() {
  //$("#results").css("visibility", "visible");
  const table = resetResultsTable();

  let finished = false

  input = $("#insert-input").val().split('');
  if(input.length < 1) return;


  let STATE = "S";
  let stepAmmount = 0;
  let action = "";
  //PASSOS
  for(let i = 0; i < 10; i++) {
    

    if(input.length == 0 && stack.length == 0) {
      console.log("ACEITO EM 12 BILHOES DE ITERASAO");
      return;
    }

    if(parsingTable[STATE][input[0]] == undefined) {
      console.log("\n\n\n ERROR ME IS UNDEFINED LOL \n\n\n")
      return
    }
    
    //console.log(stack, input)
    let production;
    //TESTAR UPPERCASE
    if (stack && stack.length > 0 && isUpperCase(stack[stack.length - 1])) {
      STATE = stack[stack.length - 1];
      action = `${STATE} -> ${parsingTable[STATE][input[0]]}`
      production = parsingTable[STATE][input[0]].reverse().toString().replaceAll(",", "");
      stack = stackPop()
      if(production !== "ε") {
        stack += production;
      }
    }
    // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
    else if (stack && stack.length > 0 && stack[stack.length - 1] === input[0] && !isUpperCase(stack[stack.length - 1])) {
      // Le a produção
      action = `Ler ${input[0]}`
      stack = stackPop()
      input = input.slice(1);
    }
    else {
      console.log(`\n\n\n ERRO EM SLA ITERAÇÕES \n\n\n ${input.length}, ${stack.length}`);
      finished = true;
      return;
    }

    console.log(`PILHA = ${stack}, ENTRADA = ${input}, AÇÃO = ${action}`)	


    

    /*if(isUpperCase(stack[stack.length - 1])) {
      production = parsingTable[STEP][input[0]].reverse().toString().replaceAll(",", "")
      stack.slice(0, stack.length-1);
      stack += production
    }
    // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
    else if(stack[stack.length - 1] == input[0]) {
      stack = stack.slice(0, stack.length-1);
      input = input.slice(1);
    }
    else {
      console.log("\n\n\n ERROR TEM LETRA ERRADA AI NO TOPO \n\n\n")
      finished = true;
      return
    }*/ 
    
    

   // console.log(production)

    //finished = true
    stepAmmount++;  
    //return;
    finished = true

  }

}

function GENERATE() {
  resetResultsTable();

  console.log("NOT IMPLEMENTED")
}

function GENERATE_STEP() {
  const table = resetResultsTable();
  console.log(parsingTable["S"]["a"]);
    console.log("NOT IMPLEMENTED")
} 



//MAIN
$(function(){

  //input = $("#insert-input").val();
  
  $('#execute-button').click(function() {
    EXECUTE();
  })

  $('#generate-button').click(function() {
    GENERATE();
  })

  $('#execute-step-button').click(function() {
    GENERATE_STEP();
  })
})