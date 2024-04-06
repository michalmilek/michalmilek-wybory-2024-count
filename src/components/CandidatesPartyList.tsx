import { useState } from "react";
import CandidateItem from "src/components/CandidateItem";
import { Candidate } from "src/types/candidate_type";

interface Props {
	listNumber: string;
	candidates: Candidate[];
}

const CandidatesPartyList = ({ candidates, listNumber }: Props) => {
	const [partyCount, setPartyCount] = useState(0);

	const handleDecrease = () => {
		if (partyCount > 0) {
			setPartyCount(partyCount - 1);
		}
	};

	const handleIncrease = () => {
		setPartyCount(partyCount + 1);
	};

	return (
		<div>
			<h3>
				Lista numer: {listNumber} - Liczba głosów ${partyCount}
			</h3>
			<ul>
				{candidates.map((candidate, index) => (
					<CandidateItem
						handleIncrease={handleIncrease}
						handleDecrease={handleDecrease}
						key={candidate["Nazwisko i imiona"] + index}
						candidate={candidate}
					/>
				))}
			</ul>
		</div>
	);
};

export default CandidatesPartyList;
