import { useEffect, useLayoutEffect, useRef, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { motion, useSpring, useMotionValue, useScroll, animate } from 'framer-motion';
import { toggleLessonAudioPlaying, setShowEndOfSection, setCursorVariant } from '../../app/uiSlice';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { formatTimestamp, getClosestParagraphIndexToCenter } from '../../helpers/constants';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const RollingAudio = forwardRef(({ trackData }, audioTrackRef) => {
	const dispatch = useDispatch();
	const { playSoundEffect } = useSoundEffects();
	const swipeHandlers = useSwipeable({
		onSwipedDown: (ev) => {
			if (lessonAudioPlaying) betterPlayPauseHandler();
		},
		onSwipedUp: (ev) => {
			if (lessonAudioPlaying) betterPlayPauseHandler();
		},
	});
	const audioProgress = useMotionValue(0);
	const audioVolume = useMotionValue(0);
	const { lessonAudioPlaying, currentLesson, selectedCharacter, showEndOfSection, globallyMuted, currentSiteSlug } = useSelector(
		(state) => state.ui,
	);
	const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
	const scrollContainerRef = useRef(null);
	const parentContainerRef = useRef(null);
	const playPauseButtonRef = useRef(null);
	const { scrollYProgress } = useScroll({ container: scrollContainerRef });
	const pathLength = useSpring(audioProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const containerScrollHandler = (ev) => {
		if (lessonAudioPlaying) return;

		const closestIndex = getClosestParagraphIndexToCenter(scrollContainerRef.current, currentParagraphIndex);

		if (currentParagraphIndex !== closestIndex) {
			audioTrackRef.current.currentTime = +scrollContainerRef.current.children[closestIndex].dataset.timestamp;
			audioProgress.set(audioTrackRef.current.currentTime / audioTrackRef.current.duration);
			console.log(audioProgress.get());
		}
	};

	const betterPlayPauseHandler = (ev) => {
		if (!audioTrackRef.current) return;

		if (!lessonAudioPlaying) {
			const closestIndex = getClosestParagraphIndexToCenter(scrollContainerRef.current, currentParagraphIndex);

			// Scroll to paragraph and set the audio to the timestamp
			if (currentParagraphIndex !== closestIndex) {
				const timestamp = +scrollContainerRef.current.children[closestIndex].dataset.timestamp;
				audioTrackRef.current.currentTime = timestamp;
				setCurrentParagraphIndex(closestIndex);
			}

			audioVolume.set(0);
			audioTrackRef.current
				.play()
				.then(() => {
					animate(audioVolume, 1, {
						duration: 0.5,
					});
				})
				.catch((err) => console.log(err));
		} else {
			audioVolume.set(1);
			dispatch(toggleLessonAudioPlaying(false));
			animate(audioVolume, 0, {
				duration: 0.5,
				onComplete: () => {
					audioTrackRef.current.pause();
				},
			});
		}
	};

	const advanceParagraphs = (ev) => {
		if (!lessonAudioPlaying) return;

		audioProgress.set(audioTrackRef.current.currentTime / audioTrackRef.current.duration);

		const currentTime = audioTrackRef.current.currentTime;

		Array.from(scrollContainerRef.current.children)
			.map((p) => +p.dataset.timestamp)
			.forEach((timestamp, idx) => {
				if (currentTime > timestamp && idx > currentParagraphIndex) {
					setCurrentParagraphIndex(idx);
				}
			});
	};

	useLayoutEffect(() => {
		if (!scrollContainerRef.current) return;

		return scrollYProgress.onChange((latest) => {
			if (latest >= 1) {
				dispatch(toggleLessonAudioPlaying(false));
				dispatch(setShowEndOfSection(true));
			}
		});
	}, [scrollYProgress, dispatch]);

	useEffect(() => {
		if (!scrollContainerRef.current || scrollContainerRef.current.children.length === 0) return;

		const elDimensions = scrollContainerRef.current.children[currentParagraphIndex].getBoundingClientRect();
		const topDistanceToMidScreen = scrollContainerRef.current.children[currentParagraphIndex].offsetTop - window.innerHeight / 2;
		const scrollDistance = topDistanceToMidScreen + elDimensions.height / 2;

		scrollContainerRef.current.scrollTo({ top: scrollDistance, behavior: 'smooth' });
	}, [currentParagraphIndex]);

	useEffect(() => {
		if (!audioTrackRef.current) return;

		return audioVolume.onChange((latest) => {
			audioTrackRef.current.volume = latest;
		});
	}, [audioVolume, audioTrackRef]);

	useEffect(() => {
		if (audioTrackRef?.current) audioTrackRef.current.muted = globallyMuted;
	}, [globallyMuted, audioTrackRef]);

	return !currentLesson ? (
		<div
			className={`relative bg-gradient-to-b`}
			style={{
				backgroundImage: `linear-gradient(to bottom, ${
					selectedCharacter ? selectedCharacter?.primaryGradientTopColor : '#B666B6'
				}, ${selectedCharacter ? selectedCharacter?.primaryGradientBottomColor : '#FF7291'})`,
			}}></div>
	) : (
		<div
			className="relative bg-gradient-to-b"
			ref={parentContainerRef}
			style={{
				backgroundImage: `linear-gradient(to bottom, ${
					selectedCharacter ? selectedCharacter?.primaryGradientTopColor : '#B666B6'
				}, ${selectedCharacter ? selectedCharacter?.primaryGradientBottomColor : '#FF7291'})`,
			}}
			{...swipeHandlers}>
			<audio
				src={trackData.audioTrack?.mediaItemUrl}
				ref={audioTrackRef}
				autoPlay={true}
				playsInline
				onTimeUpdate={advanceParagraphs}
				onPlay={() => {
					dispatch(toggleLessonAudioPlaying(true));
				}}
				onPause={() => {
					dispatch(toggleLessonAudioPlaying(false));
				}}
				onEnded={() => {
					dispatch(setShowEndOfSection(true));
					dispatch(toggleLessonAudioPlaying(false));
				}}></audio>
			<button
				className={`fixed bottom-5 left-1/2 z-20 w-[7.211rem] -translate-x-1/2 md:w-[8.654rem] lg:bottom-13 ${
					currentSiteSlug === 'bendcares' ? '' : 'md:left-[calc(350px+50%)] md:-translate-x-[150%]'
				}`}
				onClick={() => {
					audioTrackRef.current.paused ? playSoundEffect('LGBtnPlay') : playSoundEffect('LGBtnPause');
					betterPlayPauseHandler();
				}}
				onMouseEnter={() => {
					dispatch(setCursorVariant('ctaHover'));
				}}
				onMouseLeave={() => {
					dispatch(setCursorVariant('default'));
				}}
				ref={playPauseButtonRef}>
				<svg
					id="progress"
					width="100"
					height="100"
					style={{ width: '100%', height: '100%' }}
					viewBox="0 0 120 120"
					className="w-25 -rotate-90 lg:w-27 ">
					<circle cx="60" cy="60" r="52" pathLength="1" className="fill-white stroke-gray-200 stroke-[4px]" />
					<motion.circle
						cx="60"
						cy="60"
						r="52"
						pathLength="1"
						className="fill-transparent stroke-black stroke-[4px]"
						style={{ pathLength: pathLength }}
					/>
				</svg>
				<span className="absolute-center z-10 text-black">{lessonAudioPlaying ? <PauseIcon /> : <PlayIcon />}</span>
			</button>
			<div
				className="h-screen space-y-13 overflow-auto px-7 py-[50vh] lg:space-y-25"
				ref={scrollContainerRef}
				onWheel={(ev) => {
					if (lessonAudioPlaying) betterPlayPauseHandler();
				}}
				onScroll={containerScrollHandler}>
				{trackData.track?.map((item, idx) => (
					<div
						key={idx}
						dangerouslySetInnerHTML={{ __html: item.content }}
						data-timestamp={formatTimestamp(item.timestampsSeconds) ?? 0}
						className={`lesson-rolling-audio-paragraph p1 mx-auto max-w-3xl leading-135 text-white transition duration-500 ease-out-quad lg:max-w-1200 lg:px-20 ${
							idx === currentParagraphIndex || !lessonAudioPlaying
								? showEndOfSection
									? 'opacity-50 blur-none'
									: 'opacity-100 blur-none'
								: 'opacity-50 blur-sm'
						}`}></div>
				))}
			</div>
		</div>
	);
});

export default RollingAudio;
