import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactComponent as DefaultLogo } from '../../assets/images/logo.svg';
import { ReactComponent as BendCaresLogo } from '../../assets/images/bendcares-logo.svg';
import { ReactComponent as Download } from '../../assets/icons/download.svg';
import { ReactComponent as Hamburger } from '../../assets/icons/hamburger.svg';
import { ReactComponent as Close } from '../../assets/icons/close.svg';
import { setCursorVariant, toggleLessonNav, toggleGloballyMuted } from '../../app/uiSlice';
import { getIconBySectionSlug, lessonSectionsData } from '../../helpers/constants';
import { LessonNavLink, RiveSoundwave } from '..';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const Logo = () => {
	const { currentSiteSlug } = useSelector((state) => state.ui);

	return currentSiteSlug === 'bendcares' ? (
		<BendCaresLogo className="mx-auto mb-10 w-27 lg:mb-[50px]" />
	) : (
		<DefaultLogo className="mx-auto mb-10 w-27 lg:mb-[50px]" />
	);
};

const LessonNav = ({ audioTrackRef }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sectionSlug } = useParams();
	const { lessonNavOpen, currentLesson, sectionSlugs, lessonAudioPlaying, lastCursorVariant, globalSoundtrackPlaying, currentSiteSlug } =
		useSelector((state) => state.ui);
	const { playSoundEffect } = useSoundEffects();

	let activeResourcePage = false,
		activeFinishedPage = false;

	if (window.location.href.indexOf('resources') > -1) {
		activeResourcePage = true;
	}
	if (window.location.href.indexOf('finished') > -1) {
		activeFinishedPage = true;
	}

	return (
		<>
			<nav
				className={`fixed top-0 z-40 w-screen bg-white py-4 px-8 text-center ${
					currentSiteSlug !== 'bendcares' ? 'lg:hidden' : ''
				}`}>
				<div className="mb-4 flex items-center justify-between">
					<button
						onClick={() => {
							dispatch(toggleLessonNav());
						}}>
						{lessonNavOpen ? <Close /> : <Hamburger />}
					</button>
					<p className={`subhead-one overflow-hidden text-ellipsis whitespace-nowrap px-4 text-sm`}>
						{currentLesson?.title ? currentLesson.title : 'loading...'}
					</p>

					<span className={`${activeResourcePage ? 'opacity-0' : ''} ${activeFinishedPage ? 'opacity-0' : ''}`}>
						{getIconBySectionSlug(sectionSlug)}
					</span>
				</div>
				{currentLesson && (
					<ul
						className={`mx-auto flex items-center justify-center space-x-1 ${activeResourcePage ? 'opacity-0' : ''} ${
							activeFinishedPage ? 'opacity-0' : ''
						}`}>
						<motion.li className="h-1 w-2 rounded-sm bg-black"></motion.li>
						{currentLesson.lessonsMeta.activeSections.map((slug, idx) => (
							<motion.li
								className={`h-1 ${
									slug === sectionSlug
										? 'w-10 bg-black'
										: `w-2 ${idx < sectionSlugs.indexOf(sectionSlug) ? 'bg-black' : 'bg-gray-300'}`
								} rounded-sm`}
								key={`lesson-nav-bar-${slug}`}></motion.li>
						))}
					</ul>
				)}
			</nav>
			<nav
				className={`fixed top-0 left-0 z-50 h-screen w-screen overflow-auto bg-white py-4 px-7 transition duration-200 ease-out-quad ${
					lessonNavOpen ? 'translate-x-0' : '-translate-x-full'
				} flex flex-col overflow-x-hidden lg:w-[23.16%] lg:min-w-[350px] ${
					currentSiteSlug === 'bendcares' ? 'lg:pt-[72px]' : 'lg:relative lg:z-30 lg:translate-x-0 lg:py-5 lg:pb-5'
				}`}
				onMouseEnter={() => {
					dispatch(setCursorVariant('default'));
				}}>
				<button
					className={`absolute top-4 left-8 z-50 ${currentSiteSlug !== 'bendcares' ? 'lg:hidden' : ''}`}
					onClick={() => {
						dispatch(toggleLessonNav());
					}}
					onMouseEnter={() => {
						dispatch(setCursorVariant('ctaHover'));
					}}
					onMouseLeave={() => {
						dispatch(setCursorVariant('default'));
					}}>
					<Close />
				</button>

				<Link to="/" className={`relative left-1/2 inline-flex -translate-x-1/2`}>
					<Logo />
				</Link>

				<div className="mb-10 text-center lg:mb-[50px]">
					<div
						className="mx-auto mb-4 h-25 w-25 rounded-4xl border-2 border-black bg-gray-200 bg-cover bg-no-repeat"
						style={{ backgroundImage: `url(${currentLesson?.featuredImage?.node.sourceUrl})` }}></div>
					<p className="subhead-three mb-1 text-sm">Lesson {currentLesson?.lessonsMeta?.lessonNumber ?? ''}</p>
					<h2 className="h3 lg:h5">{currentLesson?.title ? currentLesson.title : 'loading...'}</h2>
					<p className="p5 text-gray-300">
						{currentLesson?.lessonsMeta.estimatedTime ? currentLesson.lessonsMeta.estimatedTime + ' mins' : '...'}
					</p>
				</div>

				<motion.ul className="relative mx-auto mb-9 inline-flex max-w-[80%] flex-col items-start space-y-4 text-center">
					<AnimatePresence>
						{lessonSectionsData.map((sectionData) =>
							currentLesson?.lessonsMeta.activeSections.includes(sectionData.slug) || sectionData.slug === 'checkin' ? (
								<LessonNavLink key={sectionData.slug} slug={sectionData.slug} title={sectionData.name} />
							) : null,
						)}

						{currentLesson?.lessonsMeta?.resources && (
							<motion.li key="resources" className="pt-5">
								<button
									className="btn-secondary-icon before:hidden"
									onMouseEnter={() => {
										dispatch(setCursorVariant('ctaHover'));
									}}
									onMouseLeave={() => {
										dispatch(setCursorVariant(lastCursorVariant));
									}}
									onClick={() => {
										playSoundEffect('StandardBtnPress');
										navigate(`${currentLesson.permalink}/resources`);
										dispatch(toggleLessonNav());
									}}>
									<Download /> <span>Resources</span>
								</button>
							</motion.li>
						)}
					</AnimatePresence>
				</motion.ul>

				<div className="p7 mt-auto flex items-center justify-between bg-white bg-opacity-80 py-5 backdrop-blur-sm">
					<p className="text-gray-300">&copy; {new Date().getFullYear()} Bend Health Inc.</p>

					<button
						className="flex items-center space-x-2"
						onClick={() => {
							dispatch(toggleGloballyMuted());
						}}>
						<span>Sound:</span>
						<RiveSoundwave containerClasses="w-5" stateToggle={lessonAudioPlaying || globalSoundtrackPlaying} />
					</button>
				</div>
			</nav>
		</>
	);
};

export default LessonNav;
