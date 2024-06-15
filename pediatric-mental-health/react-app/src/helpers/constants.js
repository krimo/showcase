import { ReactComponent as CheckinIcon } from '../assets/icons/smiley-face.svg';
import { ReactComponent as ReviewIcon } from '../assets/icons/review-section.svg';
import { ReactComponent as ReadIcon } from '../assets/icons/read-section.svg';
import { ReactComponent as RememberIcon } from '../assets/icons/remember-badge.svg';
import { ReactComponent as PlayIcon } from '../assets/icons/play-character.svg';

export const getIconBySectionSlug = (sectionSlug) => {
	switch (sectionSlug) {
		case 'read':
			return <ReadIcon />;
		case 'play':
			return <PlayIcon />;
		case 'review':
			return <ReviewIcon />;
		case 'remember':
			return <RememberIcon />;
		default:
			return <CheckinIcon />;
	}
};

export const lessonSectionsData = [
	{
		name: 'Check-in',
		slug: 'checkin',
	},
	{
		name: 'Read',
		slug: 'read',
	},
	{
		name: 'Play',
		slug: 'play',
	},
	{
		name: 'Review',
		slug: 'review',
	},
	{
		name: 'Remember',
		slug: 'remember',
	},
];

export const getCurtainContentBySectionSlug = (sectionSlug) => {
	switch (sectionSlug) {
		case 'play':
			return {
				title: 'Nice job!',
				blurb: "Next, let's DO something to get our bodies moving and put what we just learned into practice.",
			};

		case 'reflect':
			return {
				title: 'Alright!',
				blurb: "You've learned so much. Let's take a moment to reflect on it all.",
			};

		case 'review':
			return {
				title: 'Alright!',
				blurb: "You've learned so much. Let's take a moment to reflect on it all.",
			};

		case 'remember':
			return {
				title: "You're doing awesome!",
				blurb: "Let's take all this great work and keep it going during your week.",
			};

		case undefined:
			return {
				title: 'Well done!',
				blurb: "We know this work isn't always easy, but you've done such a great job!",
			};

		default:
			return {
				title: 'Nice job!',
				blurb: "Next, let's DO something to get our bodies moving and put what we just learned into practice.",
			};
	}
};

export const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const formatBytes = (bytes, decimals = 2) => {
	if (!+bytes) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatTimestamp = (timestampFromWordpress) => {
	if (!timestampFromWordpress) return null;

	if (!timestampFromWordpress.includes(':')) return +timestampFromWordpress;

	const timestampArray = timestampFromWordpress.split(':').map((n) => +n);

	return timestampArray[0] * 60 + timestampArray[1];
};

export const tsParticlesConfettiOptions = {
	fpsLimit: 60,
	interactivity: {
		events: {
			onClick: {
				enable: true,
				mode: 'emitter',
			},
		},
	},
	emitters: {
		startCount: 1,
		direction: 'none',
		spawnColor: {
			value: '#ff0000',
			animation: {
				h: {
					enable: true,
					offset: {
						min: -1.4,
						max: 1.4,
					},
					speed: 0.1,
					sync: false,
				},
				l: {
					enable: true,
					offset: {
						min: 20,
						max: 80,
					},
					speed: 0,
					sync: false,
				},
			},
		},
		life: {
			count: 2,
			duration: 0.1,
			delay: 1,
		},
		rate: {
			delay: 0.1,
			quantity: 100,
		},
		size: {
			width: 0,
			height: 0,
		},
	},
	particles: {
		number: {
			value: 0,
		},
		color: {
			value: '#f00',
		},
		shape: {
			type: ['circle', 'square', 'polygon'],
			options: {
				polygon: {
					sides: 6,
				},
			},
		},
		opacity: {
			value: { min: 0, max: 1 },
			animation: {
				enable: true,
				speed: 1,
				startValue: 'max',
				destroy: 'min',
			},
		},
		size: {
			value: { min: 3, max: 7 },
		},
		life: {
			duration: {
				sync: true,
				value: 7,
			},
			count: 1,
		},
		move: {
			enable: true,
			gravity: {
				enable: true,
			},
			drift: {
				min: -2,
				max: 2,
			},
			speed: { min: 10, max: 30 },
			decay: 0.1,
			direction: 'none',
			random: false,
			straight: false,
			outModes: {
				default: 'destroy',
				top: 'none',
			},
		},
		rotate: {
			value: {
				min: 0,
				max: 360,
			},
			direction: 'random',
			move: true,
			animation: {
				enable: true,
				speed: 60,
			},
		},
		tilt: {
			direction: 'random',
			enable: true,
			move: true,
			value: {
				min: 0,
				max: 360,
			},
			animation: {
				enable: true,
				speed: 60,
			},
		},
		roll: {
			darken: {
				enable: true,
				value: 25,
			},
			enable: true,
			speed: {
				min: 15,
				max: 25,
			},
		},
		wobble: {
			distance: 30,
			enable: true,
			move: true,
			speed: {
				min: -15,
				max: 15,
			},
		},
	},
	detectRetina: true,
};

export const getClosestParagraphIndexToCenter = (rootEl, currentParagraphIndex) => {
	let closestIndex = currentParagraphIndex;
	let closestDistance = Infinity;

	Array.from(rootEl.children).forEach((el, idx) => {
		const topAbsDistanceToMidScreen = Math.abs(rootEl.scrollTop - (el.offsetTop - window.innerHeight / 2));

		if (topAbsDistanceToMidScreen < closestDistance) {
			closestDistance = topAbsDistanceToMidScreen;
			closestIndex = idx;
		}
	});

	return closestIndex;
};
