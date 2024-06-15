// import ReactGA from 'react-ga4';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
	LessonNav,
	RollingAudio,
	ReviewForm,
	LessonCurtain,
	PlaySection,
	ResourcesTab,
	CharacterSelection,
	LessonFinishedSection,
	CustomCursor,
} from '../../components';
import { useGetLessonBySlugQuery, useGetCharactersQuery } from '../../app/services/api';
import { initStartLesson, setShowEndOfSection } from '../../app/uiSlice';
import { useGlobalSoundtrack } from '../../helpers/useGlobalSoundtrack';

const Lesson = (props) => {
	const dispatch = useDispatch();
	const { currentLesson, showEndOfSection, characterData, globallyMuted, currentSiteSlug } = useSelector((state) => state.ui);
	const { lessonSlug, sectionSlug } = useParams();
	const lessonContainerRef = useRef(null);
	const audioTrackRef = useRef(null);
	const audioTrackRefRemember = useRef(null);
	const { isLoading: charactersLoading } = useGetCharactersQuery(null, { skip: characterData !== null });
	const { isLoading, isFetching } = useGetLessonBySlugQuery(lessonSlug, { skip: currentLesson?.slug === lessonSlug });

	useGlobalSoundtrack();

	useEffect(() => {
		dispatch(initStartLesson(false));
	}, [dispatch]);

	useEffect(() => {
		// if (sectionSlug === 'finished') {
		// 	ReactGA.event({
		// 		category: 'User',
		// 		action: 'Completed',
		// 		label: 'Lesson End',
		// 	});
		// }

		dispatch(setShowEndOfSection(false));

		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [sectionSlug, dispatch]);

	useEffect(() => {
		if (audioTrackRef?.current) audioTrackRef.current.muted = globallyMuted;
		if (audioTrackRefRemember?.current) audioTrackRefRemember.current.muted = globallyMuted;
	}, [globallyMuted, audioTrackRef, audioTrackRefRemember]);

	return (
		<div ref={lessonContainerRef}>
			{isLoading || isFetching || charactersLoading ? null : !sectionSlug ? (
				<Navigate to="checkin" />
			) : sectionSlug === 'checkin' ? (
				<CharacterSelection />
			) : (
				<div className={`h-full ${currentSiteSlug !== 'bendcares' ? 'lg:flex' : ''}`} key="lesson">
					<LessonNav audioTrackRef={audioTrackRef} />
					<div className={`relative h-full ${currentSiteSlug !== 'bendcares' ? 'lg:flex-1' : ''}`}>
						<div className="h-full overflow-hidden bg-gray-100">
							<AnimatePresence mode="wait">
								{sectionSlug === 'read' && (
									<RollingAudio
										key="readSection"
										trackData={currentLesson?.lessonsMeta?.readSection}
										ref={audioTrackRef}
									/>
								)}
								{sectionSlug === 'play' && <PlaySection key="playSection" />}
								{sectionSlug === 'review' && <ReviewForm key="reviewSection" />}
								{sectionSlug === 'remember' && (
									<RollingAudio
										key="rememberSection"
										trackData={currentLesson?.lessonsMeta?.rememberSection}
										ref={audioTrackRefRemember}
									/>
								)}
								{sectionSlug === 'resources' && <ResourcesTab key="resourcesSection" />}
								{sectionSlug === 'finished' && <LessonFinishedSection key="finishedSection" />}
							</AnimatePresence>
							<AnimatePresence mode="wait">{showEndOfSection && <LessonCurtain key="lessonCurtain" />}</AnimatePresence>
						</div>
					</div>
				</div>
			)}
			<CustomCursor targetRef={lessonContainerRef} />
		</div>
	);
};

export default Lesson;
