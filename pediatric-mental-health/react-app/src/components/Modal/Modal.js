import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { toggleModal } from '../../app/uiSlice';

const Modal = ({ id, children, showClose = true }) => {
	const dispatch = useDispatch();
	const modalsOpen = useSelector((state) => state.ui.modalsOpen);

	const overlayVariants = {
		initial: { opacity: 0 },
		visible: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const contentVariants = {
		initial: { y: '10%' },
		visible: { y: '0', transition: { duration: 0.5, ease: [0.5, 1, 0.89, 1] } },
		exit: { y: '-20%', transition: { duration: 0.5, ease: [0.5, 1, 0.89, 1] } },
	};

	return createPortal(
		<AnimatePresence>
			{modalsOpen.indexOf(id) > -1 && (
				<motion.div
					className="fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center bg-gray-500/80 backdrop-blur	"
					initial="initial"
					animate="visible"
					exit="exit"
					variants={overlayVariants}
					onClick={() => {
						dispatch(toggleModal(id));
					}}>
					<motion.div
						className="relative max-h-[80vh] w-full max-w-[90%] flex-col   lg:h-auto lg:w-3/4 lg:max-w-3xl"
						variants={contentVariants}
						onClick={(e) => e.stopPropagation()}>
						{showClose && (
							<button
								onClick={() => {
									dispatch(toggleModal(id));
								}}
								className="btn-primary absolute -top-24 right-2/4 translate-x-1/2 p-5">
								<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0.367112 10.3102C-0.0234123 10.7008 -0.0234123 11.3339 0.367112 11.7245C0.757636 12.115 1.3908 12.115 1.78133 11.7245L6.08311 7.42267L10.3849 11.7245C10.7754 12.115 11.4086 12.115 11.7991 11.7245C12.1896 11.3339 12.1896 10.7008 11.7991 10.3102L7.49733 6.00845L11.7987 1.70711C12.1892 1.31658 12.1892 0.683417 11.7987 0.292893C11.4081 -0.0976313 10.775 -0.0976309 10.3845 0.292894L6.08311 4.59424L1.78177 0.292895C1.39124 -0.0976298 0.758079 -0.0976298 0.367554 0.292895C-0.0229699 0.683419 -0.0229699 1.31658 0.367554 1.70711L4.6689 6.00845L0.367112 10.3102Z"
										fill="#292927"
									/>
								</svg>
							</button>
						)}

						<div className="overflow-hidden rounded-3xl	p-0">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.getElementById('root')
	);
};

export default Modal;
