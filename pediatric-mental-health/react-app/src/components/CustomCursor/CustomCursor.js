import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useMouse } from 'react-use';
// import { useEffect } from 'react';
// import { setCursorVariant } from '../../app/uiSlice';

const CustomCursor = ({ targetRef }) => {
	// const dispatch = useDispatch();
	const { cursorVariant } = useSelector((state) => state.ui);
	const { docX, docY } = useMouse(targetRef);

	let mouseXPos = docX;
	let mousYPos = docY;

	const variants = {
		default: {
			backgroundColor: '#EED65B',
			scale: 0.2,
			x: mouseXPos - 45,
			y: mousYPos - 45,
			borderColor: 'rgba(0,0,0,0)',
		},
		ctaHover: {
			backgroundColor: '#EED65B',
			scale: 0.1,
			x: mouseXPos - 40,
			y: mousYPos - 40,
			borderColor: 'rgba(0,0,0,0)',
		},
		drag: {
			backgroundColor: 'rgba(255,255,255,0.75)',
			scale: 1,
			x: mouseXPos - 50,
			y: mousYPos - 50,
			borderColor: 'rgba(0,0,0,1)',
		},
		select: {
			backgroundColor: '#EED65B',
			scale: 1.2,
			x: mouseXPos - 50,
			y: mousYPos - 50,
			borderColor: 'rgba(0,0,0,1)',
		},
		party: {
			backgroundColor: '#EED65B',
			scale: 1.2,
			x: mouseXPos - 50,
			y: mousYPos - 50,
			borderColor: 'rgba(0,0,0,1)',
		},
	};

	const spring = {
		type: 'spring',
		stiffness: 500,
		damping: 28,
		delayChildren: 0.1,
	};

	// useEffect(() => {
	// 	document.querySelectorAll('.btn-primary').forEach((primaryButton) => {
	// 		primaryButton.addEventListener('mouseenter', (ev) => {
	// 			dispatch(setCursorVariant('ctaHover'));
	// 		});

	// 		primaryButton.addEventListener('mouseleave', (ev) => {
	// 			dispatch(setCursorVariant('default'));
	// 		});

	// 		primaryButton.addEventListener('click', (ev) => {
	// 			dispatch(setCursorVariant('default'));
	// 		});
	// 	});
	// }, [dispatch]);

	return (
		<motion.div
			variants={variants}
			className="pointer-events-none fixed top-0 left-0 z-50 hidden h-25 w-25 overflow-hidden rounded-full border border-black bg-white text-center text-sm backdrop-blur-sm lg:block -mt-3 -ml-3"
			animate={cursorVariant}
			transition={spring}
			onDrag={(ev) => {
				console.log(ev);
			}}>
			{['select', 'drag', 'party'].map((v) =>
				cursorVariant === v ? (
					<motion.span
						key={`cursor-text-${v}`}
						className="subhead-two inline-block leading-25"
						initial={{ opacity: 0, y: '20%' }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: '-20%' }}
						transition={{ duration: 0.5 }}>
						{cursorVariant}
					</motion.span>
				) : null
			)}
		</motion.div>
	);
};

export default CustomCursor;
