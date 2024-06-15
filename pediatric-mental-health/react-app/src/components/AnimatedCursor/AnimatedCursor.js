import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useMouse } from 'react-use';
import { useSelector } from 'react-redux';

// import { isMobile } from 'react-device-detect';

import './style.css';


const AnimatedCursor = (props) => {
	
	const cursorRef = useRef(null);
	const cursorSize = 1;
	const lerpSpeed = 0.1;
	const scale = useMotionValue(0);
	const cursorX = useMotionValue(0);
	const cursorY = useMotionValue(400);
	const { docX, docY } = useMouse(cursorRef);
	const {  hoverSateCurrentText } = useSelector((state) => state.ui);

	useEffect(() => {
		let rAf;

		function lerp(start, end, amt) {
			return (1 - amt) * start + amt * end;
		}

		const moveCursor = (e) => {
			const currentX = cursorX.get();
			const currentY = cursorY.get();
			const targetX = lerp(currentX, docX - window.scrollX - cursorSize / 2, lerpSpeed);
			const targetY = lerp(currentY, docY - window.scrollY - cursorSize / 2, lerpSpeed);

			cursorX.set(targetX);
			cursorY.set(targetY);

			if (document.body.classList.contains('ButtonHovered') && scale.get() === 1) scale.set(0);
			if (!document.body.classList.contains('ButtonHovered') && scale.get() === 0) scale.set(1);

			rAf = window.requestAnimationFrame(moveCursor);
		};

		moveCursor();

		return () => {
			window.cancelAnimationFrame(rAf);
		};
		
	}, [scale, cursorX, cursorY, docX, docY]);

	let circleClass = 'animatedcursor';
	
	if(hoverSateCurrentText === 'Drag'){
		circleClass = 'animatedcursorDrag';
	} 

	if(hoverSateCurrentText === 'Btn'){
		circleClass = 'animatedcursorBtn';
	} 

	if(props.visibleCursor === null){
		circleClass = 'animatedcursorDefault';
	}

	return (
		<motion.div
			className={circleClass}
			style={{ x: cursorX, y: cursorY, scale: scale }}
			initial={{ opacity: 0,x: 400, y: 400 }}
			animate={{opacity: 1}}
			exit={{ opacity: 0,x: 400, y: 400 }}
			ref={cursorRef}
			>	
				{hoverSateCurrentText}
			</motion.div>
	);
};

export default AnimatedCursor;
