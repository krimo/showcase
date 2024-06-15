import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGlobalSoundtrackPlaying,setUserInteraction } from '../app/uiSlice';
import globalSoundtrackSrc from '../assets/sounds/global-soundtrack.mp3';

export const useGlobalSoundtrack = () => {
	const dispatch = useDispatch();
	const { lessonAudioPlaying, globallyMuted, modalsOpen, danceTrackPlaying, userInteraction } = useSelector((state) => state.ui);
	const [globalSoundtrack] = useState(new Audio(globalSoundtrackSrc));

	globalSoundtrack.loop = true;

	useEffect(()=>{
		document.addEventListener("click",function(){
			if(globalSoundtrack.paused){
				globalSoundtrack.play();
				dispatch(setUserInteraction(true))
			}
		})
		
	},[userInteraction,globalSoundtrack,dispatch])

	useEffect(() => {
		const playEvent = globalSoundtrack.addEventListener('play', (ev) => {
			dispatch(setGlobalSoundtrackPlaying(true));
		});

		const pauseEvent = globalSoundtrack.addEventListener('pause', (ev) => {
			dispatch(setGlobalSoundtrackPlaying(false));
		});

		return () => {
			globalSoundtrack.removeEventListener('play', playEvent);
			globalSoundtrack.removeEventListener('pause', pauseEvent);
		};
		
	}, [globalSoundtrack, dispatch]);

	useEffect(() => {
		globalSoundtrack.muted = globallyMuted;
	}, [globallyMuted, globalSoundtrack]);

	useEffect(() => {
		console.log(danceTrackPlaying);
		globalSoundtrack.volume = danceTrackPlaying ? 0 : 1;
	}, [danceTrackPlaying, globalSoundtrack, modalsOpen]);

	useEffect(() => {
		const videoModalOpen = modalsOpen.find((m) => m.includes('resourceVideoModal'));
		console.log(videoModalOpen);
		globalSoundtrack.volume = lessonAudioPlaying || videoModalOpen ? 0.25 : 1;
	}, [lessonAudioPlaying, globalSoundtrack, modalsOpen]);

	return { globalSoundtrack };
};
