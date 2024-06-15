module.exports = (plop) => {
	plop.setHelper('uuid', function () {
		return 'id' + Math.random().toString(16).slice(2);
	});

	plop.setGenerator('block', {
		description: 'Create a reusable block',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your block name?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'blocks/{{dashCase name}}/{{dashCase name}}.js',
				templateFile: 'plop-templates/block/block.js.hbs',
			},
			{
				type: 'add',
				path: 'blocks/{{dashCase name}}/{{dashCase name}}.php',
				templateFile: 'plop-templates/block/block.php.hbs',
			},
			{
				type: 'add',
				path: 'blocks/index.js',
				templateFile: 'plop-templates/block/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'blocks/index.js',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { {{pascalCase name}} } from './{{dashCase name}}/{{dashCase name}}';`,
			},
			{
				type: 'add',
				path: 'constants/CustomBlocks.php',
				templateFile: 'plop-templates/injectable-CustomBlocks.php.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'constants/CustomBlocks.php',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				templateFile: 'plop-templates/template-customblock.php.hbs',
			},
		],
	});

	plop.setGenerator('global', {
		description: 'Create a global (automatically included) JS module',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your module name?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/global/{{pascalCase name}}.js',
				templateFile: 'plop-templates/global/module.js.hbs',
			},
			{
				type: 'add',
				path: 'src/global/index.js',
				templateFile: 'plop-templates/global/injectable-index.js.hbs',
				skipIfExists: true,
			},
			{
				type: 'append',
				path: 'src/global/index.js',
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { {{pascalCase name}} } from './{{pascalCase name}}';`,
			},
		],
	});
};
