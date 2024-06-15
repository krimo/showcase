import { useDispatch, useSelector } from 'react-redux';
import { setSoundEffectsLoading, setSoundEffectsLoaded } from '../app/uiSlice';
import StandardBtnPress from '../assets/sounds/Standard Button_PRESS_v03.mp3';
import StandardBtnRelease from '../assets/sounds/Standard Button_RELEASE_v03.mp3';
import StandardBtnHoverUp from '../assets/sounds/Standard Button_HOVER_Button Comes Up_v03_01.mp3';
import StandardBtnHoverDown from '../assets/sounds/Standard Button_HOVER_Button Goes Down_v03_01.mp3';
import CustomCursorPress from '../assets/sounds/Custom Cursor_Press_Select_v02.mp3';
import LGBtnContinue from '../assets/sounds/Large UI Button_CONTINUE_v03_01.mp3';
import LGBtnPause from '../assets/sounds/Large UI Button_PAUSE_v03_01.mp3';
import LGBtnPlay from '../assets/sounds/Large UI Button_PLAY_v03_01.mp3';
import DancePartyFile from '../assets/sounds/Bend Health Cues_Dance Party 03_loop Final.mp3';
import GlobalSoundtrack from '../assets/sounds/global-soundtrack.mp3';

const soundsManifest = [
	{ id: 'StandardBtnPress', src: StandardBtnPress },
	{ id: 'StandardBtnRelease', src: StandardBtnRelease },
	{ id: 'StandardBtnHoverUp', src: StandardBtnHoverUp },
	{ id: 'StandardBtnHoverDown', src: StandardBtnHoverDown },
	{ id: 'CustomCursorPress', src: CustomCursorPress },
	{ id: 'LGBtnContinue', src: LGBtnContinue },
	{ id: 'LGBtnPause', src: LGBtnPause },
	{ id: 'LGBtnPlay', src: LGBtnPlay },
	{ id: 'DancePartyFile', src: DancePartyFile },
	{ id: 'GlobalSoundtrack', src: GlobalSoundtrack },
];

export const useSoundEffects = () => {
	const createjs = window.createjs;
	const dispatch = useDispatch();
	const { globallyMuted, characterData, soundEffectsLoading, soundEffectsLoaded } = useSelector((state) => state.ui);

	const playSoundEffect = (id, params = null) => {
		if (globallyMuted) return;

		createjs.Sound.play(id, params);
	};

	const preloadSounds = () => {
		if (soundEffectsLoading || soundEffectsLoaded || !characterData) return;

		dispatch(setSoundEffectsLoading(true));

		const finalManifest = [
			...soundsManifest,
			...characterData
				.filter((character) => character.carouselIdleAudio?.mediaItemUrl)
				.map((character) => ({ id: `${character.name.toLowerCase()}Idle`, src: character.carouselIdleAudio?.mediaItemUrl })),
			...characterData
				.filter((character) => character.carouselSelectedAudio?.mediaItemUrl)
				.map((character) => ({
					id: `${character.name.toLowerCase()}Selected`,
					src: character.carouselSelectedAudio?.mediaItemUrl,
				})),
			// Don't do this
			...characterData
				.filter((character) => character.carouselRiveAnimation?.mediaItemUrl)
				.map((character) => ({
					id: `${character.name.toLowerCase()}RiveAnimation`,
					src: character.carouselRiveAnimation?.mediaItemUrl,
				})),
		];

		const queue = new createjs.LoadQueue();
		createjs.Sound.alternateExtensions = ['mp3'];
		queue.installPlugin(createjs.Sound);

		queue.on('complete', (event) => {
			console.log('LOADED ALL SOUNDS!');
			dispatch(setSoundEffectsLoading(false));
			dispatch(setSoundEffectsLoaded(true));
		});
		queue.on('fileload', (event) => {
			console.log('Preloaded:', event.item.id, event.item.src);
		});

		queue.loadManifest(finalManifest);
	};

	return { playSoundEffect, preloadSounds };
};
