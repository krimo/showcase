import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setHoverSate, setHoverSateCurrentText } from '../../app/uiSlice';
import { useHoverDirty } from 'react-use';

const HoverEncapsulate = (props) => {
	const dispatch = useDispatch();
	const ref = React.useRef(null);
	const hovered = useHoverDirty(ref);

	useEffect(() => {
		let buttonText = '';
		
		if (hovered) {
			dispatch(setHoverSate(true));
		} else {
			dispatch(setHoverSate(false));
		}
		if(props.currentSlideHovered.isNext !== undefined){
			if (props.currentSlideHovered.isNext === true) {
				buttonText = 'Drag';
				dispatch(setHoverSateCurrentText(buttonText));
			}
		}
			if(props.currentSlideHovered.isPrev !== undefined){
			if (props.currentSlideHovered.isPrev === true) {
				buttonText = 'Drag';
				dispatch(setHoverSateCurrentText(buttonText));
			}
		}
			if(props.currentSlideHovered.isActive !== undefined){
			if (props.currentSlideHovered.isActive === true) {
				buttonText = 'Select';
				dispatch(setHoverSateCurrentText(buttonText));
			}
		}
		// console.log(props.currentSlideHovered)

		// if(props.currentSlideHovered === 'Btn'){
		// 	buttonText = 'Btn';
		// 	dispatch(setHoverSateCurrentText(buttonText));
		// }

	}, [hovered, props.currentSlideHovered.isActive,props.currentSlideHovered.isPrev,props.currentSlideHovered.isNext, dispatch]);
	return (
		<div ref={ref}>
			{props.children}
		</div>
	);
};

export default HoverEncapsulate;
