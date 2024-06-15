// Gradient colors
//  '#B666B6', '#FB5D80' gus
//  '#6471B4', '#B666B6' ted
//  '#089C9C', '#6471B4' sid
//  '#25AA52', '#089C9C'
//  '#62A540', '#25AA52'
//  '#C18B01', '#62A540' hal
//  '#ED6E2E', '#C18B01'
//  '#FB5D80', '#ED6E2E' ani
//  '#62605C', '#97948D'

import ani from '../assets/character/ANI 1.svg';
import gus from '../assets/character/GUS 1.svg';
import hal from '../assets/character/HAL 1.svg';
import sid from '../assets/character/SID 1.svg';
import ted from '../assets/character/TED 2.svg';

const characterMap = [
	{
		name: 'Hal',
		description: 'HAL is a mellow friend and he feels content and at ease.',
		fullSizeImage: hal,
		portrait: '',
		baseColor: '#D4A600',
		gradientColors: ['#C18B01', '#62A540'],
	},
	{
		name: 'Sid',
		description: 'SID is a mellow friend and he feels content and at ease.',
		fullSizeImage: sid,
		portrait: '',
		baseColor: '#026572',
		gradientColors: ['#089C9C', '#6471B4'],
		riveFile: true,
	},
	{
		name: 'Ani',
		description: 'ANI is a mellow friend and he feels content and at ease.',
		fullSizeImage: ani,
		portrait: '',
		baseColor: '#FF7291',
		gradientColors: ['#FB5D80', '#ED6E2E'],
	},
	{
		name: 'Flo',
		description: 'FLO is a mellow friend and he feels content and at ease.',
		fullSizeImage: ted,
		portrait: '',
		baseColor: '#fff',
		gradientColors: ['#fff', '#000'],
	},
	{
		name: 'Gus',
		description: 'GUS is a mellow friend and he feels content and at ease.',
		fullSizeImage: gus,
		portrait: '',
		baseColor: '#B43E58',
		gradientColors: ['#B666B6', '#FB5D80'],
	},
	{
		name: 'Axe',
		description: 'ANI is a mellow friend and he feels content and at ease.',
		fullSizeImage: ted,
		portrait: '',
		baseColor: '#fff',
		gradientColors: ['#fff', '#000'],
	},
	{
		name: 'Ted',
		description: 'TED is a mellow friend and he feels content and at ease.',
		fullSizeImage: ted,
		portrait: '',
		baseColor: '#6C2D6C',
		gradientColors: ['#6471B4', '#B666B6'],
	},
	{
		name: 'Nom',
		description: 'NOM is a mellow friend and he feels content and at ease.',
		fullSizeImage: ted,
		portrait: '',
		baseColor: '#fff',
		gradientColors: ['#fff', '#000'],
	},
	{
		name: 'Hip',
		description: 'HIP is a mellow friend and he feels content and at ease.',
		fullSizeImage: ted,
		portrait: '',
		baseColor: '#fff',
		gradientColors: ['#fff', '#000'],
	},
];

export default characterMap;
