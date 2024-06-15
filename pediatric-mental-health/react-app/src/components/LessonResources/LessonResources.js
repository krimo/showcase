// import ReactGA from 'react-ga4';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '..';
import { toggleModal, setCursorVariant } from '../../app/uiSlice';
import { formatBytes, slugify } from '../../helpers/constants';
import { ReactComponent as FileSvg } from '../../assets/icons/file.svg';
import { ReactComponent as PlaySvg } from '../../assets/icons/play-thin.svg';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const LessonResources = (props) => {
	const dispatch = useDispatch();
	const { currentLesson, lastCursorVariant } = useSelector((state) => state.ui);
	const { playSoundEffect } = useSoundEffects();

	const resourceClickHandler = (resource) => {
		// ReactGA.event({
		// 	category: 'Resource consumed',
		// 	action: 'TIMESTAMP_GOES_HERE?',
		// 	label: 'USER_ID_GOES_HERE?',
		// });
		if (resource.fileOrVideo === 'Video') {
			dispatch(toggleModal(`resourceVideoModal-${slugify(resource.resourceTitle)}`));
		} else {
			window.open(resource.file?.guid, '_blank');
		}
	};

	return currentLesson?.lessonsMeta?.resources ? (
		<ul className="relative z-10 mx-auto max-w-4xxl space-y-3">
			{currentLesson?.lessonsMeta?.resources.map((resource, idx) => (
				<li
					key={`lessonResource-${idx}`}
					className="flex items-center rounded-5xl bg-white p-4 px-8 hover:cursor-pointer lg:p-7.5 lg:py-6"
					onMouseEnter={() => {
						dispatch(setCursorVariant('ctaHover'));
					}}
					onMouseLeave={() => {
						dispatch(setCursorVariant(lastCursorVariant));
					}}
					onClick={() => {
						resourceClickHandler(resource);
					}}>
					<div className="relative mr-4 hidden lg:mr-6">
						<div className="relative aspect-square w-22 overflow-hidden rounded-3xl border border-gray-100 bg-gray-400">
							<img src={resource.thumbnail?.mediaItemUrl} alt="" className="h-full w-full object-fill object-center" />
						</div>
						<div className="absolute-center h-11 w-11 rounded-full bg-white text-center">
							{resource.fileOrVideo === 'Video' ? (
								<PlaySvg className="absolute-center" />
							) : (
								<FileSvg className="absolute-center" />
							)}
						</div>
					</div>
					<div className="text-left">
						<p className="mb-1 flex items-center space-x-3">
							<span
								className={`subhead-three lg:subhead-two rounded-full bg-gradient-to-b px-2 ${
									resource.fileOrVideo === 'Video'
										? 'from-green-400/10 to-teal-400/10'
										: 'from-purple-400/10 to-red-400/10'
								}`}>
								{resource.fileOrVideo === 'File' ? 'pdf' : 'video'}
							</span>
							<span className="text-sm lg:text-base">
								{resource.fileOrVideo === 'File' ? formatBytes(resource.file?.fileSize) : resource.videoLength}
							</span>
						</p>
						<p className="text-xxl lg:text-3lg">{resource.resourceTitle}</p>
					</div>
					<button
						className="btn-primary ml-auto hidden lg:block"
						onClick={() => {
							playSoundEffect('StandardBtnPress');
						}}>
						{resource.fileOrVideo === 'File' ? 'Download' : 'Watch'}
					</button>

					{resource.fileOrVideo === 'Video' && (
						<Modal id={`resourceVideoModal-${slugify(resource.resourceTitle)}`}>
							<iframe
								className="w-full"
								width="560"
								height="315"
								src={resource.videoLink}
								title={resource.resourceTitle}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen></iframe>
						</Modal>
					)}
				</li>
			))}
		</ul>
	) : null;
};

export default LessonResources;
