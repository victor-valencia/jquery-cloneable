//==============================================================================
//
//  Git:	    https://github.com/victor-valencia/jquery-cloneable
//
//  File:	    jquery-cloneable.js
//
//  Version:	    1.0
//
//  Autor:	    Victor Valencia Rico - valencia_vik@hotmail.com
//		    https://github.com/victor-valencia
//
//  Date:	    Febrary 2013
//
//==============================================================================


( function( $ ) {


    //==========================================================================
    //
    //  Prototypes
    //
    //==========================================================================

    /**
    * Verifica si el valor se encuentra dentro del rango de los limites inferior
    * y superior.
    * @param {Number} lower Limite inferior.
    * @param {Number} top Limite superior.
    * @return {Boolean} Retorna verdadero si se cumple la condicion.
    */
    Number.prototype.isBetween = function( lower, top ) {

	return ( top >= this && this >= lower );

    }


    //==========================================================================
    //
    //  JQuery Extensions
    //
    //==========================================================================

    /**
    * Obtiene un valor entero de un objeto, si el objeto no tiene valor
    * numerico, se toma como valor numerico el segundo parametro.
    * @param {Object} val Valor numerico.
    * @param {Object} def Valor default.
    * @return {Number} Retorna el valor numerico.
    */
    $.getInteger = function( val, def ) {

	return $.isNumeric( val ) ? parseInt( val, 10 ) : ( $.isNumeric( def ) ? parseInt( def, 10 ) : 0 );

    }

    /**
    * Inserta un nuevo elemento dentro del objeto seleccionado en el indice
    * especificado.
    * @param {Number} index Indice del nuevo elemento.
    * @param {jQuery} element Elemento a insertar.
    * @return {jQuery} Retorna el valor del objeto seleccionado.
    */
    $.fn.insertAt = function( index, element ) {

	return this.each( function() {

	    var lastIndex = $( this ).children().size();
	    if( index.isBetween( 0, lastIndex - 1 ) ) {
		$(this).children().eq( index ).before( element );
	    }
	    else{
		$.error( 'Index out of range. Index => ' + index + ', Length => ' + lastIndex );
	    }

	});

    }


    //==========================================================================
    //
    //  JQuery Cloneable Plug-in
    //
    //==========================================================================

    /**
    * Logica de inicializacion y llamadas a metodos internos del plug-in.
    * @param {String} method Nombre del metodo a llamar.
    */
    $.fn.cloneable = function( method ) {

        if( $.fn.cloneable.methods[ method ] ) {
            return $.fn.cloneable.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
        else if( typeof method === 'object' || ! method ) {
            return $.fn.cloneable.methods.init.apply( this, arguments );
        }
        else {
            $.error( 'The method "' +  method + '" is not in the plug-in jquery.cloneable' );
        }

    };


    //==========================================================================
    //
    //  JQuery Cloneable Methods
    //
    //==========================================================================


    $.fn.cloneable.methods = {


        /**
        * Inicializa el componente.
	* @param {Object} options Configuracion de las opciones y eventos de
	* inicializacion.
        */
        init : function( options ) {

            return this.each( function() {

		var target = $( this );

		//Default options object
		var defaults = {
		    fadeEffect: true,
		    events: {
			onCloneAdded: function( e ) {  },
			onCloneRemoved: function( e ) {  }
		    }
		};

		// HTML5 options data parse whith "data-" in html attributes
		var settings = $.extend( { }, defaults, target.data() );

		// Javascritp options data parse by "param"
		settings = $.extend( { }, settings, defaults, options );
		settings.events = $.extend( { }, defaults.events, settings.events );

		var root = null;
		var models = [];

		//Process the models and root container
		$.each( target.find('.model'), function( i, model ) {
		    if( i == 0 ) {
			root = $( model ).parent();
		    }
		    models.push( $( model ).clone() );
		});

		//Validate
		if( models.length ) {
		    //Assign private variables
		    target.removeData();
		    target.data( "options", settings );

		    root.empty();
		    target.data( '_root', root );
		    target.data( '_models', models );
		    target.data( '_elements', [] );
		}
		else {
		    $.error( 'There are no models in element' );
		}

		//console.log(target.data());

            });

        },


	/**
        * Realiza una copia del modelo.
	* @param {Object} options Configuracion de las opciones de la copia.
        */
        addClone : function( options ) {

            return this.each( function() {

		var target = $( this );

		//Default options object
		var defaults = {
		    data: {},
		    index: -1, //Indicates the last position
		    model: null
		}

		var settings = $.extend( { }, defaults, options );
		var data = settings.data;
		var index = $.getInteger( settings.index, 0 );
		var model = settings.model;
		var length = target.data( '_elements' ).length;

		//Validate index
		if( index.isBetween( -1, length ) ) {

		    if( $.isArray( data ) ) {
			//If data is an Array
			$.each( data, function( i, obj ) {
			    //Call recursive
			    target.cloneable( 'addClone', {
				data: obj,
				index: index,
				model: model
			    });
			});
		    }
		    else {

			//Data is an Object

			//Get model
			var node = target.cloneable( 'getModel', model );

			if( node != null ) {

			    var _options = target.data( 'options' );

			    if( _options.fadeEffect == true ) {
				node.hide();
			    }

			    var root = target.data( '_root' );
			    if( index == -1 || index == length) {
				//Insert at the end
				$( root ).append( node );
			    }
			    else {
				//Insert at the specified index
				$( root ).insertAt( index, node );
			    }

			    if( _options.fadeEffect == true ) {
				node.fadeIn();
			    }

			    target.data( '_elements' ).splice( node.index(), 0, node );

			    //Set data
			    target.cloneable( 'setData', {
				index: node.index(),
				data: data
			    });

			    //Dispatch event: onCloneAdded.
			    _options.events.onCloneAdded.apply(
				target,
				[{
				    index: node.index(),
				    node: node,
				    data: data,
				    length: target.data( '_elements' ).length
				}]
			    );

			}
			else {
			    $.error( 'There are no models in element' );
			}

		    }

		}
		else {
		    $.error( 'Index out of range. Index => ' + index + ', Length => ' + length );
		}

            });

        },


	/**
        * Obtiene un modelo especifico, si no se especifica retorna el primero.
	* @param {String} name Nombre del modelo.
	* @return {jQuery} Retorna el modelo, si no tiene retorna null.
        */
        getModel : function( name ) {

	    var target = $(this);

	    var models = target.data( '_models' );

	    var m = null;

	    if( models.length ) {

		if( name == undefined ) {
		    m = models[ 0 ].clone();
		}
		else {
		    $.each( models, function( i, model ) {
			if( $( model ).data( 'modelName' ) == name ) {
			    m = models[ i ].clone();
			}
		    });
		}

	    }

	    return m;

	},


	/**
        * Obtiene los datos de un elemento clonado.
	* @param {Number} index Indice del elemento.
	* @return {Object} Retorna los datos del elemento.
        */
        getData : function( index ) {

	    var target = $(this);

	    var elements = target.data( '_elements' );
	    var length = elements.length;
	    var data = null;

	    //Validate index
	    if( index.isBetween( 0, length - 1 ) ) {
		data = elements[index].data( '_data' );
	    }
	    else {
		$.error( 'Index out of range. Index => ' + index + ', Length => ' + length );
	    }

	    return data;

	},


	/**
        * Agrega los datos a un objeto.
	* @param {Object} options Configuracion de las opciones.
        */
        setData : function( options ) {

	    return this.each( function(){

		var target = $(this);

		var defaults = {
		    index: 0,
		    data: {}
		}

		var settings = $.extend( { }, defaults, options );
		var data = settings.data;
		var index = $.getInteger( settings.index, 0 );
		var elements = target.data( '_elements' );
		var length = elements.length;

		//Validate index
		if( index.isBetween( 0, length - 1 ) ) {

		    var node = elements[ index ];

		    // Add new data
		    node.data( '_data', data );

		    $.each( data, function( key, value ) {

			var element = $( node ).find( '[name*="' + key + '[]"]' );

			if( element.length ) {
			    switch( element[ 0 ].nodeName ) {
				case 'INPUT': element.attr( 'value', value ); break;
				case 'TEXTAREA': element.attr( 'value', value ); break;
				case 'SELECT': element.attr( 'value', value ); break;
				case 'IMG': element.attr( 'src', value ); break;
				default: element.attr( 'value', value ).html( value ); break;
			    };
			}

		    });

		}
		else {
		    $.error( 'Index out of range. Index => ' + index + ', Length => ' + length );
		}

	    });

	},


	/**
        * Cambia el modelo de un elemento, especificando el indice.
	* @param {Object} options Indice del elemento.
	*/
        changeModel : function( options ) {

	    return this.each( function() {

		var target = $( this );

		var defaults = {
		    data: {},
		    index: 0,
		    model: null
		}

		var settings = $.extend( { }, defaults, options );
		var data = settings.data;
		var index = $.getInteger( settings.index, 0 );
		var model = settings.model;
		var elements = target.data( '_elements' );
		var length = elements.length;

		if( index.isBetween( 0, length - 1 ) ) {

		    var node = target.cloneable( 'getModel', model );

		    if( node != null ) {

			var element = elements[ index ];

			element.replaceWith( node );

			target.data( '_elements' )[ index ] = node;

			target.cloneable( 'setData', {
			    index: index,
			    data: data
			});

		    }
		    else {
			$.error( 'There are no models in element' );
		    }

		}
		else {
		    $.error( 'Index out of range. Index => ' + index + ', Length => ' + length );
		}

	    });

	},


	/**
        * Elimina un elemento clonado, especificando el indice.
	* @param {Number} index Indice del elemento.
	*/
        removeClone : function( index ) {

            return this.each( function() {

                var target = $(this);

		var elements = target.data( '_elements' );
		var length = elements.length;

		if( index.isBetween( 0, length - 1 ) ) {

		    var deleted = elements.splice( index, 1 );
		    var node = $( deleted[ 0 ] );
		    var _options = target.data( 'options' );

		    //Dispatch event: onCloneRemoved.
		    _options.events.onCloneRemoved.apply(
			target,
			[{
			    index: index,
			    node: node,
                            length: elements.length
			}]
		    );

		    //Delete element
		    if( _options.fadeEffect == true ) {
			node.fadeOut( function() {
			    node.remove();
			});
		    }
		    else {
			node.remove();
		    }

		    target.data('_elements', elements);

		}
		else {
		    $.error( 'Index out of range. Index => ' + index + ', Length => ' + length );
		}

            });

        },


	/**
        * Elimina todos los elementos clonados.
        */
        removeAllClone : function() {

            return this.each( function() {

		var target = $( this );

		var length = target.data( '_elements' ).length;

		for( var i = length - 1; i >= 0 ; i-- ) {
		    target.cloneable( 'removeClone', i );
		}

            });

        }

    }


})(jQuery);