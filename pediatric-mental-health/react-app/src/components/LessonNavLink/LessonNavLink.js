import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toggleLessonNav, setCursorVariant } from '../../app/uiSlice';
import { ReactComponent as RightArrow } from '../../assets/icons/right-arrow.svg';
import { ReactComponent as Checkmark } from '../../assets/icons/checkmark.svg';
import { getIconBySectionSlug } from '../../helpers/constants';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const LessonNavLink = ({ slug, title }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sectionSlug, audience } = useParams();
	const { sectionsComplete, sectionSlugs, selectedCharacter, currentLesson, lastCursorVariant } = useSelector((state) => state.ui);
	const icon = getIconBySectionSlug(slug);
	const sectionSlugsCopy = [...sectionSlugs];
	const nextSections = sectionSlugsCopy.splice(
		sectionSlugs.indexOf(sectionSlug) + 1,
		sectionSlugs.length - sectionSlugs.indexOf(sectionSlug) - 1
	);
	const { playSoundEffect } = useSoundEffects();

	return (
		<motion.li initial={{ opacity: 0, x: '-10%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '20%' }}>
			<button
				className="group relative flex items-center space-x-4 disabled:pointer-events-none disabled:cursor-not-allowed"
				onMouseEnter={() => {
					dispatch(setCursorVariant('ctaHover'));
				}}
				onMouseLeave={() => {
					dispatch(setCursorVariant(lastCursorVariant));
				}}
				disabled={
					nextSections.includes(slug) &&
					!sectionsComplete.includes(sectionSlugs[sectionSlugs.indexOf(slug) - 1]) &&
					!sectionsComplete.includes(slug) &&
					slug !== 'checkin'
				}
				onClick={() => {
					playSoundEffect('StandardBtnPress');
					navigate(`${currentLesson?.permalink}/${slug}`);
					dispatch(toggleLessonNav());
				}}>
				<RightArrow
					className={`absolute top-1/2 w-14 -translate-y-1/2 -translate-x-full opacity-0 transition-all ease-out-quad ${
						sectionSlug === slug ? '-left-5 opacity-100' : '-left-10 opacity-0 group-hover:-left-5'
					}`}
				/>
				<div
					className={`relative !ml-0 h-11 w-11 rounded-full border-2  transition ease-out-quad 
					${sectionSlug === slug || sectionsComplete.indexOf(slug) > -1 ? '!border-black bg-yellow-400' : 'bg-gray-100  group-hover:bg-yellow-400'}
					${slug === 'checkin' ? 'border-black' : 'border-transparent'}
					`}>
					<div className="absolute-center h-full w-full text-black">
						{sectionsComplete.indexOf(slug) > -1 ? (
							<Checkmark className="absolute-center" />
						) : slug === 'checkin' && selectedCharacter?.faceThumbnail ? (
							<img
								src={selectedCharacter?.faceThumbnail?.mediaItemUrl}
								alt="Character face"
								className="h-full w-full object-cover object-center"
							/>
						) : (
							<div className="absolute-center">{icon}</div>
						)}
					</div>
				</div>
				<p className="subhead-two">{slug === 'play' && audience === '13-18' ? 'Do' : title}</p>
			</button>
		</motion.li>
	);
};

export default LessonNavLink;
