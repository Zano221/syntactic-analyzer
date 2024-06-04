function ResetTable() {
  const table = $('#table-body')
  table.empty();
  table.append(`<tr id="sex"></tr>`)
  return table;
}

function EXECUTE() {
  $("#results").css("visibility", "visible");
  const table = ResetTable();



  console.log("NOT IMPLEMENTED")
}

function GENERATE() {
    console.log("NOT IMPLEMENTED")
}

function GENERATE_STEP() {
    console.log("NOT IMPLEMENTED")
} 


$(function(){
  
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