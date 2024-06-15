import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BendLogo from '../../assets/images/bend-logo.svg';
import { Player } from '@lottiefiles/react-lottie-player';
import LoadingAnimation from '../../assets/icons/bend-loading-animation.json';

const LoadingScreen = ({ visible }) => {
	return createPortal(
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex flex-col place-content-center items-center bg-white transition">
					<div className="container flex  flex-col  place-content-center items-center	 -mt-9">
						<div className="load-animation">
							<Player
								src={LoadingAnimation}
								className="player"
								loop
								autoplay
								style={{ height: '220px' }}
							/>
						</div>
						<div className="load-logo w-40 lg:w-48 -mt-10 md:-mt-5">
							<img src={BendLogo} alt="Bend Logo" />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.getElementById('root')
	);
};

export default LoadingScreen;
