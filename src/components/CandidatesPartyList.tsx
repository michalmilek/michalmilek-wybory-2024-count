import { Box, Text, UnorderedList } from "@chakra-ui/react";
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
		<Box
			p={4}
			borderWidth={1}
			borderColor="gray.600"
			boxShadow="xl">
			<Text
				fontSize="xl"
				fontWeight="bold"
				mb={4}>
				Lista numer: {listNumber} - Liczba głosów {partyCount}
			</Text>
			<UnorderedList spacing={3}>
				{candidates.map((candidate, index) => (
					<CandidateItem
						handleIncrease={handleIncrease}
						handleDecrease={handleDecrease}
						key={candidate["Nazwisko i imiona"] + index}
						candidate={candidate}
					/>
				))}
			</UnorderedList>
		</Box>
	);
};

export default CandidatesPartyList;
