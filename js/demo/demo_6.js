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

    //Add button event click for 'Edit'
    //NOTE: Use 'live' for attach all elements, now and in the future
    $('.buttonEdit').live('click', function(e){
	e.preventDefault();
	//Constructs new data
	var target = $(this).closest('tr');
	var index = target.index();

	var data = {
	    photo : target.find('[name="photo[]"]').attr('src'),
	    full_name : target.find('[name="full_name[]"]').val(),
	    country : target.find('[name="country[]"]').val(),
	    education : target.find('[name="education[]"]').val()
	}

	//Change to EDIT model and add new data
	$('#tableCloneable').cloneable('changeModel', {
	    index: index,
	    model: 'EDIT',
	    data: data
	});
    });

    //Add button event click for 'Save'
    //NOTE: Use 'live' for attach all elements, now and in the future
    $('.buttonSave').live('click', function(e){
	e.preventDefault();
	//Constructs new data
	var target = $(this).closest('tr');
	var index = target.index();

	var data = {
	    photo : target.find('[name="photo[]"]').attr('src'),
	    full_name : target.find('[name="full_name[]"]').val(),
	    country : target.find('[name="country[]"]').val(),
	    education : target.find('[name="education[]"]').val()
	}

	//Change to READ model and add new data
	$('#tableCloneable').cloneable('changeModel', {
	    index: index,
	    model: 'READ',
	    data: data
	});
    });

});