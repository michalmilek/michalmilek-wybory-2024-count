import { Button, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CountyCandidate } from "src/types/county_candidate_type";

interface Props {
	candidate: CountyCandidate;
	handleIncrease: VoidFunction;
	handleDecrease: VoidFunction;
}

const CountyElectionItem = ({
	candidate,
	handleDecrease: handlePartyDecrease,
	handleIncrease: handlePartyIncrease,
}: Props) => {
	const localStorageKey = `votes-${
		candidate["Nazwisko i imiona"] +
		candidate["Nr okręgu"] +
		candidate["Nazwa komitetu"]
	}`;

	const [count, setCount] = useState(() => {
		return Number(localStorage.getItem(localStorageKey)) || 0;
	});

	useEffect(() => {
		localStorage.setItem(localStorageKey, count.toString());
	}, [count, localStorageKey]);

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
		<ListItem className="flex items-center space-x-2">
			<Text>
				{candidate["Pozycja na liście"]}. {candidate["Nazwisko i imiona"]}
			</Text>
			<Button
				size="sm"
				colorScheme="blue"
				onClick={handleDecrease}>
				-
			</Button>
			<Text>{count}</Text>
			<Button
				size="sm"
				colorScheme="blue"
				onClick={handleIncrease}>
				+
			</Button>
		</ListItem>
	);
};

export default CountyElectionItem;
