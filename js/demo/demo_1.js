$(function(){

    //Initialize plug-in
    $('#tableCloneable').cloneable();

    //Add 2 clones
    $('#tableCloneable').cloneable('addClone')
			.cloneable('addClone');

});