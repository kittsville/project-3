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
 * @param Array sGrid OPTIONAL Array of arrays representing the grid. Denote empty fields with ''
 */
function generateGrid( sGrid ) {
	// Generates a blank grid if a valid grid wasn't given
	if ( typeof sGrid === 'undefined' || !(sGrid instanceof Array) ) {
		sGrid = [];
		
		for (i = 0; i < 9; i++) {
			row = [];
			
			for (j = 0; j < 9; j++) {
				row.push('');
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
					'id'			: j
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
		console.log(oldCursorPost, cursorPos);
		
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
	});
});