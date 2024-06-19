var twigTemplateIDs = [];

// custom twig.js functions
Twig.extendFunction('include', function(templateID, data) {

	console.log('template dir', php_vars.template_directory+templateID);

	var html;

	// if template doesn't exist yet
	if( twigTemplateIDs.indexOf(templateID) < 0 ){
		twigTemplateIDs.push(templateID);

		Twig.twig({
			id : templateID,
			href: php_vars.template_directory+templateID,
			async: false,
			load: function(template) {
				console.log('template loaded');
				html = template.render(data);
			}
		});

		return html;
	}

	// if template exists
	else {
		html = Twig.twig({
			ref: templateID
		}).render(data);

		return html;
	}

});



Twig.extendFunction('source', function(filepath) {

	var url = php_vars.template_directory+'/modules/'+filepath;
	var fileContents;

	// adjust path if @images namespace is used
	if( filepath.indexOf('@images') > -1 ){
		url = php_vars.template_directory+'/assets/images/'+filepath.replace('@images', '');
	}

	$.ajax({
    url : url,
    type : "get",
    async: false,
    success : function(data) {

		fileContents = new XMLSerializer().serializeToString(data.documentElement);
		console.log('Loading asset');

    },
    error: function() {
		console.log('error retrieving asset from - ' + url);
    }
	});

	return fileContents;

});
