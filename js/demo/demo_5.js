$(function(){

    //Initialize plug-in
    $('#tableCloneable').cloneable();

    //Get JSON file
    $.getJSON('json/data.json', function(data) {
	//Clone and add data
	$('#tableCloneable').cloneable('addClone', {data : data});
    })

    //Add button event click for 'Edit'
    //NOTE: Use 'live' for attach all elements, now and in the future
    $('.buttonEdit').live('click', function(e){
	e.preventDefault();
	//Get index
	var index = $(this).closest('tr').index();
	//Get data
	var data = $('#tableCloneable').cloneable('getData', index);
	//Set values in components to edit
	$('#windowEdit').find('input[name="index"]').val(index)
	$('#windowEdit').find('input[name="full_name"]').val(data.full_name)
	$('#windowEdit').find('select[name="country"]').val(data.country)
	$('#windowEdit').find('textarea[name="education"]').val(data.education);
	//Show window
	$('#windowEdit').modal('show');
    });

    //Add button event click for 'Save'
    $('#buttonSave').live('click', function(e){
	e.preventDefault();
	//Hide window
	$('#windowEdit').modal('hide');
	//Get data values and index
	var index = parseInt( $('#windowEdit').find('input[name="index"]').val() );
	var data = {
	    full_name : $('#windowEdit').find('input[name="full_name"]').val(),
	    country : $('#windowEdit').find('select[name="country"]').val(),
	    education : $('#windowEdit').find('textarea[name="education"]').val()
	}
	//Set new data values
	$('#tableCloneable').cloneable('setData', { index: index, data: data });
    });

});