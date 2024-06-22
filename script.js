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

  let tableProduction = parsingTable[STATE][char];
  let production = [];

  for(const char in tableProduction) production.push(tableProduction[char]);

  return production.reverse().toString().replaceAll(",", "");
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomProduction(STATE) {
  let tableProduction = parsingTable[STATE][getRandomElement(Object.keys(parsingTable[STATE]))];
  let production = [];
  for(const char in tableProduction) production.push(tableProduction[char]);

  return production.toString().replaceAll(",", "");
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
  if(resultsTableGenerated) return table;

  console.log("ASDADD")
  table.empty();
  table = genResultsTable();
  
}

function resetEverything() {
  resetGlobalValues();
  return resetResultsTable();
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
    console.log("ERRO EM 10 BILHAO DE ITERASAO");	
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



function generateSentence() {
  let stack = ["S"];
  let result = "";
  let done = false;

  let top = stack.pop();

  result = getRandomProduction(top);


  for(let fuckyou = 0; fuckyou < 50 || !done; fuckyou++) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    for(let i = 0; i < result.length; i++) {

      let char = result[i];

      if(isUpperCase(char)) {
        
        let scentence = getRandomProduction(char);

        if(result.length > 10 && char == "C" || scentence == "ε") {
          result = result.replace(char, '');
          done = true; 
        } 
        else {
          result = result.replace(char, scentence)
        }

        //stack.splice(stack.length, 0, ...parsingTable[element][getRandomElement(Object.keys(parsingTable[element]))]);
        

    }
  }

  /*for(let i = 0; i < 50 || !done; i++)  {
    console.log(`START ${stack}`);
    let element = stack.pop();
    
    if(element == "ε") continue;

    if(element == element.toUpperCase()) {
      if(result.length >= 10 && element == "C") {
        stack.replace(element, '');
        console.log("OOOOO POTENCIA", stack);
        done = true;
      }
      else {
        stack.splice(stack.length, 0, ...parsingTable[element][getRandomElement(Object.keys(parsingTable[element]))]);
        continue;
      }
    }

    if(stack.length == 0) break;

    result.push(element);

    console.log(`AFTER ${stack}`);
    done = true;
  }*/

  console.log(result);

  
  
  }
}



function EXECUTE() {

  //resetGlobalValues();
  const table = resetEverything();

  input = $("#insert-input").val().split('');
  if(input.length < 1) return;


  let STATE = "S";
  let action = "";
  //PASSOS
  while(!finished && !hadError) {
    
    stepAmmount++;  

    let previoustack = stack;
    let previousinput = input;

    //if(!(stack && stack.length > 0) || parsingTable[STATE][input[0]] == undefined) hadError  = true;
    if(input.length == 0 && stack.length == 0) {
      console.log(`ACEITO EM 12 BILHOES DE ITERASAO ${input.length}, ${stack.length}`);
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

  generateSentence()

}

function GENERATE_STEP() {
  const table = resetResultsTable();
  console.log(parsingTable["S"]["a"]);
    console.log("NOT IMPLEMENTED")
} 



//MAIN
$(function(){
  
  resetGlobalValues();


  console.log(Object.keys(parsingTable["S"]));
  
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