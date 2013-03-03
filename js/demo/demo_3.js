$(function(){

    //Initialize plug-in
    $('#tableCloneable').cloneable();

    //Get JSON file
    $.getJSON('json/data.json', function(data) {
	//Clone and add data
	$('#tableCloneable').cloneable('addClone', {data : data});
    })

    //Add button event click for 'Delete'
    //NOTE: Use 'live' for attach all elements, now and in the future
    $('.buttonDelete').live('click', function(e){
	e.preventDefault();
	var index = $(this).closest('tr').index();
	//Delete a specific clone
	$('#tableCloneable').cloneable('removeClone', index);
    });

    //Add button event click for 'Delete All'
    $('#buttonDeleteAll').bind('click', function(e){
	e.preventDefault();
	//Delete all clones
	$('#tableCloneable').cloneable('removeAllClone');
    });

});