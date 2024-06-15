import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import ReactGA from 'react-ga4';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation, A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import {
	setSelectedCharacter,
	initStartLesson,
	setCursorVariant,
	setDragState,
	filterSectionSlugs,
	toggleGloballyMuted,
} from '../../app/uiSlice';
import { ReactComponent as BackArrow } from '../../assets/icons/back-arrow.svg';
import { RiveSoundwave } from '..';

import 'swiper/css';
import 'swiper/css/navigation';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const SlideContent = ({ character, idx }) => {
	const dispatch = useDispatch();
	const swiperSlide = useSwiperSlide();
	const swiper = useSwiper();
	const { selectedCharacter, cursorVariant, dragState, currentLesson } = useSelector((state) => state.ui);
	const { playSoundEffect } = useSoundEffects();
	const freshpaint = window.freshpaint || {};

	const { rive, RiveComponent } = useRive({
		src: character.carouselRiveAnimation?.mediaItemUrl,
		stateMachines: ['State Machine 1'],
		autoplay: true,
	});

	const characterSelectedInput = useStateMachineInput(rive, 'State Machine 1', 'Character Selected');
	const characterNotStaticInput = useStateMachineInput(rive, 'State Machine 1', 'NotStatic');
	const direction = swiperSlide.isActive ? 0 : swiper.activeIndex > idx ? -1 : 1;

	const slideVariant = {
		initial: { opacity: 1 },
		show: {
			opacity: selectedCharacter && selectedCharacter?.name !== character.name ? 0 : 1,
			x: selectedCharacter && selectedCharacter?.name !== character.name ? direction * 200 : 0,
		},
		hide: { opacity: 0, scale: 1, x: 0 },
	};

	useEffect(() => {
		if (!characterNotStaticInput || !characterSelectedInput) return;

		characterNotStaticInput.value = swiperSlide.isActive;
		characterSelectedInput.value = selectedCharacter?.name === character.name && swiperSlide.isActive;
	}, [swiperSlide.isActive, characterNotStaticInput, character.name, characterSelectedInput, selectedCharacter]);

	return (
		<motion.div
			className={`w-full pt-12 pb-2 ${selectedCharacter && 'pointer-events-none'}`}
			variants={slideVariant}
			initial="initial"
			animate="show"
			exit="hide"
			transition={{ delay: 0, duration: 0.4 }}
			onMouseDown={() => {
				dispatch(setDragState(true));
			}}
			onMouseUp={() => {
				dispatch(setDragState(false));
			}}
			onClick={() => {
				if (swiperSlide.isActive) {
					// ReactGA.event({
					// 	category: 'User',
					// 	action: 'Click',
					// 	label: character.name,
					// });

					freshpaint?.track('Character Selection', { character: character.name, lesson: currentLesson.title });

					dispatch(setSelectedCharacter(character.name));

					playSoundEffect('CustomCursorPress');
				}
			}}>
			<motion.div
				onMouseMove={(event) => {
					if (swiperSlide.isActive && cursorVariant !== 'select') dispatch(setCursorVariant('select'));
				}}
				onMouseEnter={() => {
					dispatch(setCursorVariant(swiperSlide.isActive ? 'select' : 'drag'));
				}}
				onMouseLeave={() => {
					dispatch(setCursorVariant('default'));
				}}
				className={`mx-auto flex aspect-video h-[64vw] w-full max-w-md cursor-pointer flex-col items-center justify-end justify-items-center pb-8 transition sm:h-96 lg:h-[29rem] lg:max-h-[54vh]
				${selectedCharacter?.name === character.name ? '-translate-y-7 scale-150' : ''}`}>
				{character.carouselRiveAnimation ? (
					<RiveComponent src={character.carouselRiveAnimation.mediaItemUrl} />
				) : (
					<img
						src={character.lessonCompleteAsset.mediaItemUrl}
						alt="product"
						className="lg:max-h-50 lg:max-w-40 lg:max-w-30 transition-alll pointer-events-none flex max-h-[50vw] w-full max-w-[50vw] rounded-lg"
					/>
				)}
			</motion.div>

			<header
				className={`transition-all ${swiperSlide.isActive ? 'opacity-1 visible delay-200' : 'invisible opacity-0'} ${
					selectedCharacter?.name === character.name && 'translate-y-full opacity-0'
				}`}>
				<div className={`transition-all duration-500 ${dragState ? 'opacity-0' : 'opacity-1'}`}>
					<h2 className=" p-0 pb-0 text-center font-sans text-4xxl font-bold uppercase lg:text-5xxl">{character.name}</h2>
					<span className="context block px-8 text-center md:h-6 md:px-2">
						<div className="relative bottom-0 left-1/2 flex min-w-[80vw] -translate-x-2/4 justify-center px-5 md:min-w-[550px]">
							{character.description}
						</div>
					</span>
				</div>
			</header>
		</motion.div>
	);
};

const GradientSvg = (props) => {
	const { selectedCharacter } = useSelector((state) => state.ui);

	return (
		<div
			className="gradient-svg"
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				display: 'flex',
			}}>
			<svg
				width="100%"
				height="200vh"
				style={{
					stroke: 'transparent',
					strokeWidth: 0,
				}}
				viewBox="0 0 1511 636"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<g filter="url(#filter0_d_534_17089)">
					<path
						d="M1690 439C1690 1497 1690 1563 755.001 1563C-179.998 1563 -180 1563 -180 439C-180 196.547 238.614 0 755 0C1271.39 0 1690 196.547 1690 439Z"
						fill="url(#paint0_linear_534_17089)"
					/>
					<path
						d="M1689.5 439C1689.5 703.51 1689.5 905.982 1674.89 1060.92C1660.29 1215.87 1631.08 1323.18 1572.73 1397.44C1514.4 1471.68 1426.89 1512.96 1295.46 1535.66C1164.03 1558.37 988.757 1562.5 755.001 1562.5C521.236 1562.5 345.964 1562.5 214.52 1544.94C83.0835 1527.39 -4.42113 1492.29 -62.7399 1422.18C-121.075 1352.05 -150.285 1246.81 -164.893 1088.77C-179.499 930.733 -179.5 720.01 -179.5 439C-179.5 318.082 -75.0934 208.457 94.0676 129.033C263.189 49.627 496.863 0.5 755 0.5C1013.14 0.5 1246.81 49.627 1415.93 129.033C1585.09 208.457 1689.5 318.082 1689.5 439Z"
						stroke="black"
					/>
				</g>
				<defs>
					<filter
						id="filter0_d_534_17089"
						x="-184"
						y="0"
						width="1878"
						height="1571"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="2" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_534_17089" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_534_17089" result="shape" />
					</filter>
					<linearGradient id="paint0_linear_534_17089" x1="755" y1="0" x2="755" y2="1563" gradientUnits="userSpaceOnUse">
						<stop stopColor={selectedCharacter?.primaryGradientTopColor || '#000'} />
						<stop offset="1" stopColor={selectedCharacter?.primaryGradientBottomColor || '#fff'} />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
};

const CharacterSelection = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { playSoundEffect } = useSoundEffects();

	const { selectedCharacter, startLesson, currentLesson, characterData, globalSoundtrackPlaying, soundEffectsLoaded } = useSelector(
		(state) => state.ui,
	);

	const [lastSelectedCharacterIndex, setLastSelectedCharacterIndex] = useState(0);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	// const variantLessonModuleBackground = {
	// 	visible: { y: -710, zIndex: 10 },
	// 	hidden: { position: 'relative', y: 0 },
	// };

	const slideChangeEventHandler = (s) => {
		console.log(`playing ${characterData[s.activeIndex]?.name.toLowerCase()}Idle`);
		playSoundEffect(`${characterData[s.activeIndex]?.name.toLowerCase()}Idle`);
		setLastSelectedCharacterIndex(s.activeIndex);
	};

	useEffect(() => {
		if (selectedCharacter?.name) {
			console.log(`playing ${selectedCharacter.name.toLowerCase()}Selected`);
			playSoundEffect(`${selectedCharacter.name.toLowerCase()}Selected`);
		}
		//eslint-disable-next-line
	}, [selectedCharacter]);

	useEffect(() => {
		if (soundEffectsLoaded) {
			console.log('playing initial character loaded sound');
			playSoundEffect(`${characterData[lastSelectedCharacterIndex]?.name.toLowerCase()}Idle`);
		}
		// eslint-disable-next-line
	}, [soundEffectsLoaded]);

	const variantGradientBorder = {
		visible: { y: -390, zIndex: 20, opacity: 1 },
		hidden: { position: 'relative', y: 2000, opacity: 1 },
	};

	const variantGradientSvg = {
		visible: { y: -0, zIndex: 30, opacity: 1 },
		hidden: { position: 'relative', y: 2000, opacity: 1 },
	};

	useEffect(() => {
		dispatch(initStartLesson(false));
		dispatch(filterSectionSlugs(currentLesson.lessonsMeta.activeSections));
	}, [dispatch, currentLesson.lessonsMeta.activeSections]);

	// const transformSlide = document.querySelectorAll('.swiper-slide .charactercanvas');

	return !characterData ? null : (
		<div
			// onMouseMove={(event) => {
			// 	const x = -event.clientX;
			// 	const y = -event.clientY;

			// 	const width = window.innerWidth;
			// 	const height = window.innerHeight;

			// 	const windowCenterX = width / 2;
			// 	const windowCenterY = height / 2;

			// 	const transformedX = x - windowCenterX;
			// 	const transformedY = y - windowCenterY;

			// 	// console.log(`x: ${transformedX/100 + 2}, y: ${transformedY/100 + 2}`)
			// 	// console.log( slide)

			// 	for (let index = 0; index < transformSlide.length; index++) {
			// 		const element = transformSlide[index];
			// 		// console.log(element.parentElement.parentElement.classList.contains('swiper-slide-active'))

			// 		if (element.parentElement.parentElement.classList.contains('swiper-slide-active')) {
			// 			element.style.transform = 'translate(' + transformedX / 80 + 'px,' + transformedY / 80 + 'px)';
			// 		} else if (element.parentElement.parentElement.classList.contains('swiper-slide-next')) {
			// 			element.style.transform = 'translate(' + transformedX / 80 + 'px,' + transformedY / 80 + 'px)';
			// 		} else if (element.parentElement.parentElement.classList.contains('swiper-slide-prev')) {
			// 			element.style.transform = 'translate(' + transformedX / 80 + 'px,' + transformedY / 80 + 'px)';
			// 		} else {
			// 			element.style.transform = 'translate(' + transformedX / 80 + 'px,' + transformedY / 80 + 'px)';
			// 		}
			// 	}
			// }}
			onMouseEnter={() => {
				// cardMouseEnter()
			}}
			onMouseLeave={() => {
				// cardMouseLeave()
			}}>
			<AnimatePresence>
				{selectedCharacter && !startLesson && (
					<motion.button
						key="backButton"
						className="group absolute top-5 left-6 z-40 flex items-center space-x-4 text-lg lg:top-13 lg:left-20"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => {
							playSoundEffect('StandardBtnPress');
							dispatch(setSelectedCharacter(null));

							if (lastSelectedCharacterIndex !== null)
								playSoundEffect(`${characterData[lastSelectedCharacterIndex]?.name.toLowerCase()}Idle`);
						}}
						onMouseEnter={() => {
							dispatch(setCursorVariant('ctaHover'));
						}}
						onMouseLeave={() => {
							dispatch(setCursorVariant('default'));
						}}>
						<span className="relative inline-block h-7.5 w-7.5 rounded-full bg-white transition ease-out-quad group-hover:bg-yellow-400 md:h-10 md:w-10 lg:h-10 lg:w-10">
							<BackArrow className="absolute-center w-[15px] md:w-[17]" />
						</span>
						<span className="hidden lg:inline">Back</span>
					</motion.button>
				)}

				{!selectedCharacter && (
					<motion.div key="border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<div className="pointer-events-none fixed top-0 left-0 right-0 bottom-0 z-10 rounded-5xl border-[15px] border-white shadow-[0_0px_0px_20px_#fff] lg:border-[20px]"></div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="align-center relative flex min-h-screen flex-col justify-end overflow-hidden bg-gray-100 pb-24">
				<button
					className="absolute top-8 right-8 z-50 flex items-center lg:top-13 lg:right-20 lg:space-x-2"
					onClick={() => {
						dispatch(toggleGloballyMuted());
					}}
					onMouseEnter={() => {
						dispatch(setCursorVariant('ctaHover'));
					}}
					onMouseLeave={() => {
						dispatch(setCursorVariant('default'));
					}}>
					<span className="hidden lg:inline-block">Sound:</span>
					<RiveSoundwave containerClasses="w-5" stateToggle={globalSoundtrackPlaying} />
				</button>
				<div className="top-0 left-0 right-0 pt-16 lg:absolute lg:pt-25">
					<div className="mx-auto max-w-4xl px-5 text-center">
						<AnimatePresence mode="wait">
							{!selectedCharacter && (
								<motion.header
									key="noCharHeader"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{ duration: 0.5 }}>
									<p className="subhead-two pb-2 lg:text-base">check-in by choosing a bend buddy</p>
									<h3 className="font-black lg:text-5xl lg:leading-tight ">Who are you feeling like today?</h3>
								</motion.header>
							)}
							{selectedCharacter && (
								<motion.p
									key="charHeader"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{ duration: 0.5 }}
									className="p2">
									It's always nice to have a buddy when you're learning something new.{' '}
									<b className="uppercase">{selectedCharacter.name}</b> will hang out with you during this entire lesson!
								</motion.p>
							)}
						</AnimatePresence>
					</div>
				</div>

				<Swiper
					className={`relative z-10 max-w-full overflow-visible ${selectedCharacter && 'pointer-events-none'}`}
					modules={[Navigation, A11y, Keyboard]}
					slideToClickedSlide={false}
					slidesPerView={3.5}
					centeredSlides={true}
					touchStartPreventDefault={false}
					onSlideChange={slideChangeEventHandler}
					shortSwipes={true}
					navigation={{
						prevEl: navigationPrevRef.current,
						nextEl: navigationNextRef.current,
					}}
					keyboard={{
						enabled: true,
						onlyInViewport: false,
					}}
					onBeforeInit={(swiper) => {
						swiper.params.navigation.prevEl = navigationPrevRef.current;
						swiper.params.navigation.nextEl = navigationNextRef.current;
					}}
					initialSlide={selectedCharacter !== null ? characterData.findIndex((c) => c.name === selectedCharacter.name) : 0}
					pagination={{ clickable: false }}
					breakpoints={{
						1: {
							slidesPerView: 2,
							spaceBetween: 10,
						},
						500: {
							slidesPerView: 2,
						},
						1024: {
							slidesPerView: 4.05,
							shortSwipes: false,
						},
					}}>
					{characterData.map((character, i) => (
						<SwiperSlide key={i} className="flex flex-col items-center justify-items-center">
							<SlideContent character={character} idx={i} />
						</SwiperSlide>
					))}

					<div
						className={`justify-content-center my-4 flex items-center justify-center space-x-5 ${
							selectedCharacter && 'opacity-0'
						}`}>
						<button
							className="btn-secondary bg-white p-4"
							ref={navigationPrevRef}
							onClick={() => {
								playSoundEffect('StandardBtnPress');
							}}
							onMouseEnter={() => {
								dispatch(setCursorVariant('ctaHover'));
							}}
							onMouseLeave={() => {
								dispatch(setCursorVariant('default'));
							}}>
							<BackArrow />
						</button>

						<button
							className="btn-secondary bg-white p-4"
							ref={navigationNextRef}
							onClick={() => {
								playSoundEffect('StandardBtnPress');
							}}
							onMouseEnter={() => {
								dispatch(setCursorVariant('ctaHover'));
							}}
							onMouseLeave={() => {
								dispatch(setCursorVariant('default'));
							}}>
							<BackArrow className="rotate-180" />
						</button>
					</div>
				</Swiper>

				<div className="bottom-0 left-0 right-0 z-20 lg:absolute">
					<AnimatePresence>
						{selectedCharacter && (
							<motion.div
								key="main color svg"
								initial={{ opacity: 0, y: 100, zIndex: 20 }}
								animate={{ opacity: 1, zIndex: 20, y: 20 }}
								transition={{ duration: 0.6, delay: 0 }}
								exit={{ opacity: 0, y: 100 }}>
								<div className="fixed left-0 right-0 -top-[15rem] flex w-[200vw] -translate-x-[50vw] sm:-top-[7rem] lg:-top-[18rem] lg:w-[auto] lg:translate-x-0">
									<svg width="100%" height="665" viewBox="0 0 1511 665" fill="none" xmlns="http://www.w3.org/2000/svg">
										<ellipse cx="755" cy="424" rx="1121" ry="424" fill={selectedCharacter?.secondaryColor || '#000'} />
									</svg>
								</div>
							</motion.div>
						)}
						{startLesson && (
							<>
								<motion.div
									key="gradientBorder"
									variants={variantGradientBorder}
									transition={{ duration: 1, delay: 0.5 }}
									initial="hidden"
									animate="visible">
									<div className="absolute bottom-0 left-0 right-0 flex">
										<svg
											width="100%"
											height="654"
											viewBox="0 0 1511 654"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<ellipse cx="755" cy="469" rx="1095" ry="469" fill="white" />
										</svg>
									</div>
								</motion.div>

								<motion.div
									key="gradientSVG"
									variants={variantGradientSvg}
									transition={{ duration: 1, delay: 0.5 }}
									initial="hidden"
									animate="visible">
									<GradientSvg></GradientSvg>
								</motion.div>
							</>
						)}

						{selectedCharacter && !startLesson && currentLesson && (
							<motion.div
								key="lessonCard"
								initial={{ opacity: 0, y: 50, zIndex: 20, x: '-50%' }}
								animate={{ opacity: 1, zIndex: 20, y: 20, x: '-50%' }}
								exit={{ opacity: 0, y: 50, delay: 0, x: '-50%' }}
								transition={{ delay: 0.2, duration: 0.2 }}
								className="absolute bottom-10 left-1/2 z-20 w-full max-w-[90%] space-y-5 rounded-[35px] bg-white p-6.5 text-center md:bottom-25 lg:flex lg:max-w-[869px] lg:items-center lg:space-y-0 lg:space-x-5 lg:rounded-[40px] lg:p-10 lg:text-left">
								<div
									className="mx-auto h-25 w-25 rounded-4xl border-2 border-black bg-gray-200 bg-cover bg-no-repeat lg:h-38 lg:w-38"
									style={{ backgroundImage: `url(${currentLesson?.featuredImage?.node.sourceUrl})` }}></div>
								<div className="lg:flex-1">
									<p className="subhead text-xs lg:text-sm">Lesson {currentLesson.lessonsMeta.lessonNumber ?? ''}</p>
									<h3 className="lg:text-[32px]">{currentLesson.title}</h3>
									<p className="text-gray-300">{currentLesson.lessonsMeta.estimatedTime} mins</p>
								</div>
								{currentLesson && (
									<button
										className="btn-primary lg:ml-auto"
										onMouseEnter={() => {
											dispatch(setCursorVariant('ctaHover'));
										}}
										onMouseLeave={() => {
											dispatch(setCursorVariant('default'));
										}}
										onClick={() => {
											playSoundEffect('StandardBtnPress');

											// ReactGA.event({
											// 	category: 'User',
											// 	action: 'Click',
											// 	label: 'Lesson Start',
											// });

											dispatch(initStartLesson(true));

											window.setTimeout(() => {
												navigate(`${currentLesson.permalink}/read`);
											}, 1000);
										}}>
										Start lesson
									</button>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default CharacterSelection;
