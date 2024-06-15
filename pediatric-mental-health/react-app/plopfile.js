module.exports = (plop) => {
	plop.setGenerator('component', {
		description: 'Create a reusable component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your component name?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.js',
				templateFile: 'plop-templates/Component/Component.js.hbs',
			},
			{
				type: 'add',
				path: 'src/components/index.js',
				templateFile: 'plop-templates/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'src/components/index.js',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { default as {{pascalCase name}} } from './{{pascalCase name}}/{{pascalCase name}}';`,
			},
		],
	});

	plop.setGenerator('view', {
		description: 'Create a new view',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: "What is your view's name?",
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/views/{{pascalCase name}}/{{pascalCase name}}.js',
				templateFile: 'plop-templates/View/View.js.hbs',
			},
			{
				type: 'add',
				path: 'src/views/index.js',
				templateFile: 'plop-templates/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'src/views/index.js',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { default as {{pascalCase name}} } from './{{pascalCase name}}/{{pascalCase name}}';`,
			},
		],
	});

	plop.setGenerator('viewChild', {
		description: 'Create a new view with children capabilities',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: "What is your view's name?",
			},
			{
				type: 'input',
				name: 'childName',
				message: "What is your view's child's name?",
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/views/{{pascalCase name}}/{{pascalCase name}}.js',
				templateFile: 'plop-templates/View/ViewChild.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'add',
				path: 'src/views/{{pascalCase name}}/{{pascalCase childName}}.js',
				templateFile: 'plop-templates/View/Child.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'add',
				path: 'src/views/{{pascalCase name}}/index.js',
				templateFile: 'plop-templates/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'src/views/{{pascalCase name}}/index.js',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { default as {{pascalCase childName}} } from './{{pascalCase childName}}';`,
			},
		],
	});
};
