import { useSelector } from 'react-redux';
import { LessonResources } from '..';

const ResourcesTab = (props) => {
	const { finishedLesson } = useSelector((state) => state.ui);
	console.log(finishedLesson);

	return (
		<div className="h-screen overflow-y-auto py-27 lg:py-11.5">
			<div className="space-y-13 lg:space-y-14 container">
				<header className="text-center">
					<h2 className="text-3xl lg:text-5xl	">Lesson Resources</h2>
				</header>
				<LessonResources />
			</div>
		</div>
	);
};

export default ResourcesTab;
