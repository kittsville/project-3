/**
 * Adds function to jQuery input elements to get the current position of the cursor in the input element. Thanks to MarkB29 for the code: http://stackoverflow.com/a/2897510/3565450
 */
$.fn.getCursorPosition = function() {
	var input = this.get(0);
	if (!input) return; // No (input) element found
	if ('selectionStart' in input) {
		// Standard-compliant browsers
		return input.selectionStart;
	} else if (document.selection) {
		// IE
		input.focus();
		var sel = document.selection.createRange();
		var selLen = document.selection.createRange().text.length;
		sel.moveStart('character', -input.value.length);
		return sel.text.length - selLen;
	}
}

/**
 * Renders a Sudoku grid to the page. Grid is empty if no fields are passed to it
 * @param Array sGrid OPTIONAL Array of arrays representing the grid. Denote empty fields with 0 (will be rendered as '')
 */
function generateGrid( sGrid ) {
	// Generates a blank grid if a valid grid wasn't given
	if ( typeof sGrid === 'undefined' || !(sGrid instanceof Array) ) {
		sGrid = [];
		
		for (i = 0; i < 9; i++) {
			row = [];
			
			for (j = 0; j < 9; j++) {
				row.push(0);
			}
			
			sGrid.push(row);
		}
	}
	
	// Initialises HTML output
	sTable = []
	
	// Loops over each row, rendering a div to hold that row
	for (i = 1; i < 10; i++) {
		row = [];
		
		// Loops over each square of that row, rendering the input field
		for (j = 1; j < 10; j++) {
			row.push($('<td/>',{
				'class'	: 'cell',
				'html'	: $('<input/>',{
					'type'			: 'text',
					'maxlength'		: '1',
					'autocomplete'	: 'off',
					'id'			: j,
					'value'			: sGrid[i-1][j-1] === 0 ? '' : sGrid[i-1][j-1]
				})
			}));
		}
		
		sTable.push($('<tr/>',{
			'class'	: 'row',
			'html'	: row,
			'id'	: i
		}));
	}
	
	$('div#sudoku-grid').html($('<table/>',{
		'html'	: sTable
	}));
}

var cursorPos = 0;

$(function() {
	generateGrid();
	
	// Allows for keyboard navigation across the Sudoku grid
	$('div#sudoku-grid').on('keyup', 'input', function(e) {
		// Selects current input and its parent row
		input	= $(e.target);
		row		= input.parent().parent();
		
		// Gets ID of current input and parent row
		inputId	= e.target.id;
		rowId	= row.attr('id');
		
		oldCursorPost = cursorPos;
		cursorPos = input.getCursorPosition();
		
		// If keyboard input is an arrow key
		if ( $.inArray(e.which, [37,38,39,40]) != -1 ) {
			switch(e.which){
				// Left Arrow
				case 37:
					// If user is not at the end of the input text, does not skip to the next input
					if (cursorPos != oldCursorPost) {
						return;
					}
					
					// If current input is the further left, wrap around to furthest right
					if ( inputId == '1' ) {
						nextInputId = 9;
					} else {
						nextInputId = parseInt(inputId) - 1;
					}
					
					newInput = row.find('td input#'+nextInputId);
				break;
				
				// Up Arrow
				case 38:
					// If current input is the highest, wrap around to lowest
					if ( rowId == '1' ) {
						nextRowId = 9;
					} else {
						nextRowId = parseInt(rowId) - 1;
					}
					
					newInput = row.siblings('tr#'+nextRowId).find('td input#'+inputId);
				break;
				
				// Right Arrow
				case 39:
					// If user is not at the end of the input text, does not skip to the next input
					if (cursorPos != oldCursorPost) {
						return;
					}
					
					// If current input is the further left, wrap around to furthest right
					if ( inputId == '9' ) {
						nextInputId = 1;
					} else {
						nextInputId = parseInt(inputId) + 1;
					}
					
					newInput = row.find('td input#'+nextInputId);
				break;
				
				// Down Arrow
				case 40:
					// If current input is the lowest, wrap around to highest
					if ( rowId == '9' ) {
						nextRowId = 1;
					} else {
						nextRowId = parseInt(rowId) + 1;
					}
					
					newInput = row.siblings('tr#'+nextRowId).find('td input#'+inputId);
				break;
			}
			newInput.focus();
			
			// Updates cursor position after changes to selected input
			cursorPos = newInput.getCursorPosition();
		}
		
		return false;
	});
	
	// Creates sudoku puzzle based on chosen difficulty
	$('div#difficulty-buttons button').click(function(e){
		// Chooses puzzles based on difficulty level selected
		switch (e.target.id) {
			case 'easy':
				puzzles = easyPuzzles;
			break;
			
			case 'medium':
				puzzles = mediumPuzzles;
			break;
			
			case 'hard':
				puzzles = hardPuzzles;
			break;
			
			case 'custom':
				puzzles = [];
			break;
			
			default:
				alert('How did I get here?');
				return false;
		}
		
		// Randomly chooses a puzzle from selection given
		generateGrid(puzzles[Math.floor(Math.random() * puzzles.length)]);
	});
	
	// Parses Sudoku grid, sends to server then renders returned completed grid
	$('a#solve').click(function(){
		sGrid = [];
		
		// Iterates over rows, parsing user input
		$.each($('div#sudoku-grid tr'), function(i, row) {
			sRow = [];
			
			$.each($(row).find('input'), function(j, element) {
				eValue = parseInt(element.value)
				
				// If input is not a valid sudoku input (1-9 int), clear input field
				sRow.push(isNaN(eValue) || eValue > 9 || eValue < 1 ? 0 : eValue);
			});
			
			sGrid.push(sRow);
		});
		
		// Sends grid to server
		$.ajax({
			type		: 'POST',
			url			: '/solve',
			data		: { data: sGrid },
			contentType	: 'application/json',
			dataType	: 'json'
		}).success(function(data){
			// If request succeeds, renders grid using returned array
			if (data instanceof Array){
				generateGrid(data);
			} else {
				// If server could not find a solution, informs user
				alert('No solution found');
			}
		}).fail(function(data){
			console.log('AJAX request failed');
		});
		
		return false;
	});
});