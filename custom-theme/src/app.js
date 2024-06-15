import * as GlobalModules from './global';
import * as PXBlocks from '../blocks/index';

import './crutch.scss';

const ModulesAndBlocks = { ...GlobalModules, ...PXBlocks };

document.addEventListener('DOMContentLoaded', () => {
	console.log('domcontentloaded event');

	for (const key in ModulesAndBlocks) {
		// Initialize modules/blocks on the frontend (i.e. when window.acf is undefined)
		if (Object.hasOwnProperty.call(ModulesAndBlocks, key) && !window.acf)
			ModulesAndBlocks[key].init();

		// Make sure blocks JS render properly in the editor (cf. https://www.advancedcustomfields.com/resources/acf_register_block_type/)
		if (window.acf && Object.hasOwnProperty.call(PXBlocks, key))
			window.acf.addAction(
				`render_block_preview/type=${PXBlocks[key].name}`,
				PXBlocks[key].init
			);
	}
});
