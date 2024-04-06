import { useState } from "react";
import { Candidate } from "src/types/candidate_type";

interface Props {
	candidate: Candidate;
	handleIncrease: VoidFunction;
	handleDecrease: VoidFunction;
}

const CandidateItem = ({
	candidate,
	handleDecrease: handlePartyDecrease,
	handleIncrease: handlePartyIncrease,
}: Props) => {
	const [count, setCount] = useState(0);

	const handleDecrease = () => {
		if (count > 0) {
			setCount(count - 1);
			handlePartyDecrease();
		}
	};

	const handleIncrease = () => {
		setCount(count + 1);
		handlePartyIncrease();
	};

	return (
		<li className="flex items-center space-x-2">
			<span className="text-gray-500">
				{candidate["Pozycja na liście"] ||
					candidate["Numer na karcie do głosowania"]}
				. {candidate["Nazwisko i imiona"]}
			</span>
			<button
				className="px-2 py-1 bg-blue-500 text-white rounded"
				onClick={handleDecrease}>
				-
			</button>
			<span>{count}</span>
			<button
				className="px-2 py-1 bg-blue-500 text-white rounded"
				onClick={handleIncrease}>
				+
			</button>
		</li>
	);
};

export default CandidateItem;
