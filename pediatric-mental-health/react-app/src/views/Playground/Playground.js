import { useSelector } from 'react-redux';
import { useGetCharactersQuery } from '../../app/services/api';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ReactComponent as BackArrow } from '../../assets/icons/back-arrow.svg';

import LGBtnPause from '../../assets/sounds/Large UI Button_PAUSE_v03_01.mp3';
import LGBtnPlay from '../../assets/sounds/Large UI Button_PLAY_v03_01.mp3';

const CarouselNav = (props) => {
	const swiper = useSwiper();

	return (
		<nav className="flex items-center space-x-8">
			<button
				className="btn-secondary bg-white p-4"
				onClick={(ev) => {
					swiper.slidePrev();
				}}>
				<BackArrow />
			</button>

			<button
				className="btn-secondary bg-white p-4"
				onClick={(ev) => {
					swiper.slideNext();
				}}>
				<BackArrow className="rotate-180" />
			</button>
		</nav>
	);
};

const CharacterDescription = (props) => {
	const { characterData } = useSelector((state) => state.ui);
	const swiper = useSwiper();
	const [currentIndex, setCurrentIndex] = useState(swiper.activeIndex);

	const parentVariant = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				duration: 0.5,
				delayChildren: 0.1,
				staggerChildren: 0.25,
			},
		},
		exit: { opacity: 0 },
	};

	const childVariant = {
		initial: { opacity: 0, y: '100%' },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: '-25%' },
	};

	useEffect(() => {
		swiper.on('slideChange', (s) => {
			setCurrentIndex(s.activeIndex);
		});
	}, [swiper]);

	return (
		<AnimatePresence mode="wait">
			{characterData.map((c, idx) =>
				idx === currentIndex ? (
					<motion.div initial="initial" animate="animate" exit="exit" variants={parentVariant} key={`character-${c.name}-${idx}`}>
						<motion.h2 variants={childVariant} className="text-center font-sans text-4xxl font-bold uppercase lg:text-5xxl">
							{c.name}
						</motion.h2>
						<motion.p variants={childVariant} className="text-xl">
							{c.description}
						</motion.p>
					</motion.div>
				) : null
			)}
		</AnimatePresence>
	);
};

const CharacterScreen = (props) => {
	const { characterData } = useSelector((state) => state.ui);

	useGetCharactersQuery(null, { skip: characterData !== null });

	return (
		<div className="flex h-screen flex-col">
			<div className="flex flex-1 flex-col items-center justify-center bg-teal-400">
				<header className="text-center">
					<p className="subhead-two mb-2 lg:text-base">check-in by choosing a bend buddy</p>
					<h3 className="font-black lg:text-5xl lg:leading-tight">Who are you feeling like today?</h3>
				</header>
			</div>
			<div className="min-h-[64vh] flex-1 overflow-hidden bg-red-400">
				{characterData && (
					<Swiper
						className="relative h-full"
						slideToClickedSlide={false}
						slidesPerView={3.5}
						spaceBetween={20}
						centeredSlides={true}
						touchStartPreventDefault={false}
						keyboard={{
							enabled: true,
							onlyInViewport: false,
						}}
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
							},
						}}>
						{characterData.map((character, i) => (
							<SwiperSlide key={i} className="h-2/3 bg-black text-center">
								<div className="flex h-full flex-col justify-center text-center">
									<img
										src={character.lessonCompleteAsset?.mediaItemUrl}
										alt=""
										className="h-full w-full object-contain object-center"
										draggable="false"
									/>
								</div>
							</SwiperSlide>
						))}
						<div className="absolute bottom-0 left-0 flex h-1/3 w-full flex-1 flex-col items-center justify-center space-y-4 bg-yellow-400">
							<CharacterDescription />
							<CarouselNav />
						</div>
					</Swiper>
				)}
			</div>
		</div>
	);
};

const Playground = (props) => {
	const [isActive, setIsActive] = useState(false);
	const [loadedSounds, setLoadedSounds] = useState([]);
	const createjs = window.createjs;

	useEffect(() => {
		const queue = new createjs.LoadQueue();
		createjs.Sound.alternateExtensions = ['mp3'];
		queue.installPlugin(createjs.Sound);
		queue.on('complete', handleComplete);
		queue.addEventListener('fileload', handleFileLoad);
		queue.loadManifest([
			{ id: 'music1', src: LGBtnPause },
			{ id: 'music2', src: LGBtnPlay },
		]);

		function handleFileLoad(event) {
			console.log('Preloaded:', event.item.id, event.item.src);

			setLoadedSounds((old) => [...old, `Preloaded: ${event.item.id} ${event.item.src}`]);
		}

		function handleComplete(event) {
			setLoadedSounds((old) => [...old, 'LOADED ALL SOUNDS!']);
		}
	}, [createjs.LoadQueue, createjs.Sound]);

	const parentVariant = {
		initial: {
			opacity: 0,
			y: '100%',
		},
		animate: {
			y: '-10%',
			opacity: 1,
			transition: {
				duration: 1,
				delayChildren: 0.5,
				staggerChildren: 0.25,
			},
		},
		exit: {
			y: 0,
			opacity: 0,
		},
	};

	const childVariant = {
		initial: {
			opacity: 1,
			y: '20%',
		},
		animate: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
		exit: {
			y: '10%',
			opacity: 0,
		},
	};

	const childVariantOther = {
		initial: {
			opacity: 1,
			y: '30%',
		},
		animate: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
		exit: {
			y: '15%',
			opacity: 0,
		},
	};

	return true ? (
		<div>
			<ul className="list-disc space-y-3 pl-4">
				{loadedSounds.map((s, idx) => (
					<li key={idx}>{s}</li>
				))}
			</ul>
		</div>
	) : false ? (
		<CharacterScreen />
	) : (
		<div className="overflow-hidden">
			<button
				className="btn-primary fixed top-10 left-10"
				onClick={() => {
					setIsActive((p) => !p);
				}}>
				Toggle Animation
			</button>
			<AnimatePresence mode="wait">
				{isActive && (
					<motion.div
						key="curtain"
						variants={parentVariant}
						initial="initial"
						animate="animate"
						exit="exit"
						className="curtain-parent relative h-screen overflow-visible bg-teal-400">
						<motion.div
							variants={childVariant}
							className="curtain-slide absolute top-0 left-0 h-[115vh] w-full bg-white"></motion.div>
						<motion.div
							variants={childVariantOther}
							className="curtain-slide curtain-slide--bottom to-pink-500 absolute top-0 left-0 h-[115vh] w-full bg-gradient-to-b from-purple-500 to-yellow-500"></motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Playground;
