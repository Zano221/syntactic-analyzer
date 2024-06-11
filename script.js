
input = null;
HTMLTable = null;
table = {
  "S": "NOT IMPLEMENTED",
  "A": "NOT IMPLEMENTED",
  "B": "NOT IMPLEMENTED",
  "C": "NOT IMPLEMENTED",
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
  $("#table-body").append(`<tr id="step=${step}">
                          </tr>`)
  
                          
  $(`#step=${step}`).append(`<td class="table-terminal-head">`);
}

function EXECUTE() {
  //$("#results").css("visibility", "visible");
  const table = resetResultsTable();



  console.log("NOT IMPLEMENTED")
}

function GENERATE() {
  resetResultsTable();

  console.log("NOT IMPLEMENTED")
}

function GENERATE_STEP() {
  const table = resetResultsTable();
  
    console.log("NOT IMPLEMENTED")
} 



//MAIN
$(function(){

  input = $("#insert-input");
  
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