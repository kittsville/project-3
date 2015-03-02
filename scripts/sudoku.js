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

$(function() {
	generateGrid();
});