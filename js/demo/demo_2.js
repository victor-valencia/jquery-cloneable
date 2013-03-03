$(function(){

    //Initialize plug-in
    $('#tableCloneable').cloneable();

    //Initialize objects
    var carlos_slim_data = {
	full_name: 'Carlos Slim',
	country: 'México',
	education: 'Bachelor of Arts / Science, Universidad Nacional Autonoma de Mexico',
	photo: 'images/carlos-slim-helu_42x42.jpg'
    }

    var bill_gates_data = {
	full_name: 'Bill Gates',
	country: 'United States',
	education: 'Drop Out, Harvard University',
	photo: 'images/bill-gates_42x42.jpg'
    }

    //Add clones with data
    $('#tableCloneable').cloneable('addClone', { data: carlos_slim_data });
    $('#tableCloneable').cloneable('addClone', { data: bill_gates_data })

});