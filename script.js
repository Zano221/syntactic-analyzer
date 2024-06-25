/////////////////////////////USE A VARIAVEL ABBC PARA TESTAR O PROGRAMA/////////////////////////////


var resultsTableGenerated = false;
var ResultsTable = null;
var stack = "S";
var input = null;

var STATE = "S";
var stepAmmount = 0;
var hadError = false;
var success = false;
var finished = false;

var finalstep = stepAmmount;

function resetGlobalValues() {
  resultsTableGenerated = false;
  ResultsTable = null;
  STATE = "S";
  stepAmmount = 0;
  hadError = false;
  finished = false;
  success = false;
  input = null;
  stack = "S";
  finalstep = stepAmmount;
}

parsingTable = {
  "S": { "a": ["a", "A", "c"], "b": ["b", "C", "a"] },
  "A": { "a": ["a", "B", "a"], "b": ["b", "C", "b"], "c": ["c", "S", "b"] },
  "B": { "b": ["b", "A", "a"], "c": ["c", "S"] },
  "C": { "c": ["c", "S", "c"], "$": ["ε"], "a": ["ε"], "b": ["ε"] }
};

/*parsingTable = {
  "S": { "a": ["a", "A", "c"], "b": ["b", "C", "a"] },
  "A": { "a": ["a", "B", "a"], "c": ["c", "S", "b"] },
  "B": { "a": ["ε"], "b": ["b", "A", "a"], "c": ["c", "S"], "$": ["ε"] },
  "C": { "b": ["b", "C", "b"], "c": ["c", "S", "c"] }
};*/

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

  table.remove();
  table = genResultsTable();
  return table;
}

function resetEverything() {
  resetGlobalValues();
  getResultsTable().remove();
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

  $("#restart-button").css("visibility", "visible");

  if(success) {
    console.log("ACEITO EM 12 BILHOES DE ITERASAO");	
    $(`#action-step-${stepAmmount}`).css("color", "green");
  }

  if(hadError) {
    console.log("ERRO EM 10 BILHAO DE ITERASAO");	
    $(`#action-step-${stepAmmount}`).css("color", "red");
  }
}

function step() {

  if(input == null) {
   input = $("#insert-input").val().split('');
  }

  //const table = resetResultsTable();

    let previoustack = stack;
    let previousinput = input;

    //if(!(stack && stack.length > 0) || parsingTable[STATE][input[0]] == undefined) hadError  = true;
    if(input.length == 0 && stack.length == 0) {
      console.log(`ACEITO EM ${stepAmmount} ITERAÇÕES ${input.length}, ${stack.length}`);
      success = true;
      hadError = false;
    }


    stepAmmount++;  

    let production;

    if (!success && !hadError) {
      
      //TESTAR UPPERCASE
      if (isUpperCase(stack[stack.length - 1])) {
        STATE = stack.at(stack.length - 1);
        
        if(parsingTable[STATE][input[0]] == undefined) {
          hadError = true;  
        }
        else {
          action = `${STATE} -> ${parsingTable[STATE][input[0]]}`
          production = getProduction(STATE, input[0]);
          stack = stackPop()
          if(production !== "ε") {
            stack += production;
          }
          instantiateResultsTableRow(previoustack, previousinput, action); 
        }
      }
      // se n for uppercase, testar se o topo da pilha e o primeiro da entrada
      else if (stack[stack.length - 1] === input[0]) {
        // Le a produção
        action = `Ler ${input[0]}`
        stack = stackPop()
        input = input.slice(1);
        instantiateResultsTableRow(previoustack, previousinput, action); 
      }
      else {
        console.log(`\n\n\n ERRO EM ${stepAmmount} ITERAÇÕES \n\n\n ${input.length}, ${stack.length}`);
        hadError  = true;
      }
      console.log("AAA")
    }

    if(success && !finished) { 
      finished = true;
      action = `Aceito em ${stepAmmount} iterações`;
      instantiateResultsTableRow(previoustack, previousinput, action);  
    } 
  
    if(hadError && !finished)  {
      finished = true;
      action = `ERRO EM ${stepAmmount}`;
      instantiateResultsTableRow(previoustack, previousinput, action);  
    }
     
    finalstep = stepAmmount;
}

function generateSentence() {
  let stack = ["S"];
  let result = "";
  let done = false;

  let top = stack.pop();

  result = getRandomProduction(top);


  while(!done) {
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
      }
    }
  }

  return result;
}



function EXECUTE() {

  //resetGlobalValues();
  resetEverything();

  input = $("#insert-input").val().split('');
  if(input.length < 1) return;

  //PASSOS
  while(!finished) {
    step();
  }
}

function GENERATE() {
  resetGlobalValues();

  $("#insert-input").val(generateSentence());

}

function GENERATE_STEP() {
  const table = resetResultsTable();
  step();
} 



//MAIN
$(function(){
  
  resetGlobalValues();


  console.log(Object.keys(parsingTable["S"]));

  $("#insert-input").keydown(function () { 
    resetGlobalValues();
  });
  
  $('#execute-button').click(function() {
    EXECUTE();
  })

  $('#generate-button').click(function() {
    GENERATE();
  })

  $('#execute-step-button').click(function() {
    GENERATE_STEP();
  })

  $("#restart-button").click(function() {
    resetEverything();
    $("#restart-button").css("visibility", "hidden");
  })

  $("#restart-button").css("visibility", "hidden");
})
