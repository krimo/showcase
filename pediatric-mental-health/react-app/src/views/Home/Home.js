import { useGetLessonsQuery } from '../../app/services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentLesson } from '../../app/uiSlice';
import { useEffect, useState } from 'react';

const Home = (props) => {
	const [paginationVars, setPaginationVars] = useState({ first: 15, after: null, last: null, before: null });
	const { data } = useGetLessonsQuery(paginationVars);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [paginationVars]);

	return (
		<div className="container">
			<h2 className="mb-4">Lessons:</h2>
			{data?.lessons && (
				<ul className="space-y-10">
					{data?.lessons.map((lesson) => (
						<li key={lesson.databaseId} className="space-y-1">
							<p className="text-sm">
								{lesson.lessonTopics?.nodes?.length > 0 ? lesson.lessonTopics.nodes[0].name : 'NO_TOPIC'} &mdash;{' '}
								{lesson.lessonAudiences?.nodes?.length > 0 ? lesson.lessonAudiences.nodes[0].slug : 'NO_AUDIENCE'}
							</p>
							<h4>
								<button
									className="link"
									onClick={() => {
										dispatch(setCurrentLesson(lesson));
										navigate(lesson.permalink ? `${lesson.permalink}/checkin` : `/${lesson.slug}/checkin`);
									}}>
									{lesson.title}
								</button>
							</h4>
							<p className="text-sm">
								<b>Read section audio:</b> {lesson.lessonsMeta?.readSection?.audioTrack?.mediaItemUrl}
							</p>
							<p className="text-sm">
								<b>Remember section audio:</b> {lesson.lessonsMeta?.rememberSection?.audioTrack?.mediaItemUrl}
							</p>
						</li>
					))}
				</ul>
			)}
			<nav className="flex items-center justify-between py-14">
				<button
					className="btn-primary"
					disabled={!data?.pageInfo?.hasPreviousPage}
					onClick={() => {
						setPaginationVars({ first: null, after: null, last: 15, before: `"${data.pageInfo.startCursor}"` });
					}}>
					Previous
				</button>

				<button
					className="btn-primary"
					disabled={!data?.pageInfo?.hasNextPage}
					onClick={() => {
						setPaginationVars({ first: 15, after: `"${data.pageInfo.endCursor}"`, last: null, before: null });
					}}>
					Next
				</button>
			</nav>
		</div>
	);
};

export default Home;
