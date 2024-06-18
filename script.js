/////////////////////////////USE A VARIAVEL ABBC PARA TESTAR O PROGRAMA/////////////////////////////


var resultsTableGenerated = false;
var ResultsTable = null;
var stack = "S";
var input = null;

var STATE = "S";
var stepAmmount = 0;
var hadError = false;
var finished = false;

var finalstep = stepAmmount;

function resetGlobalValues() {
  resultsTableGenerated = false;
  ResultsTable = null;
  STATE = "S";
  stepAmmount = 0;
  hadError = false;
  finished = false;
  input = null;
  stack = "S";
  finalstep = stepAmmount;
}

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
  resultsTableGenerated = true;
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
  let table = getResultsTable();
  if(!resultsTableGenerated) {
    table.empty();
    table = genResultsTable();
  }
  return table;
}

function genResultsTableRow(stack, input, action) {
  return `<tr>
            <td>${stepAmmount}</td>
            <td>$${stack}</td>
            <td>${input}$</td>
            <td id="action-step-${stepAmmount}">${action}</td>
          </tr>`.replace(/,/g, '');
}

function instantiateResultsTableRow(stack, input, action) {
  ResultsTable = getResultsTable();
  let instance = genResultsTableRow(stack, input, action);
  ResultsTable.append(instance);

  if(finished) {
    console.log("ACEITO EM 12 BILHOES DE ITERASAO");	
    $(`#action-step-${stepAmmount}`).css("color", "green");
  }

  if(hadError) {
    console.log("ACEITO EM 12 BILHOES DE ITERASAO");	
    $(`#action-step-${stepAmmount}`).css("color", "red");
  }
}

function step() {
  const table = resetResultsTable();
  
  if(finished || hadError) return;

  stepAmmount++;  

    let previoustack = stack;
    let previousinput = input;

    if(!(stack && stack.length > 0) || parsingTable[STATE][input[0]] == undefined) hadError  = true;
    if(input.length == 0 && stack.length == 0) {
      console.log("ACEITO EM 12 BILHOES DE ITERASAO");
      finished = true;
      hadError = false;
    }

    let production;

    if (!finished && !hadError) {
      
      //TESTAR UPPERCASE
      if (isUpperCase(stack[stack.length - 1])) {
        STATE = stack.at(stack.length - 1);
  
        action = `${STATE} -> ${parsingTable[STATE][input[0]]}`
  
        production = getProduction(STATE, input[0]);
        stack = stackPop()
        if(production !== "ε") {
          stack += production;
        }
      }
      // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
      else if (stack[stack.length - 1] === input[0]) {
        // Le a produção
        action = `Ler ${input[0]}`
        stack = stackPop()
        input = input.slice(1);
      }
      else {
        console.log(`\n\n\n ERRO EM SLA ITERAÇÕES \n\n\n ${input.length}, ${stack.length}`);
        hadError  = true;
      }
    }

    if(finished) action = `Aceito em ${stepAmmount} iterações`;
    if(hadError) action = `ERRO EM ${stepAmmount}`;
    
    finalstep = stepAmmount;
    instantiateResultsTableRow(previoustack, previousinput, action);
  
}

function EXECUTE() {

  resetGlobalValues();
  const table = resetResultsTable();

  input = $("#insert-input").val().split('');
  if(input.length < 1) return;


  let STATE = "S";
  let action = "";
  //PASSOS
  while(!finished && !hadError) {
    
    stepAmmount++;  

    let previoustack = stack;
    let previousinput = input;

    if(!(stack && stack.length > 0) || parsingTable[STATE][input[0]] == undefined) hadError  = true;
    if(input.length == 0 && stack.length == 0) {
      console.log("ACEITO EM 12 BILHOES DE ITERASAO");
      finished = true;
      hadError = false;
    }

    let production;

    if (!finished && !hadError) {
      
      //TESTAR UPPERCASE
      if (isUpperCase(stack[stack.length - 1])) {
        STATE = stack.at(stack.length - 1);
  
        action = `${STATE} -> ${parsingTable[STATE][input[0]]}`
  
        production = getProduction(STATE, input[0]);
        stack = stackPop()
        if(production !== "ε") {
          stack += production;
        }
      }
      // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
      else if (stack[stack.length - 1] === input[0]) {
        // Le a produção
        action = `Ler ${input[0]}`
        stack = stackPop()
        input = input.slice(1);
      }
      else {
        console.log(`\n\n\n ERRO EM SLA ITERAÇÕES \n\n\n ${input.length}, ${stack.length}`);
        hadError  = true;
      }
    }

    if(finished) action = `Aceito em ${stepAmmount} iterações`;
    if(hadError) action = `ERRO EM ${stepAmmount}`;
     

    instantiateResultsTableRow(previoustack, previousinput, action);
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
  
  resetGlobalValues();
  
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