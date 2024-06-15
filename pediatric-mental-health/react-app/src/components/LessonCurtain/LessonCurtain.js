import { useRef, useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import { setSectionComplete, setShowEndOfSection, setCursorVariant } from '../../app/uiSlice';
import { ReactComponent as RightArrow } from '../../assets/icons/right-arrow.svg';
import { getCurtainContentBySectionSlug } from '../../helpers/constants';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const LessonCurtain = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const curtainY = useMotionValue(0);
	const slideBottomOpacity = useMotionValue(0);
	const whiteSVGTop = useMotionValue(0);
	const characterPosition = useMotionValue(0);
	const slideBottomY = useMotionValue('35%');
	const slideTopY = useMotionValue('00%');
	const { sectionSlug } = useParams();
	const { globallyMuted, sectionSlugs, selectedCharacter, currentLesson } = useSelector((state) => state.ui);
	const curtainContent = getCurtainContentBySectionSlug(
		currentLesson.lessonsMeta.activeSections[currentLesson.lessonsMeta.activeSections.indexOf(sectionSlug) + 1],
	);
	const { playSoundEffect } = useSoundEffects();

	const overlayVariant = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0, transition: { duration: 0.2 } },
	};

	const colorVariant = {
		hidden: { opacity: 0, y: 0 },
		show: {
			opacity: 1,
			y: '-300px',
			transition: {
				duration: 0.5,
				delayChildren: 0.25,
				staggerChildren: 0.15,
			},
		},
		hide: {
			opacity: 0,
			y: 0,
			transition: {
				duration: 0.5,
				delayChildren: 0.25,
				staggerChildren: 0.15,
				// when: 'afterChildren',
			},
		},
	};

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

	const audioRef = useRef(null);
	const toggleAudio = () => {
		audioRef.current === null
			? console.log('Audio component is not loaded yet.')
			: audioRef.current.paused
			? audioRef.current.play()
			: audioRef.current.pause();
	};

	useEffect(() => {
		if (globallyMuted) {
			return;
		} else {
			toggleAudio();
		}
	}, [globallyMuted]);

	const itemVariant = {
		hidden: {
			opacity: 0,
			y: '50px',
		},
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: [0.25, 1, 0.5, 1],
			},
		},
		hide: {
			opacity: 0,
			y: '50px',
		},
	};

	let firstGradientColor = '#F2F0EE';
	let secondGradientColor = '#F2F0EE';
	let nextPageSlug = sectionSlugs[sectionSlugs.indexOf(sectionSlug) + 1];

	switch (nextPageSlug) {
		case 'checkin':
			break;
		case 'read':
			firstGradientColor = selectedCharacter ? selectedCharacter?.primaryGradientTopColor : '#B666B6';
			secondGradientColor = selectedCharacter ? selectedCharacter?.primaryGradientBottomColor : '#FF7291';
			break;
		case 'review':
			break;
		case 'remember':
			firstGradientColor = selectedCharacter ? selectedCharacter?.primaryGradientTopColor : '#B666B6';
			secondGradientColor = selectedCharacter ? selectedCharacter?.primaryGradientBottomColor : '#FF7291';
			break;

		default:
			break;
	}

	return (
		<motion.div
			className={`absolute top-0 left-0 z-20 h-full w-full overflow-hidden backdrop-blur-sm ${
				['play', 'review'].includes(sectionSlug) ? 'bg-gray-100/80' : 'bg-transparent'
			}`}
			{...overlayVariant}
			variants={overlayVariant}
			onClick={() => {
				console.log('click the curtain bg');
				dispatch(setShowEndOfSection(false));
			}}>
			<audio ref={audioRef} src={selectedCharacter?.sectionPopupAudio.mediaItemUrl} />
			<motion.div
				className={`fixed -bottom-full left-0 z-10 h-screen w-full origin-bottom text-center text-white`}
				style={{ backgroundColor: selectedCharacter?.secondaryColor ? selectedCharacter.secondaryColor : '#6C2D6C' }}
				initial="hidden"
				animate="show"
				exit="hide"
				variants={colorVariant}>
				<motion.div
					className="fixed left-0 top-0 right-0 z-30 h-full min-h-[300px] p-12 py-10 lg:py-16 lg:pt-0"
					style={{
						y: curtainY,
						backgroundColor: selectedCharacter?.secondaryColor ? selectedCharacter.secondaryColor : '#6C2D6C',
					}}>
					<svg viewBox="0 0 200 40" className="absolute left-0 top-0 z-0 w-[200%] -translate-y-[10%] -translate-x-1/4">
						<ellipse
							cx="100"
							cy="20"
							rx="100"
							ry="20"
							style={{ fill: selectedCharacter?.secondaryColor ? selectedCharacter?.secondaryColor : '#6C2D6C' }}></ellipse>
					</svg>
					<motion.svg
						style={{ opacity: whiteSVGTop, y: slideBottomY, x: '-25%', height: '500px' }}
						viewBox="0 0 200 40"
						className="absolute left-0 top-0 z-0 w-[200%]">
						<ellipse cx="100" cy="40" rx="100" ry="40" className="fill-gray-100" />
					</motion.svg>
					<motion.div
						style={{
							opacity: slideBottomOpacity,
							y: slideBottomY,
							backgroundImage: `linear-gradient(to bottom, ${firstGradientColor}, ${secondGradientColor})`,
						}}
						className="absolute  left-0 top-0 z-20 h-[140vh] w-full bg-yellow-400"></motion.div>

					<div className="relative z-10">
						<AnimatePresence mode="wait">
							<motion.h3 key="title" variants={itemVariant} className="mb-1">
								{curtainContent.title}
							</motion.h3>
							<motion.p key="blurb" variants={itemVariant} className="p4">
								{curtainContent.blurb}
							</motion.p>
						</AnimatePresence>

						<button
							className="relative z-20 mt-7 h-25 w-25 rounded-full border-4 border-black bg-yellow-400 text-black lg:mt-9 lg:h-30 lg:w-30"
							onMouseEnter={() => {
								dispatch(setCursorVariant('ctaHover'));
							}}
							onMouseLeave={() => {
								dispatch(setCursorVariant('default'));
							}}
							onClick={(ev) => {
								ev.preventDefault();
								ev.stopPropagation();

								playSoundEffect('LGBtnContinue');

								dispatch(setSectionComplete(sectionSlug));

								animate(slideTopY, '0%', {
									duration: 0.5,
									delay: 2,
									ease: [0.76, 0, 0.24, 1],
								});

								animate(slideBottomY, '0%', {
									duration: 1,
									delay: 0.4,
									ease: [0.76, 0, 0.24, 1],
								});

								animate(slideBottomOpacity, 1, {
									duration: 0.3,
									delay: 0,
									ease: [0.76, 0, 0.24, 1],
								});

								animate(whiteSVGTop, 1, {
									duration: 1,
									delay: 0.3,
									ease: [0.76, 0, 0.24, 1],
								});

								animate(characterPosition, '200px', {
									duration: 0.3,
									delay: 0,
									ease: [0.76, 0, 0.24, 1],
								});

								animate(curtainY, '-75%', {
									duration: 1.5,
									ease: [0.76, 0, 0.24, 1],
									onComplete: () => {
										navigate(
											`${currentLesson.permalink}/${
												sectionSlugs[sectionSlugs.indexOf(sectionSlug) + 1]
													? sectionSlugs[sectionSlugs.indexOf(sectionSlug) + 1]
													: 'finished'
											}`,
										);
									},
								});
							}}>
							<RightArrow className="absolute-center" />
						</button>
					</div>
				</motion.div>
			</motion.div>

			<motion.div
				className={`pointer-events-none fixed bottom-0 right-0 z-10 ${
					selectedCharacter?.sectionPopupAsset?.mediaItemUrl.includes('.riv')
						? 'h-[140px] w-[140px] lg:right-[5%] lg:h-[180px] lg:w-[180px]'
						: 'max-h-[120px] max-w-[200px] lg:h-96 lg:max-h-[200px] lg:w-96 lg:max-w-[300px]'
				}  translate-x-1/2 lg:right-1/4 `}
				initial="hidden"
				animate="show"
				exit="hide"
				style={{ y: characterPosition }}
				variants={itemVariant}>
				{selectedCharacter?.sectionPopupAsset?.mediaItemUrl.includes('.riv') ? (
					<RiveComponent src={selectedCharacter?.sectionPopupAsset?.mediaItemUrl} />
				) : (
					<img
						src={selectedCharacter?.sectionPopupAsset?.mediaItemUrl}
						alt="the chosen character"
						className="m-auto h-full w-full object-contain object-center md:max-w-none"
					/>
				)}
			</motion.div>
		</motion.div>
	);
};

export default LessonCurtain;
