import { Button, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PresidentCandidate } from "src/types/president_type";

interface Props {
	presidentCandidate: PresidentCandidate;
}

const PresidentItem = ({ presidentCandidate }: Props) => {
	const localStorageKey = `votes-president-${
		presidentCandidate["Nazwisko i imiona"] +
		presidentCandidate.Obszar +
		presidentCandidate["Nazwa komitetu"]
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
		}
	};

	const handleIncrease = () => {
		setCount(count + 1);
	};

	return (
		<ListItem className="flex items-center space-x-2">
			<Text>
				{presidentCandidate["Numer na karcie do głosowania"]}.{" "}
				<span className="font-bold">
					{presidentCandidate["Nazwisko i imiona"]}{" "}
				</span>
				{presidentCandidate["Nazwa komitetu"]}
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

export default PresidentItem;
