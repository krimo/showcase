import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setShowEndOfSection } from '../../app/uiSlice';

const PlaySection = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sectionSlug } = useParams();
	const { sectionSlugs, currentLesson } = useSelector((state) => state.ui);

	return (
		<div className="h-screen overflow-y-auto">
			<div className="container max-w-screen-contain py-27 text-center lg:py-11.5 lg:pt-27">
				<h1 className="mb-5">{currentLesson?.lessonsMeta?.playSection?.headline ?? 'Time to play!'}</h1>

				{currentLesson?.lessonsMeta?.playSection?.content && (
					<div
						className="play-section-content mb-3 space-y-4 lg:mb-10"
						dangerouslySetInnerHTML={{ __html: currentLesson.lessonsMeta.playSection.content }}></div>
				)}

				<button
					className="btn-primary mx-auto mb-4 mt-10  block md:mt-0"
					onClick={() => {
						dispatch(setShowEndOfSection(true));
					}}>
					Ok, I did it!
				</button>
				<button
					className="link p4 z-10 mx-auto block"
					onClick={() => {
						navigate(`${currentLesson.permalink}/${sectionSlugs[sectionSlugs.indexOf(sectionSlug) + 1]}`);
					}}>
					Skip for now
				</button>
			</div>
		</div>
	);
};

export default PlaySection;
