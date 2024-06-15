import { createSlice } from '@reduxjs/toolkit';
import { api } from './services/api';

const initialState = {
	sectionSlugs: ['checkin', 'read', 'play', 'review', 'remember'],
	characterData: null,
	modalsOpen: [],
	sectionsComplete: [],
	riveAnimationOpen: false,
	loadingScreenActive: false,
	lessonNavOpen: false,
	lessonAudioPlaying: false,
	selectedCharacter: null,
	currentLesson: null,
	startLesson: false,
	showEndOfSection: false,
	hoverSate: false,
	hoverSateCurrent: null,
	finishedLesson: false,
	cursorVariant: 'default',
	lastCursorVariant: 'default',
	dragState: false,
	reviewFormValues: null,
	globalSoundtrackPlaying: false,
	globallyMuted: false,
	soundEffectsLoaded: false,
	soundEffectsLoading: false,
	danceTrackPlaying: false,
	userInteraction: false,
	currentSiteSlug: window.location.host.split('.')[0],
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleLessonNav: (state) => {
			state.lessonNavOpen = !state.lessonNavOpen;
		},
		toggleLessonAudioPlaying: (state, { payload: override }) => {
			state.lessonAudioPlaying = typeof override !== 'undefined' ? override : !state.lessonAudioPlaying;
		},
		toggleDanceTrackPlaying: (state, { payload }) => {
			state.danceTrackPlaying = payload;
		},
		setGlobalSoundtrackPlaying: (state, { payload }) => {
			state.globalSoundtrackPlaying = payload;
		},
		setSoundEffectsLoading: (state, { payload }) => {
			state.soundEffectsLoading = payload;
		},
		setSoundEffectsLoaded: (state, { payload }) => {
			state.soundEffectsLoaded = payload;
		},
		toggleGloballyMuted: (state, { payload: override }) => {
			state.globallyMuted = typeof override !== 'undefined' ? override : !state.globallyMuted;
		},
		toggleRiveAnimation: (state) => {
			state.riveAnimationOpen = !state.riveAnimationOpen;
		},
		setUserInteraction: (state, { payload }) => {
			state.userInteraction = payload;
		},
		toggleModal: (state, { payload: modalId }) => {
			const targetModalIdIndex = state.modalsOpen.indexOf(modalId);

			targetModalIdIndex > -1 ? state.modalsOpen.splice(targetModalIdIndex, 1) : state.modalsOpen.push(modalId);

			state.modalsOpen.length > 0
				? document.body.classList.add('overflow-hidden')
				: document.body.classList.remove('overflow-hidden');
		},
		clearAllModals: (state) => {
			state.modalsOpen = [];
			document.body.classList.remove('overflow-hidden');
		},
		setLoadingScreen: (state, { payload: override }) => {
			state.loadingScreenActive = typeof override !== 'undefined' ? override : !state.loadingScreenActive;
		},
		setSelectedCharacter: (state, { payload: characterName }) => {
			state.selectedCharacter = characterName
				? state.characterData.find((c) => c.name.toLowerCase() === characterName.toLowerCase())
				: null;
		},
		initStartLesson: (state, { payload: override }) => {
			state.startLesson = typeof override !== 'undefined' ? override : true;
		},
		setSectionComplete: (state, { payload: sectionSlug }) => {
			const targetSectionIndex = state.sectionsComplete.indexOf(sectionSlug);

			if (targetSectionIndex < 0) state.sectionsComplete.push(sectionSlug);

			if (state.sectionsComplete.length === state.sectionSlugs.length - 1) state.finishedLesson = true;
		},
		setShowEndOfSection: (state, { payload }) => {
			state.showEndOfSection = payload;
		},
		setHoverSate: (state, { payload }) => {
			state.hoverSate = payload;
		},
		setHoverSateCurrentText: (state, { payload }) => {
			state.hoverSateCurrentText = payload;
		},
		setCurrentLesson: (state, { payload }) => {
			let p = structuredClone(payload);

			// Account for name change of review/reflect section
			let reviewIndex = p.lessonsMeta?.activeSections.indexOf('reflect');

			if (reviewIndex > -1) p.lessonsMeta.activeSections[reviewIndex] = 'review';

			state.currentLesson = p;
		},
		setCursorVariant: (state, { payload }) => {
			state.lastCursorVariant = state.cursorVariant;
			state.cursorVariant = payload;
		},
		setDragState: (state, { payload }) => {
			state.dragState = payload;
		},
		filterSectionSlugs: (state, { payload: currentLessonActiveSections }) => {
			// Account for name change of review/reflect section
			const slugs = [...currentLessonActiveSections];

			let reviewIndex = slugs.indexOf('reflect');

			if (reviewIndex > -1) slugs[reviewIndex] = 'review';

			state.sectionSlugs = ['checkin', ...state.sectionSlugs.filter((s) => slugs.includes(s))];
		},
		setReviewFormValues: (state, { payload }) => {
			state.reviewFormValues = payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getLessonBySlug.matchFulfilled, (state, { payload }) => {
				let p = structuredClone(payload);
				// Account for name change of review/reflect section
				let reviewIndex = p.lessonsMeta?.activeSections.indexOf('reflect');

				if (reviewIndex > -1) p.lessonsMeta.activeSections[reviewIndex] = 'review';

				state.currentLesson = p;
				state.sectionSlugs = ['checkin', ...state.sectionSlugs.filter((s) => p.lessonsMeta.activeSections.includes(s))];
			})
			.addMatcher(api.endpoints.getCharacters.matchFulfilled, (state, { payload }) => {
				state.characterData = payload;
			});
	},
});

export const {
	toggleModal,
	clearAllModals,
	toggleRiveAnimation,
	setLoadingScreen,
	toggleLessonNav,
	setSelectedCharacter,
	toggleLessonAudioPlaying,
	toggleDanceTrackPlaying,
	initStartLesson,
	setSectionComplete,
	setShowEndOfSection,
	setHoverSate,
	setHoverSateCurrentText,
	setCurrentLesson,
	setCursorVariant,
	setDragState,
	filterSectionSlugs,
	setReviewFormValues,
	setGlobalSoundtrackPlaying,
	toggleGloballyMuted,
	setSoundEffectsLoaded,
	setSoundEffectsLoading,
	setUserInteraction,
} = uiSlice.actions;

export default uiSlice.reducer;
