import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import soundRiveSrc from '../../assets/rive-animations/global_sound.riv';

const RiveSoundwave = ({ containerClasses, stateToggle = false }) => {
	const { globallyMuted, userInteraction } = useSelector((state) => state.ui);

	const { rive, RiveComponent } = useRive({
		src: soundRiveSrc,
		stateMachines: ['State Machine 1'],
		autoplay: true,
	});

	const stateTriggerInput = useStateMachineInput(rive, 'State Machine 1', 'Toggle');

	useEffect(() => {
		if (!stateTriggerInput) return;

		stateTriggerInput.value = userInteraction === false ? true : globallyMuted ? false : stateToggle;
	}, [stateToggle, stateTriggerInput, globallyMuted, userInteraction]);

	return (
		<div className={`aspect-square ${containerClasses}`}>
			<RiveComponent />
		</div>
	);
};

export default RiveSoundwave;
