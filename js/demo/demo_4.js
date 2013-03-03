$(function(){

    //Initialize plug-in
    $('#tableCloneable').cloneable({
	events: {
	    //Add event when the clone is added
	    onCloneAdded: function(e){
		$('#selectIndex').append('<option value="' + e.length +'">' + e.length + '</option>');
	    },
	    //Add event when the clone is removed
	    onCloneRemoved: function(e){
		$('#selectIndex').children().last().remove();
	    }
	}
    });

    var persons = null
    //Get JSON file
    $.getJSON('json/data.json', function(data) {
	//Save data in array
	persons = data;
	$.each(data, function(i,person){
	    $('#selectPerson').append('<option value="' + i + '">' + person.full_name + '</option>');
	});
    })

    //Add button event click for "Add"
    $('#buttonAdd').bind('click', function(e){

	var index = $('#selectIndex option:selected').val();
	var person = $('#selectPerson option:selected').val();
	//Add clone in a specific index
	$('#tableCloneable').cloneable('addClone', { index: index, data: persons[person] });

    });

    //Add button event click for 'Delete'
    //NOTE: Use 'live' for attach all elements, now and in the future
    $('.buttonDelete').live('click', function(e){
	e.preventDefault();
	var index = $(this).closest('tr').index();
	//Delete a specific clone
	$('#tableCloneable').cloneable('removeClone', index);
    });

});