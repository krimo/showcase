import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { setCursorVariant, toggleDanceTrackPlaying } from '../../app/uiSlice';
import { LessonResources } from '..';
import { tsParticlesConfettiOptions } from '../../helpers/constants';
import danceTrackSrc from '../../assets/sounds/Bend Health Cues_Dance Party 03_loop Final.mp3';

import ConfettiFile1 from '../../assets/sounds/CONFETTI_v02_1.mp3';
import ConfettiFile2 from '../../assets/sounds/CONFETTI_v02_2.mp3';
import ConfettiFile3 from '../../assets/sounds/CONFETTI_v02_3.mp3';

const LessonFinishedSection = (props) => {
	const dispatch = useDispatch();
	const { selectedCharacter, lastCursorVariant, globallyMuted, danceTrackPlaying, currentSiteSlug } = useSelector((state) => state.ui);

	const { rive, RiveComponent } = useRive({
		src: selectedCharacter?.sectionPopupAsset?.mediaItemUrl,
		stateMachines: ['State Machine 1'],
		autoplay: true,
	});

	// const characterSelectedInput = useStateMachineInput(rive, 'State Machine 1', 'Character Selected');
	const characterNotStaticInput = useStateMachineInput(rive, 'State Machine 1', 'NotStatic');

	useEffect(() => {
		if (!characterNotStaticInput) return;

		characterNotStaticInput.value = true;
	}, [characterNotStaticInput]);

	const particlesInit = useCallback(async (engine) => {
		await loadFull(engine);
	}, []);

	const confettiArray = [];
	confettiArray.push(ConfettiFile1, ConfettiFile2, ConfettiFile3);

	let refConfettiItem = confettiArray[Math.floor(Math.random() * confettiArray.length)];

	let Confetti1 = useRef(new Audio(refConfettiItem));

	let danceTrack = useRef(new Audio(danceTrackSrc));

	useEffect(() => {
		let danceTrackRef = danceTrack.current;

		console.log(danceTrackPlaying);
		dispatch(toggleDanceTrackPlaying(true));
		console.log(danceTrackPlaying);

		if (danceTrackPlaying) {
			danceTrackRef.play();
			console.log(danceTrackPlaying);
		}

		if (danceTrackPlaying) danceTrackRef.muted = globallyMuted;

		return () => {
			dispatch(toggleDanceTrackPlaying(false));
			danceTrackRef.pause();
			console.log(danceTrackPlaying);
		};
	}, [danceTrackPlaying, globallyMuted, dispatch]);

	useEffect(() => {
		let refConfetti1 = Confetti1.current;

		refConfetti1.loop = false;

		if (!globallyMuted) {
			refConfetti1.play();
		} else {
			refConfetti1.pause();
		}

		if (refConfetti1) refConfetti1.muted = globallyMuted;

		return () => {
			refConfetti1.pause();
		};

		//eslint-disable-next-line
	}, [Confetti1, globallyMuted]);

	const audioRef = useRef(null);

	const toggleAudio = () => {
		if (globallyMuted) {
			return;
		}

		if (audioRef.current === null) {
			console.log('Audio component is not loaded yet.');
		} else {
			audioRef.current.currentTime = 0;

			if (audioRef.current.paused) {
				console.log(audioRef.current.currentTime);
				audioRef.current.play();
			} else {
				// audioRef.current.pause()
			}
		}
	};

	return (
		<div
			className="h-screen overflow-y-auto py-27 lg:py-27"
			onMouseEnter={() => {
				dispatch(setCursorVariant('party'));
			}}
			onMouseLeave={() => {
				dispatch(setCursorVariant(lastCursorVariant));
			}}
			onClick={(ev) => {
				console.log('Fire off random sound');
				if (globallyMuted) {
					return;
				} else {
					toggleAudio();
				}
			}}>
			<audio ref={audioRef} src={refConfettiItem} />

			<div className="container text-center">
				<h1 className="mb-5">Hooray! You finished.</h1>
				<p className="p3 mb-7.5 lg:mb-13">Tap into the resources section to keep practicing what you've learned so far.</p>

				{currentSiteSlug !== 'bendcares' && <LessonResources />}

				<motion.div
					key="backButton"
					className={`${
						currentSiteSlug !== 'bendcares'
							? 'fixed bottom-0 right-0 z-0 ml-auto w-1/2 lg:w-44'
							: `absolute bottom-0 left-1/2 z-0 w-full !-translate-x-1/2 lg:max-w-4xl ${
									currentSiteSlug === 'bendcares' ? 'h-[360px] lg:h-[480px]' : ''
							  }`
					}`}
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}>
					{selectedCharacter?.lessonCompleteAsset?.mediaItemUrl.includes('.riv') ? (
						<RiveComponent src={selectedCharacter?.lessonCompleteAsset?.mediaItemUrl} />
					) : (
						<img
							src={selectedCharacter?.lessonCompleteAsset?.mediaItemUrl}
							alt="the chosen character"
							className={`m-auto h-full w-full object-contain object-center ${
								currentSiteSlug !== 'bendcares' ? '' : 'max-h-[80vh]'
							}`}
						/>
					)}
				</motion.div>
			</div>

			<Particles id="tsparticles" init={particlesInit} options={tsParticlesConfettiOptions} />

			{/* <audio  src={DanceAudio} controls autoPlay></audio> */}
		</div>
	);
};

export default LessonFinishedSection;
