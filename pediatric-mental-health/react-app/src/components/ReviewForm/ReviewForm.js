import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReviewFormValues, setShowEndOfSection } from '../../app/uiSlice';
import { ReactComponent as Checkmark } from '../../assets/icons/checkmark.svg';
import { useSoundEffects } from '../../helpers/useSoundEffects';

const FreeformInput = ({ id, updateHandler }) => {
	const { reviewFormValues } = useSelector((state) => state.ui);
	const [answer, setAnswer] = useState(reviewFormValues ? reviewFormValues[id] : null);
	return (
		<div className="relative">
			<input
				type="text"
				value={answer ?? ''}
				onChange={(ev) => {
					setAnswer(ev.target.value);
					updateHandler(id, ev.target.value);
				}}
				placeholder="Enter your answer"
				className="p2 block w-full rounded-2xl border border-gray-200 px-4 py-3 pr-13 font-bold text-teal-400 placeholder:font-normal placeholder:text-gray-300 focus:border-[#25AA52] focus-visible:outline-[#25AA52] lg:px-5 lg:pr-16"
			/>
			<div
				className={`absolute top-1/2 right-4 flex h-6 w-6 -translate-y-1/2 flex-col items-center justify-center rounded-full ${
					answer ? 'bg-green-400' : 'bg-transparent'
				} border border-gray-200 text-white transition ease-out-quad lg:right-5 lg:h-7.5 lg:w-7.5`}>
				<Checkmark />
			</div>
		</div>
	);
};

const MultipleChoiceInput = ({ id, choices, updateHandler }) => {
	const { reviewFormValues } = useSelector((state) => state.ui);

	return (
		<ul className="space-y-4">
			{choices?.map((choice, choiceIdx) => (
				<li
					key={`field-choice-${choiceIdx}`}
					className="p3 flex items-center space-x-3 font-bold hover:cursor-pointer lg:space-x-5"
					onClick={() => {
						if (!reviewFormValues || !reviewFormValues[id]) {
							updateHandler(id, [choiceIdx]);
							return;
						}

						const copy = [...reviewFormValues[id]];

						copy.splice(reviewFormValues[id].indexOf(choiceIdx), 1);

						const returnValue = reviewFormValues[id].includes(choiceIdx) ? copy : [...reviewFormValues[id], choiceIdx];

						updateHandler(id, returnValue);
					}}>
					<div
						className={`flex h-6 w-6 flex-col items-center justify-center rounded-full ${
							reviewFormValues && reviewFormValues[id]?.includes(choiceIdx) ? 'bg-green-400' : 'bg-transparent'
						} border border-gray-200 text-white transition ease-out-quad lg:h-7.5 lg:w-7.5`}>
						<Checkmark />
					</div>
					<span>{choice.label}</span>
				</li>
			))}
		</ul>
	);
};

const ReviewForm = (props) => {
	const dispatch = useDispatch();
	const { playSoundEffect } = useSoundEffects();
	const { currentLesson, reviewFormValues } = useSelector((state) => state.ui);

	const updateHandler = (fieldId, fieldValue) => {
		const b = reviewFormValues ? { ...reviewFormValues } : {};

		b[fieldId] = fieldValue;

		dispatch(setReviewFormValues(b));
	};

	return (
		<div className="h-screen overflow-y-auto py-11.5 pt-27 lg:px-5 lg:pt-27">
			<div className="container max-w-screen-contain text-center">
				<h2 className="h1 mb-8.5 lg:mb-13">Let's review!</h2>
			</div>
			<div className="max-w-5xl space-y-7.5 bg-white py-13 px-6 shadow-card lg:mx-auto lg:space-y-13 lg:rounded-[60px] lg:py-18 lg:px-20">
				{currentLesson?.lessonsMeta?.reviewSection?.fields &&
					currentLesson?.lessonsMeta?.reviewSection?.fields.map((field, idx) => (
						<div key={`review-field-${idx}`}>
							<p className="p3 mb-3">{field.title}</p>
							{field.type === 'freeform' && <FreeformInput id={`review-field-${idx}`} updateHandler={updateHandler} />}
							{field.type !== 'freeform' && field.choices && (
								<MultipleChoiceInput id={`review-field-${idx}`} choices={field.choices} updateHandler={updateHandler} />
							)}
						</div>
					))}
				<button
					className="btn-primary mx-auto block"
					onClick={() => {
						playSoundEffect('StandardBtnPress');
						dispatch(setShowEndOfSection(true));
					}}>
					Continue
				</button>
			</div>
		</div>
	);
};

export default ReviewForm;
